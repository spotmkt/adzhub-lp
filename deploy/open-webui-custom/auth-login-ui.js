(function () {
  'use strict';

  var path = window.location.pathname || '';
  if (path.indexOf('/auth') !== 0) return;

  var LOGO_URL = '/static/adzhub-logo.png';
  var APP_ORIGIN = 'https://app.adzhub.com.br';
  var applied = false;

  function findFormWrapper(form) {
    var el = form.parentElement;
    while (el && el !== document.body) {
      if (el.className && typeof el.className === 'string' && el.className.indexOf('max-w-md') !== -1) {
        return el;
      }
      el = el.parentElement;
    }
    return form.parentElement;
  }

  function transformAuthPage() {
    if (applied) return;

    var form = document.querySelector('#auth-container form');
    if (!form) return;

    var formWrapper;
    try {
      formWrapper = form.closest('.sm\\:max-w-md') || findFormWrapper(form);
    } catch (e) {
      formWrapper = findFormWrapper(form);
    }
    if (!formWrapper) return;

    // --- 1. Logo ---
    var logoWrap = document.createElement('div');
    logoWrap.className = 'adzhub-auth-logo';
    var logoImg = document.createElement('img');
    logoImg.src = LOGO_URL;
    logoImg.alt = 'AdzHub';
    logoImg.draggable = false;
    logoWrap.appendChild(logoImg);
    formWrapper.insertBefore(logoWrap, formWrapper.firstChild);

    // --- 2. Tab bar ---
    var tabBar = document.createElement('div');
    tabBar.className = 'adzhub-auth-tabs';

    var loginTab = document.createElement('button');
    loginTab.type = 'button';
    loginTab.className = 'adzhub-tab active';
    loginTab.textContent = 'Login';

    var signupTab = document.createElement('button');
    signupTab.type = 'button';
    signupTab.className = 'adzhub-tab';
    signupTab.textContent = 'Criar Conta';

    tabBar.appendChild(loginTab);
    tabBar.appendChild(signupTab);
    formWrapper.insertBefore(tabBar, form);

    function updateTabs(mode) {
      if (mode === 'signup') {
        loginTab.classList.remove('active');
        signupTab.classList.add('active');
      } else {
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
      }
    }

    var existingToggle = formWrapper.querySelector('button.font-medium.underline');
    if (!existingToggle) {
      signupTab.style.display = 'none';
      loginTab.style.flex = '1';
    }

    loginTab.addEventListener('click', function () {
      if (!loginTab.classList.contains('active')) {
        if (existingToggle) existingToggle.click();
        updateTabs('signin');
      }
    });

    signupTab.addEventListener('click', function () {
      if (!signupTab.classList.contains('active')) {
        if (existingToggle) {
          existingToggle.click();
          updateTabs('signup');
        }
      }
    });

    // --- 3. Heading text ---
    var heading = form.querySelector('.text-2xl');
    if (heading) {
      heading.setAttribute('data-original', heading.textContent);
      heading.textContent = 'Bem-vindo de volta';
      heading.style.fontWeight = '700';
      heading.style.color = '#1a1a1a';
    }

    // --- 4. Labels & placeholders ---
    var labels = form.querySelectorAll('label');
    labels.forEach(function (label) {
      var text = label.textContent.trim();
      if (text === 'Email' || text === 'E-mail') {
        label.textContent = 'E-mail';
      } else if (text === 'Senha' || text === 'Password') {
        label.textContent = 'Senha';
      }
    });

    var inputs = form.querySelectorAll('input');
    inputs.forEach(function (input) {
      if (input.type === 'email' || input.name === 'email') {
        input.placeholder = 'Seu e-mail';
      } else if (input.type === 'password' || input.name === 'password') {
        input.placeholder = 'Digite sua senha';
      }
    });

    // --- 5. Hide original "Don't have an account?" text ---
    var toggleSection = formWrapper.querySelector('.mt-4.text-sm.text-center');
    if (toggleSection) {
      toggleSection.style.display = 'none';
    }

    var forgotWrap = null;

    // --- 6. "Esqueceu a senha?" link + texto do botão (i18n upstream) ---
    var submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      var st = (submitBtn.textContent || '').trim();
      if (st === 'Sign in' || st === 'Authenticate') {
        submitBtn.textContent = 'Entrar';
      }

      forgotWrap = document.createElement('div');
      forgotWrap.className = 'adzhub-forgot-password';
      var forgotLink = document.createElement('a');
      forgotLink.href = APP_ORIGIN + '/forgot-password';
      forgotLink.textContent = 'Esqueceu a senha?';
      forgotLink.target = '_blank';
      forgotLink.rel = 'noopener';
      forgotWrap.appendChild(forgotLink);

      var btnParent = submitBtn.closest('.mt-5') || submitBtn.parentElement;
      if (btnParent && btnParent.parentElement) {
        btnParent.parentElement.insertBefore(forgotWrap, btnParent.nextSibling);
      }
    }

    // --- 7. Footer ---
    var footer = document.createElement('div');
    footer.className = 'adzhub-auth-footer';
    footer.innerHTML =
      '<a href="' + APP_ORIGIN + '/terms" target="_blank" rel="noopener">Termos de uso</a>' +
      '<span class="adzhub-footer-dot">&middot;</span>' +
      '<a href="' + APP_ORIGIN + '/privacy" target="_blank" rel="noopener">Privacidade</a>';

    var authContainer = document.getElementById('auth-container');
    if (authContainer) {
      authContainer.appendChild(footer);
    }

    // --- 8. Só reage a mudanças de estrutura (signup), sem characterData — evita
    //     reescrever o DOM a cada tecla e quebrar os handlers do Svelte/cliques ---
    var modeObs = new MutationObserver(function () {
      var h = form.querySelector('.text-2xl');
      if (!h) return;
      var t = (h.textContent || '').trim();
      if (t.indexOf('Criar conta') !== -1 || t.indexOf('Sign up') !== -1 || t.indexOf('Cadastre') !== -1) {
        if (t !== 'Crie sua conta') h.textContent = 'Crie sua conta';
        updateTabs('signup');
        if (forgotWrap) forgotWrap.style.display = 'none';
      } else if (t.indexOf('Bem-vindo') === -1 && (t.indexOf('Sign in') !== -1 || t.indexOf('Faça login') !== -1 || t.indexOf('login') !== -1)) {
        if (t !== 'Bem-vindo de volta') h.textContent = 'Bem-vindo de volta';
        updateTabs('signin');
        if (forgotWrap) forgotWrap.style.display = 'block';
      }

      var ts = formWrapper.querySelector('.mt-4.text-sm.text-center');
      if (ts) ts.style.display = 'none';
    });
    modeObs.observe(form, { childList: true, subtree: true });

    document.documentElement.classList.add('adzhub-auth-page');
    applied = true;
  }

  function init() {
    var obs = new MutationObserver(function () {
      if (!applied) {
        try {
          transformAuthPage();
        } catch (e) {
          /* evita quebrar a página se o DOM mudar */
        }
      }
    });
    if (document.body) {
      obs.observe(document.body, { childList: true, subtree: true });
    }
    try {
      transformAuthPage();
    } catch (e) {}
    if (!document.body) {
      document.addEventListener('DOMContentLoaded', function () {
        obs.observe(document.body, { childList: true, subtree: true });
        try {
          transformAuthPage();
        } catch (e) {}
      });
    }
  }

  init();
})();
