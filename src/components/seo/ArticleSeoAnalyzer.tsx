import * as React from "react";
import { Link2, FileText, Loader2, Lock, Check, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useWaitlistDialog } from "@/components/WaitlistDialogProvider";

type InputMode = "url" | "text";

type DimensionScore = {
  score?: number;
  summary?: string;
};

type AuditResult = {
  title: string;
  source_url: string | null;
  overall_score: number | null;
  dimensions: Record<string, DimensionScore>;
  issues: Array<{ severity?: string; message?: string; suggestion?: string }>;
  summary: string;
  intent_facets: Array<{ label?: string; status?: string }>;
};

const DIMENSION_LABELS: Record<string, string> = {
  section_nuclei: "Estrutura",
  semantic_coverage: "Cobertura",
  semantic_density: "Densidade",
  intent_match: "Profundidade",
  human_naturalness: "Naturalidade",
  technical_onpage: "Teia",
};

const DIMENSION_ORDER = [
  "section_nuclei",
  "semantic_coverage",
  "semantic_density",
  "intent_match",
  "human_naturalness",
  "technical_onpage",
] as const;

const ANALYSIS_PHASES = [
  { id: "fetch", label: "Lendo o conteúdo do artigo" },
  { id: "structure", label: "Mapeando estrutura e núcleos semânticos" },
  { id: "coverage", label: "Avaliando cobertura e intenção de busca" },
  { id: "naturalness", label: "Checando naturalidade e sinais E-E-A-T" },
  { id: "teia", label: "Analisando teia de links e oportunidades" },
  { id: "report", label: "Montando o relatório AdzSEO" },
] as const;

const PHASE_INTERVAL_MS = 2800;

function scoreTone(score: number) {
  if (score >= 75) return "text-emerald-700";
  if (score >= 50) return "text-amber-700";
  return "text-rose-700";
}

function barTone(score: number) {
  if (score >= 75) return "bg-emerald-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-rose-500";
}

