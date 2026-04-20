/**
 * AdzHub Mask Editor — injetado no Open WebUI via <script> no index.html.
 *
 * Observa imagens nas mensagens do chat e adiciona um botão (ícone de lápis) para editar.
 * Ao clicar, abre um modal com canvas para pintar máscara + prompt,
 * chama a Edge Function edit-image-mask no Supabase e exibe o resultado.
 */
;(function () {
  'use strict'

  // ── Config ────────────────────────────────────────────────────────
  const SUPABASE_URL = 'https://xciubsogktecqcgafwaa.supabase.co'
  const EDGE_FN = `${SUPABASE_URL}/functions/v1/edit-image-mask`
  const SUPABASE_ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjaXVic29na3RlY3FjZ2Fmd2FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NjMyMzAsImV4cCI6MjA3MDMzOTIzMH0.0TTqMujpYz86Y911ykpgqO1VhyNcQ1UhbtTd3gwWyn0'
  const MARKER = 'data-adzhub-mask-btn'
  const BLUE = '#3960A5'
  const BLUE_HOVER = '#2D4E8A'
  const ADZ_BG = '#f5f0eb'
  const ADZ_CARD = '#ffffff'
  const ADZ_BORDER = '#ede8df'
  const ADZ_TEXT = '#152040'
  const ADZ_MUTED = '#6b6560'
  const ADZ_INPUT_BG = '#f7f4ef'
  const ORANGE = '#ff9900'
  const BRUSH_RGBA = 'rgba(57, 96, 165, 0.55)'

  // ── Helpers ───────────────────────────────────────────────────────
  function imgToDataURL(img) {
    return new Promise((resolve, reject) => {
      if (img.src.startsWith('data:')) return resolve(img.src)
      const c = document.createElement('canvas')
      const copy = new Image()
      copy.crossOrigin = 'anonymous'
      copy.onload = () => {
        c.width = copy.naturalWidth
        c.height = copy.naturalHeight
        c.getContext('2d').drawImage(copy, 0, 0)
        resolve(c.toDataURL('image/png'))
      }
      copy.onerror = reject
      copy.src = img.src
    })
  }

  async function dataUrlToFile(dataUrl, filename) {
    const res = await fetch(dataUrl)
    const blob = await res.blob()
    return new File([blob], filename, {
      type: blob.type?.startsWith?.('image/') ? blob.type : 'image/png',
    })
  }

  /**
   * Tenta anexar imagem ao compositor do Open WebUI (input file visível fora do modal).
   */
  async function attachImageToChatComposer(dataUrl, filename, overlayEl) {
    try {
      const file = await dataUrlToFile(dataUrl, filename)
      const inputs = Array.from(
        document.querySelectorAll('input[type="file"]')
      ).filter((el) => {
        if (overlayEl.contains(el)) return false
        if (el.disabled) return false
        const r = el.getBoundingClientRect()
        return r.width > 0 || r.height > 0 || el.offsetParent !== null
      })
      for (const input of inputs) {
        try {
          const dt = new DataTransfer()
          dt.items.add(file)
          input.files = dt.files
          input.dispatchEvent(new Event('change', { bubbles: true }))
          input.dispatchEvent(new Event('input', { bubbles: true }))
          return true
        } catch (_) {
          /* tenta próximo input */
        }
      }
    } catch (e) {
      console.warn('adzhub-mask-editor: attachImageToChatComposer', e)
    }
    return false
  }

  function mountCompareSlider(rootEl, beforeUrl, afterUrl) {
    rootEl.style.setProperty('--adz-pos', '50')
    rootEl.innerHTML = `
      <div class="adz-compare-inner">
        <img class="adz-compare-after" alt="Depois" />
        <div class="adz-compare-before-clip">
          <img class="adz-compare-before" alt="Antes" />
        </div>
        <div class="adz-compare-handle" title="Arrastar"></div>
        <div class="adz-compare-labels"><span>Antes</span><span>Depois</span></div>
      </div>
    `
    rootEl.querySelector('.adz-compare-after').src = afterUrl
    rootEl.querySelector('.adz-compare-before').src = beforeUrl

    const inner = rootEl.querySelector('.adz-compare-inner')
    const handle = rootEl.querySelector('.adz-compare-handle')
    let dragging = false

    function setPosFromClientX(clientX) {
      const rect = inner.getBoundingClientRect()
      let p = ((clientX - rect.left) / rect.width) * 100
      p = Math.max(1, Math.min(99, p))
      rootEl.style.setProperty('--adz-pos', String(p))
    }

    handle.addEventListener('mousedown', (e) => {
      e.preventDefault()
      dragging = true
    })
    inner.addEventListener('mousedown', (e) => {
      if (e.target === handle || handle.contains(e.target)) return
      dragging = true
      setPosFromClientX(e.clientX)
    })
    window.addEventListener('mousemove', (e) => {
      if (!dragging) return
      setPosFromClientX(e.clientX)
    })
    window.addEventListener('mouseup', () => {
      dragging = false
    })
    handle.addEventListener(
      'touchstart',
      (e) => {
        e.preventDefault()
        dragging = true
      },
      { passive: false }
    )
    inner.addEventListener(
      'touchstart',
      (e) => {
        if (e.target === handle || handle.contains(e.target)) return
        dragging = true
        setPosFromClientX(e.touches[0].clientX)
      },
      { passive: false }
    )
    window.addEventListener('touchmove', (e) => {
      if (!dragging || !e.touches[0]) return
      setPosFromClientX(e.touches[0].clientX)
    })
    window.addEventListener('touchend', () => {
      dragging = false
    })
  }

  // ── Inject CSS once ───────────────────────────────────────────────
  const style = document.createElement('style')
  style.textContent = `
    .adz-mask-btn{position:absolute;top:6px;right:6px;z-index:20;display:none;align-items:center;justify-content:center;width:34px;height:34px;padding:0;border-radius:10px;border:none;background:${BLUE};color:#fff;cursor:pointer;box-shadow:0 2px 10px rgba(57,96,165,.35);transition:background .15s;flex-shrink:0}
    .adz-mask-btn:hover{background:${BLUE_HOVER}}
    .adz-img-wrap:hover .adz-mask-btn{display:inline-flex}
    .adz-mask-btn svg{width:18px;height:18px;fill:currentColor;display:block}

    .adz-modal-overlay{position:fixed;inset:0;z-index:99999;background:rgba(11,17,33,.45);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;animation:adz-fade-in .2s}
    @keyframes adz-fade-in{from{opacity:0}to{opacity:1}}
    .adz-modal{background:${ADZ_CARD};border:1px solid ${ADZ_BORDER};border-radius:16px;max-width:95vw;max-height:95vh;overflow:auto;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(21,32,64,.12)}
    .adz-modal-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid ${ADZ_BORDER};background:${ADZ_BG}}
    .adz-modal-header h2{color:${ADZ_TEXT};font:700 17px/1.2 "Inter",system-ui,sans-serif;margin:0}
    .adz-close-btn{background:${ADZ_INPUT_BG};border:1px solid ${ADZ_BORDER};border-radius:10px;color:${ADZ_MUTED};font-size:20px;line-height:1;cursor:pointer;padding:6px 12px}
    .adz-close-btn:hover{color:${ADZ_TEXT};border-color:${BLUE}}
    .adz-modal-body{padding:18px 20px;display:flex;flex-direction:column;gap:14px;background:${ADZ_CARD}}
    .adz-canvas-wrap{position:relative;display:inline-block;cursor:crosshair;border-radius:12px;overflow:hidden;max-width:100%;border:2px solid ${ADZ_BORDER};box-shadow:0 4px 20px rgba(21,32,64,.08)}
    .adz-canvas-wrap canvas{display:block;max-width:100%;height:auto;touch-action:none}
    .adz-toolbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:4px 0}
    .adz-toolbar label{color:${ADZ_MUTED};font:500 13px/1 "Inter",system-ui,sans-serif;display:flex;align-items:center;gap:8px}
    .adz-toolbar input[type=range]{width:120px;accent-color:${BLUE}}
    .adz-tool-btn{padding:8px 14px;border-radius:10px;border:1px solid ${ADZ_BORDER};background:${ADZ_CARD};color:${ADZ_TEXT};font:500 13px/1 "Inter",system-ui,sans-serif;cursor:pointer;transition:background .15s,border-color .15s}
    .adz-tool-btn:hover{background:${ADZ_INPUT_BG};border-color:#ddd9d0}
    .adz-tool-btn.active{background:${BLUE};border-color:${BLUE};color:#fff}
    .adz-prompt-row{display:flex;gap:10px;align-items:stretch}
    .adz-prompt-input{flex:1;padding:12px 14px;border-radius:12px;border:1px solid ${ADZ_BORDER};background:${ADZ_INPUT_BG};color:${ADZ_TEXT};font:400 14px/1.35 "Inter",system-ui,sans-serif;outline:none}
    .adz-prompt-input:focus{border-color:${BLUE};box-shadow:0 0 0 3px rgba(57,96,165,.15)}
    .adz-prompt-input::placeholder{color:${ADZ_MUTED}}
    .adz-submit-btn{padding:12px 22px;border-radius:12px;border:none;background:${ORANGE};color:#0b1121;font:600 14px/1 "Inter",system-ui,sans-serif;cursor:pointer;transition:filter .15s;white-space:nowrap}
    .adz-submit-btn:hover{filter:brightness(1.05)}
    .adz-submit-btn:disabled{opacity:.55;cursor:not-allowed;filter:none}
    .adz-result-wrap{display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap}
    .adz-result-wrap img{max-width:48%;border-radius:12px;border:1px solid ${ADZ_BORDER}}
    .adz-result-label{color:${ADZ_MUTED};font:500 12px/1 "Inter",system-ui,sans-serif;margin-bottom:6px}
    .adz-result-actions{display:flex;gap:8px;margin-top:10px}
    .adz-loader{display:inline-block;width:18px;height:18px;border:2px solid ${BLUE};border-top-color:transparent;border-radius:50%;animation:adz-spin .6s linear infinite;vertical-align:middle;margin-right:8px}
    @keyframes adz-spin{to{transform:rotate(360deg)}}
    .adz-status{color:${ADZ_MUTED};font:400 13px/1.4 "Inter",system-ui,sans-serif;min-height:22px}

    .adz-edit-section{display:flex;flex-direction:column;gap:14px;width:100%}
    .adz-compare-root{position:relative;width:100%;max-width:min(900px,96vw);margin:0 auto;--adz-pos:50;user-select:none;touch-action:none;border-radius:12px;overflow:hidden;border:1px solid ${ADZ_BORDER};background:#000}
    .adz-compare-inner{position:relative;width:100%;min-height:280px;max-height:70vh;aspect-ratio:16/10}
    .adz-compare-inner img{display:block;width:100%;height:100%;object-fit:contain}
    .adz-compare-after{position:absolute;inset:0;z-index:1}
    .adz-compare-before-clip{position:absolute;inset:0;width:calc(var(--adz-pos) * 1%);max-width:100%;overflow:hidden;z-index:2;pointer-events:none}
    .adz-compare-before-clip img{height:100%;width:100%;object-fit:contain;object-position:left center}
    .adz-compare-handle{position:absolute;top:0;bottom:0;width:3px;margin-left:-1.5px;left:calc(var(--adz-pos) * 1%);z-index:4;background:#fff;box-shadow:0 0 10px rgba(0,0,0,.4);cursor:ew-resize;pointer-events:auto}
    .adz-compare-handle::after{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:40px;height:40px;border-radius:50%;background:#fff;border:3px solid ${BLUE};box-sizing:border-box}
    .adz-compare-labels{position:absolute;bottom:8px;left:0;right:0;display:flex;justify-content:space-between;padding:0 12px;z-index:5;pointer-events:none;font:600 11px/1 "Inter",system-ui,sans-serif;text-shadow:0 1px 3px #000;color:#fff}
    .adz-chat-choice-row{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px;justify-content:center}
    .adz-chat-choice-btn{flex:1;min-width:200px;padding:12px 16px;border-radius:12px;border:2px solid ${BLUE};background:${ADZ_CARD};color:${BLUE};font:600 14px/1 "Inter",system-ui,sans-serif;cursor:pointer;transition:background .15s,color .15s}
    .adz-chat-choice-btn:hover{background:${BLUE};color:#fff}
    .adz-chat-choice-btn.adz-primary{background:${BLUE};color:#fff}
    .adz-chat-choice-btn.adz-primary:hover{background:${BLUE_HOVER};border-color:${BLUE_HOVER}}
  `
  document.head.appendChild(style)

  // ── Pencil SVG ────────────────────────────────────────────────────
  const PENCIL_SVG =
    '<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>'

  // ── Attach edit buttons to images ─────────────────────────────────
  function isOWUIImageButton(btn) {
    if (!btn || btn.tagName !== 'BUTTON') return false
    const img = btn.querySelector('img')
    if (!img) return false
    const src = img.src || ''
    if (src.includes('/api/v1/files/') || src.includes('/cache/') ||
        src.includes('oaidalleapi') || src.startsWith('blob:') ||
        src.startsWith('data:image')) return true
    if (img.classList.contains('rounded-lg') && btn.type === 'button') return true
    return false
  }

  function processImages() {
    document.querySelectorAll('button[type="button"]').forEach((btn) => {
      if (!isOWUIImageButton(btn)) return
      if (btn.querySelector(`[${MARKER}]`)) return

      const img = btn.querySelector('img')
      if (!img) return

      btn.style.position = 'relative'
      btn.classList.add('adz-img-wrap')

      const editBtn = document.createElement('button')
      editBtn.setAttribute(MARKER, '')
      editBtn.className = 'adz-mask-btn'
      editBtn.type = 'button'
      editBtn.setAttribute('aria-label', 'Editar imagem')
      editBtn.title = 'Editar imagem'
      editBtn.innerHTML = PENCIL_SVG
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        e.preventDefault()
        openMaskEditor(img)
      })
      btn.appendChild(editBtn)
    })
  }

  // ── Mask Editor Modal ─────────────────────────────────────────────
  async function openMaskEditor(imgEl) {
    let dataUrl
    try {
      dataUrl = await imgToDataURL(imgEl)
    } catch {
      alert('Não foi possível carregar a imagem.')
      return
    }

    const image = new Image()
    image.src = dataUrl
    await new Promise((r) => (image.onload = r))

    const MAX_W = Math.min(800, window.innerWidth - 80)
    const MAX_H = Math.min(600, window.innerHeight - 260)
    const scale = Math.min(MAX_W / image.naturalWidth, MAX_H / image.naturalHeight, 1)
    const cw = Math.round(image.naturalWidth * scale)
    const ch = Math.round(image.naturalHeight * scale)

    // State
    let tool = 'brush' // brush | eraser
    let brushSize = 30
    let drawing = false
    let lastX = null
    let lastY = null
    let strokes = [] // for undo: array of ImageData
    let processing = false

    // Build DOM
    const overlay = document.createElement('div')
    overlay.className = 'adz-modal-overlay'

    overlay.innerHTML = `
      <div class="adz-modal">
        <div class="adz-modal-header">
          <h2>Editar imagem</h2>
          <button class="adz-close-btn" title="Fechar">&times;</button>
        </div>
        <div class="adz-modal-body">
          <div class="adz-edit-section">
          <div class="adz-toolbar">
            <button class="adz-tool-btn active" data-tool="brush">Pincel</button>
            <button class="adz-tool-btn" data-tool="eraser">Borracha</button>
            <label>Tamanho <input type="range" min="5" max="100" value="${brushSize}"></label>
            <button class="adz-tool-btn" data-action="undo">Desfazer</button>
            <button class="adz-tool-btn" data-action="clear">Limpar</button>
          </div>
          <div class="adz-canvas-wrap" style="width:${cw}px">
            <canvas id="adz-bg-canvas" width="${cw}" height="${ch}"></canvas>
            <canvas id="adz-mask-canvas" width="${cw}" height="${ch}" style="position:absolute;top:0;left:0"></canvas>
          </div>
          <div class="adz-prompt-row">
            <input class="adz-prompt-input" placeholder="O que colocar nessa área? Ex: 'céu azul com nuvens'" />
            <button class="adz-submit-btn">Aplicar</button>
          </div>
          </div>
          <div class="adz-status"></div>
          <div class="adz-result-wrap" style="display:none"></div>
        </div>
      </div>
    `
    document.body.appendChild(overlay)

    const modal = overlay.querySelector('.adz-modal')
    const closeBtn = overlay.querySelector('.adz-close-btn')
    const bgCanvas = overlay.querySelector('#adz-bg-canvas')
    const maskCanvas = overlay.querySelector('#adz-mask-canvas')
    const bgCtx = bgCanvas.getContext('2d')
    const maskCtx = maskCanvas.getContext('2d')
    const toolBtns = overlay.querySelectorAll('[data-tool]')
    const rangeInput = overlay.querySelector('input[type=range]')
    const undoBtn = overlay.querySelector('[data-action=undo]')
    const clearBtn = overlay.querySelector('[data-action=clear]')
    const promptInput = overlay.querySelector('.adz-prompt-input')
    const submitBtn = overlay.querySelector('.adz-submit-btn')
    const statusEl = overlay.querySelector('.adz-status')
    const resultWrap = overlay.querySelector('.adz-result-wrap')

    // Draw background image
    bgCtx.drawImage(image, 0, 0, cw, ch)

    // Mask canvas setup (transparent)
    maskCtx.clearRect(0, 0, cw, ch)

    function setTool(t) {
      tool = t
      toolBtns.forEach((b) => b.classList.toggle('active', b.dataset.tool === t))
    }

    function saveStroke() {
      strokes.push(maskCtx.getImageData(0, 0, cw, ch))
    }

    function getPos(e) {
      const rect = maskCanvas.getBoundingClientRect()
      const scaleX = cw / rect.width
      const scaleY = ch / rect.height
      const t = e.touches ? e.touches[0] : e
      const clientX = t.clientX
      const clientY = t.clientY
      return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY }
    }

    /** Preenche o espaço entre dois eventos (movimento rápido) com segmentos de linha */
    function paintSegment(x0, y0, x1, y1) {
      const dist = Math.hypot(x1 - x0, y1 - y0)
      const step = Math.max(brushSize * 0.22, 2)
      const n = Math.max(1, Math.ceil(dist / step))
      let px = x0
      let py = y0
      for (let i = 1; i <= n; i++) {
        const t = i / n
        const x = x0 + (x1 - x0) * t
        const y = y0 + (y1 - y0) * t
        strokeLine(px, py, x, y)
        px = x
        py = y
      }
    }

    function strokeLine(x0, y0, x1, y1) {
      if (tool === 'eraser') {
        maskCtx.save()
        maskCtx.globalCompositeOperation = 'destination-out'
        maskCtx.lineCap = 'round'
        maskCtx.lineJoin = 'round'
        maskCtx.lineWidth = brushSize
        maskCtx.strokeStyle = 'rgba(0,0,0,1)'
        maskCtx.beginPath()
        maskCtx.moveTo(x0, y0)
        maskCtx.lineTo(x1, y1)
        maskCtx.stroke()
        maskCtx.restore()
        return
      }
      maskCtx.save()
      maskCtx.lineCap = 'round'
      maskCtx.lineJoin = 'round'
      maskCtx.lineWidth = brushSize
      maskCtx.strokeStyle = BRUSH_RGBA
      maskCtx.globalCompositeOperation = 'source-over'
      maskCtx.beginPath()
      maskCtx.moveTo(x0, y0)
      maskCtx.lineTo(x1, y1)
      maskCtx.stroke()
      maskCtx.restore()
    }

    function dab(x, y) {
      maskCtx.beginPath()
      if (tool === 'eraser') {
        maskCtx.globalCompositeOperation = 'destination-out'
        maskCtx.fillStyle = 'rgba(0,0,0,1)'
      } else {
        maskCtx.globalCompositeOperation = 'source-over'
        maskCtx.fillStyle = BRUSH_RGBA
      }
      maskCtx.arc(x, y, brushSize / 2, 0, Math.PI * 2)
      maskCtx.fill()
      maskCtx.globalCompositeOperation = 'source-over'
    }

    function paintAt(x, y) {
      if (lastX === null || lastY === null) {
        dab(x, y)
      } else {
        const dist = Math.hypot(x - lastX, y - lastY)
        if (dist > brushSize * 0.35) {
          paintSegment(lastX, lastY, x, y)
        } else {
          strokeLine(lastX, lastY, x, y)
        }
      }
      lastX = x
      lastY = y
    }

    function onPointerMove(e) {
      if (!drawing) return
      e.preventDefault()
      paintAt(getPos(e).x, getPos(e).y)
    }

    function onPointerDown(e) {
      e.preventDefault()
      saveStroke()
      drawing = true
      const p = getPos(e)
      lastX = lastY = null
      paintAt(p.x, p.y)
      window.addEventListener('mousemove', onPointerMove)
      window.addEventListener('mouseup', onPointerUp)
      window.addEventListener('touchmove', onPointerMove, { passive: false })
      window.addEventListener('touchend', onPointerUp)
    }

    function onPointerUp() {
      if (!drawing) return
      drawing = false
      lastX = lastY = null
      window.removeEventListener('mousemove', onPointerMove)
      window.removeEventListener('mouseup', onPointerUp)
      window.removeEventListener('touchmove', onPointerMove)
      window.removeEventListener('touchend', onPointerUp)
    }

    maskCanvas.addEventListener('mousedown', onPointerDown)
    maskCanvas.addEventListener('touchstart', onPointerDown, { passive: false })

    toolBtns.forEach((b) =>
      b.addEventListener('click', () => setTool(b.dataset.tool))
    )
    rangeInput.addEventListener('input', (e) => {
      brushSize = Number(e.target.value)
    })
    undoBtn.addEventListener('click', () => {
      if (strokes.length) {
        maskCtx.putImageData(strokes.pop(), 0, 0)
      }
    })
    clearBtn.addEventListener('click', () => {
      saveStroke()
      maskCtx.clearRect(0, 0, cw, ch)
    })

    function close() {
      window.removeEventListener('mousemove', onPointerMove)
      window.removeEventListener('mouseup', onPointerUp)
      window.removeEventListener('touchmove', onPointerMove)
      window.removeEventListener('touchend', onPointerUp)
      overlay.remove()
    }

    closeBtn.addEventListener('click', close)
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close()
    })

    // ── Export mask as PNG with alpha ────────────────────────────────
    // OpenAI: transparente = editar; branco opaco = preservar.
    // Usa o alpha do canvas da máscara (sem compor em branco antes).
    function exportMask() {
      const src = maskCtx.getImageData(0, 0, cw, ch).data
      const out = document.createElement('canvas')
      out.width = image.naturalWidth
      out.height = image.naturalHeight
      const ctx = out.getContext('2d')
      const id = ctx.createImageData(out.width, out.height)
      const d = id.data

      for (let y = 0; y < out.height; y++) {
        const sy = Math.min(ch - 1, Math.floor((y / out.height) * ch))
        for (let x = 0; x < out.width; x++) {
          const sx = Math.min(cw - 1, Math.floor((x / out.width) * cw))
          const si = (sy * cw + sx) * 4
          const a = src[si + 3]
          const oi = (y * out.width + x) * 4
          // Qualquer traço do pincel (incl. bordas com alpha baixo) deve virar transparente na máscara API = zona a editar.
          if (a > 2) {
            d[oi] = 0
            d[oi + 1] = 0
            d[oi + 2] = 0
            d[oi + 3] = 0
          } else {
            d[oi] = 255
            d[oi + 1] = 255
            d[oi + 2] = 255
            d[oi + 3] = 255
          }
        }
      }
      ctx.putImageData(id, 0, 0)
      return out.toDataURL('image/png')
    }

    // ── Submit ───────────────────────────────────────────────────────
    submitBtn.addEventListener('click', async () => {
      const prompt = promptInput.value.trim()
      if (!prompt) {
        promptInput.focus()
        statusEl.textContent = 'Digite o que colocar na área selecionada.'
        return
      }

      // Check if user painted something
      const maskPixels = maskCtx.getImageData(0, 0, cw, ch).data
      let hasPaint = false
      for (let i = 3; i < maskPixels.length; i += 4) {
        if (maskPixels[i] > 2) { hasPaint = true; break }
      }
      if (!hasPaint) {
        statusEl.textContent = 'Pinte a área que deseja alterar na imagem.'
        return
      }

      processing = true
      submitBtn.disabled = true
      statusEl.innerHTML = '<span class="adz-loader"></span>Processando edição com IA...'

      try {
        const maskDataUrl = exportMask()

        const res = await fetch(EDGE_FN, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            imageData: dataUrl,
            maskData: maskDataUrl,
            prompt,
          }),
        })

        const json = await res.json()

        if (!res.ok || !json.success) {
          const detail =
            typeof json.detail === 'string'
              ? json.detail.slice(0, 200)
              : ''
          throw new Error(
            [json.error || `Erro ${res.status}`, detail].filter(Boolean).join(' — ')
          )
        }

        const editSection = overlay.querySelector('.adz-edit-section')
        if (editSection) editSection.style.display = 'none'
        submitBtn.style.display = 'none'

        statusEl.textContent =
          'Arraste o controle para comparar. Depois escolha qual imagem enviar no chat.'

        resultWrap.style.display = 'flex'
        resultWrap.style.flexDirection = 'column'
        resultWrap.style.alignItems = 'stretch'
        resultWrap.style.gap = '12px'
        resultWrap.textContent = ''

        const compareRoot = document.createElement('div')
        compareRoot.className = 'adz-compare-root'
        resultWrap.appendChild(compareRoot)
        mountCompareSlider(compareRoot, dataUrl, json.editedImage)

        const choiceRow = document.createElement('div')
        choiceRow.className = 'adz-chat-choice-row'
        choiceRow.innerHTML = `
          <button type="button" class="adz-chat-choice-btn" data-chat="original">Continuar no chat — imagem original</button>
          <button type="button" class="adz-chat-choice-btn adz-primary" data-chat="edited">Continuar no chat — imagem editada</button>
        `
        resultWrap.appendChild(choiceRow)

        const dlRow = document.createElement('div')
        dlRow.className = 'adz-result-actions'
        dlRow.style.justifyContent = 'center'
        const dlBtn = document.createElement('button')
        dlBtn.type = 'button'
        dlBtn.className = 'adz-tool-btn'
        dlBtn.textContent = 'Baixar editada'
        dlRow.appendChild(dlBtn)
        resultWrap.appendChild(dlRow)

        choiceRow
          .querySelector('[data-chat="original"]')
          .addEventListener('click', async () => {
            const ok = await attachImageToChatComposer(
              dataUrl,
              'adzhub-imagem-original.png',
              overlay
            )
            statusEl.textContent = ok
              ? 'Original anexada ao campo de mensagem. Revise e envie.'
              : 'Anexo automático indisponível: use o ícone de anexo do chat e selecione a imagem (ou salve com botão direito na comparação).'
            if (ok) close()
          })

        choiceRow
          .querySelector('[data-chat="edited"]')
          .addEventListener('click', async () => {
            const ok = await attachImageToChatComposer(
              json.editedImage,
              'adzhub-imagem-editada.png',
              overlay
            )
            statusEl.textContent = ok
              ? 'Imagem editada anexada ao campo de mensagem. Revise e envie.'
              : 'Anexo automático indisponível: use “Baixar editada” e anexe manualmente no chat.'
            if (ok) close()
          })

        dlBtn.addEventListener('click', () => {
          const a = document.createElement('a')
          a.href = json.editedImage
          a.download = `edited-${Date.now()}.png`
          a.click()
        })
      } catch (err) {
        statusEl.textContent = `Erro: ${err.message}`
      } finally {
        processing = false
        submitBtn.disabled = false
      }
    })
  }

  // ── Observer: watch for new images appearing in chat ──────────────
  const observer = new MutationObserver(() => processImages())
  observer.observe(document.body, { childList: true, subtree: true })
  document.addEventListener('DOMContentLoaded', processImages)

  // Also run periodically for safety (some frameworks update DOM without mutations)
  setInterval(processImages, 3000)
})()