function ReportBody({ result }: { result: AuditResult }) {
  return (
    <>
      <div className="rounded-2xl border border-[#08080C]/8 bg-[#F8F8F8] p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-[#37489d] mb-1">
              Relatório AdzSEO
            </p>
            <h4 className="text-lg font-semibold text-[#08080C] leading-snug truncate">
              {result.title}
            </h4>
            {result.source_url && (
              <a
                href={result.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#6B7280] hover:text-[#37489d] truncate block mt-1"
              >
                {result.source_url}
              </a>
            )}
          </div>
          <div className="text-left sm:text-right shrink-0">
            <p className="text-xs text-[#6B7280]">Score geral</p>
            <p
              className={`text-4xl font-bold tabular-nums ${
                result.overall_score != null ? scoreTone(result.overall_score) : "text-[#08080C]"
              }`}
            >
              {result.overall_score != null ? result.overall_score : "—"}
            </p>
          </div>
        </div>

        {result.summary && (
          <p className="text-sm text-[#4B5563] leading-relaxed mb-5">{result.summary}</p>
        )}

        <div className="grid sm:grid-cols-2 gap-3">
          {DIMENSION_ORDER.map((id) => {
            const dim = result.dimensions[id];
            const score = typeof dim?.score === "number" ? dim.score : null;
            return (
              <div key={id} className="rounded-xl bg-white border border-[#08080C]/6 p-3">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-sm font-medium text-[#08080C]">
                    {DIMENSION_LABELS[id] || id}
                  </span>
                  <span
                    className={`text-sm font-semibold tabular-nums ${
                      score != null ? scoreTone(score) : "text-[#6B7280]"
                    }`}
                  >
                    {score != null ? score : "—"}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[#E5E7EB] overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all ${score != null ? barTone(score) : "bg-[#D1D5DB]"}`}
                    style={{ width: `${score != null ? Math.min(100, Math.max(0, score)) : 0}%` }}
                  />
                </div>
                {dim?.summary && (
                  <p className="text-[11px] text-[#6B7280] leading-snug line-clamp-3">
                    {dim.summary}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {result.issues.length > 0 && (
        <div className="rounded-2xl border border-[#08080C]/8 bg-white p-5">
          <p className="text-sm font-semibold text-[#08080C] mb-3">Pontos de atenção</p>
          <ul className="space-y-2">
            {result.issues.slice(0, 5).map((issue, i) => (
              <li key={`${issue.message}-${i}`} className="text-sm text-[#4B5563] leading-snug">
                <span className="font-medium text-[#08080C]">
                  {issue.severity === "critical"
                    ? "Crítico"
                    : issue.severity === "warning"
                      ? "Atenção"
                      : "Info"}
                  :
                </span>{" "}
                {issue.message}
                {issue.suggestion ? ` — ${issue.suggestion}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export function ArticleSeoAnalyzer() {
  const { openWaitlist, hasJoinedWaitlist } = useWaitlistDialog();
  const [mode, setMode] = React.useState<InputMode>("url");
  const [url, setUrl] = React.useState("");
  const [text, setText] = React.useState("");
  const [analyzing, setAnalyzing] = React.useState(false);
  const [phaseIndex, setPhaseIndex] = React.useState(0);
  const [result, setResult] = React.useState<AuditResult | null>(null);
  const [unlocked, setUnlocked] = React.useState(hasJoinedWaitlist);

  React.useEffect(() => {
    if (hasJoinedWaitlist) setUnlocked(true);
  }, [hasJoinedWaitlist]);

  React.useEffect(() => {
    if (!analyzing) return;
    setPhaseIndex(0);
    const id = window.setInterval(() => {
      setPhaseIndex((prev) => Math.min(prev + 1, ANALYSIS_PHASES.length - 1));
    }, PHASE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [analyzing]);

  const runAudit = React.useCallback(async () => {
    const trimmedUrl = url.trim();
    const trimmedText = text.trim();
    if (mode === "url" && !trimmedUrl) {
      toast.error("Informe a URL do artigo.");
      return;
    }
    if (mode === "text" && trimmedText.length < 120) {
      toast.error("Cole um texto com pelo menos ~120 caracteres.");
      return;
    }

    setAnalyzing(true);
    setResult(null);
    try {
      const resp = await fetch("/api/seo-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: mode === "url" ? trimmedUrl : "",
          text: mode === "text" ? trimmedText : "",
        }),
      });
      const data = (await resp.json()) as AuditResult & { ok?: boolean; message?: string };
      if (!resp.ok || !data.ok) {
        toast.error(data.message || "Não conseguimos analisar o artigo agora.");
        return;
      }
      setPhaseIndex(ANALYSIS_PHASES.length - 1);
      setResult({
        title: data.title,
        source_url: data.source_url,
        overall_score: data.overall_score,
        dimensions: data.dimensions || {},
        issues: data.issues || [],
        summary: data.summary || "",
        intent_facets: data.intent_facets || [],
      });
      if (hasJoinedWaitlist) setUnlocked(true);
    } catch {
      toast.error("Não conseguimos analisar o artigo agora. Tente novamente.");
    } finally {
      setAnalyzing(false);
    }
  }, [hasJoinedWaitlist, mode, text, url]);

  const handleUnlock = () => {
    openWaitlist({
      onSuccess: () => setUnlocked(true),
    });
  };

  return (
    <div className="rounded-3xl border border-[#08080C]/8 bg-white p-5 sm:p-8 shadow-sm">
      <div className="inline-flex rounded-xl border border-[#37489d]/15 bg-[#F8F8F8] p-1 mb-5">
        <button
          type="button"
          onClick={() => setMode("url")}
          disabled={analyzing}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === "url" ? "bg-white text-[#37489d] shadow-sm" : "text-[#6B7280]"
          }`}
        >
          <Link2 className="w-3.5 h-3.5" />
          URL
        </button>
        <button
          type="button"
          onClick={() => setMode("text")}
          disabled={analyzing}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === "text" ? "bg-white text-[#37489d] shadow-sm" : "text-[#6B7280]"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Texto
        </button>
      </div>

      <div className="space-y-4">
        {mode === "url" ? (
          <div className="space-y-2">
            <Label htmlFor="seo-audit-url" className="text-[#37489d]">
              URL do artigo
            </Label>
            <Input
              id="seo-audit-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://seusite.com.br/blog/seu-artigo"
              className="border-[#37489d]/20"
              disabled={analyzing}
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="seo-audit-text" className="text-[#37489d]">
              Texto do artigo
            </Label>
            <Textarea
              id="seo-audit-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Cole aqui o conteúdo completo do artigo…"
              className="min-h-[160px] border-[#37489d]/20"
              disabled={analyzing}
            />
          </div>
        )}

        <Button
          type="button"
          onClick={() => void runAudit()}
          disabled={analyzing}
          className="w-full sm:w-auto rounded-xl bg-[#37489d] hover:bg-[#37489d]/90 text-white"
        >
          {analyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analisando…
            </>
          ) : (
            "Analisar Agora"
          )}
        </Button>
      </div>

      {analyzing && (
        <div className="mt-8 rounded-2xl border border-[#37489d]/15 bg-[#37489d]/[0.04] p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-5">
            <Loader2 className="w-4 h-4 text-[#37489d] animate-spin shrink-0" />
            <p className="text-sm font-semibold text-[#08080C]">
              Gerando auditoria AdzSEO Analytics…
            </p>
          </div>
          <ol className="space-y-3">
            {ANALYSIS_PHASES.map((phase, i) => {
              const done = i < phaseIndex;
              const active = i === phaseIndex;
              return (
                <li
                  key={phase.id}
                  className={`flex items-center gap-3 text-sm transition-opacity duration-300 ${
                    done || active ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      done
                        ? "bg-emerald-500 text-white"
                        : active
                          ? "bg-[#37489d] text-white"
                          : "bg-white border border-[#37489d]/20 text-[#9CA3AF]"
                    }`}
                  >
                    {done ? (
                      <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                    ) : active ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Circle className="w-2.5 h-2.5 fill-current" />
                    )}
                  </span>
                  <span
                    className={
                      active
                        ? "font-medium text-[#08080C]"
                        : done
                          ? "text-[#4B5563]"
                          : "text-[#6B7280]"
                    }
                  >
                    {phase.label}
                    {active ? "…" : ""}
                  </span>
                </li>
              );
            })}
          </ol>
          <div className="mt-5 h-1.5 rounded-full bg-white overflow-hidden">
            <div
              className="h-full rounded-full bg-[#37489d] transition-all duration-700 ease-out"
              style={{
                width: `${((phaseIndex + 1) / ANALYSIS_PHASES.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {result && !analyzing && (
        <div className="mt-8 space-y-5">
          {unlocked ? (
            <ReportBody result={result} />
          ) : (
            <div className="relative">
              <div
                className="pointer-events-none select-none space-y-5 blur-[6px] opacity-60"
                aria-hidden
              >
                <ReportBody result={result} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="w-full max-w-md rounded-2xl border border-[#37489d]/20 bg-white/95 backdrop-blur-sm shadow-lg p-6 text-center">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#37489d]/10">
                    <Lock className="w-5 h-5 text-[#37489d]" />
                  </div>
                  <p className="text-base font-semibold text-[#08080C] mb-2">
                    Relatório pronto
                  </p>
                  <p className="text-sm text-[#6B7280] leading-relaxed mb-5">
                    Entre na lista de espera para liberar o score completo, as dimensões e os
                    pontos de atenção da auditoria.
                  </p>
                  <Button
                    type="button"
                    onClick={handleUnlock}
                    className="w-full rounded-xl bg-[#37489d] hover:bg-[#37489d]/90 text-white"
                  >
                    Entrar na lista de espera
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
