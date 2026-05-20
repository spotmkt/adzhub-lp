import { motion } from "framer-motion";
import { Bell, FileBarChart, AlertCircle } from "lucide-react";
import type { MockPendingItem } from "./MockInterface";

const pendingKindIcon = {
  report: FileBarChart,
  reminder: Bell,
  alert: AlertCircle,
} as const;

interface MockPendingPanelProps {
  pendingPanelOpen: boolean;
  pendingItems?: MockPendingItem[];
  approvedPendingIds: string[];
  highlightedElement: string | null;
}

export function MockPendingPanel({
  pendingPanelOpen,
  pendingItems,
  approvedPendingIds,
  highlightedElement,
}: MockPendingPanelProps) {
  const hasPending = Boolean(pendingItems?.length);
  const visiblePendingItems =
    pendingItems?.filter((item) => !approvedPendingIds.includes(item.id)) ?? [];
  const pendingCount = visiblePendingItems.length;

  return (
    <motion.div
      data-cursor-target="pending-panel"
      className="hidden sm:flex flex-col rounded-2xl m-2 shrink-0 min-h-0 bg-[hsl(40,30%,96%)] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, width: pendingPanelOpen ? 176 : 40 }}
      transition={{ delay: 0.2, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ width: pendingPanelOpen ? 176 : 40 }}
    >
      {!pendingPanelOpen ? (
        <div className="flex flex-col items-center py-4 gap-2 h-full">
          <Bell className="w-4 h-4 text-muted-foreground" />
          {pendingCount > 0 && (
            <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#37489d] text-white text-[10px] font-semibold flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </div>
      ) : hasPending ? (
        <motion.div className="flex flex-col min-h-0 flex-1 p-2 gap-1.5 overflow-y-auto">
          <p className="text-[10px] font-semibold text-foreground/80 px-1 pb-0.5">Pendentes</p>
          {visiblePendingItems.map((item) => {
            const Icon = pendingKindIcon[item.kind];
            const highlightId =
              item.id === "report"
                ? "pending-report"
                : item.id === "budget"
                  ? "pending-budget"
                  : `pending-${item.id}`;
            const approveHighlight = `pending-approve-${item.id}`;
            return (
              <motion.div
                key={item.id}
                data-cursor-target={`pending-item-${item.id}`}
                className={`rounded-xl bg-white border p-2 shadow-sm transition-all ${
                  highlightedElement === highlightId
                    ? "border-primary ring-2 ring-primary/15"
                    : "border-border/40"
                }`}
                animate={{ scale: highlightedElement === highlightId ? 1.02 : 1 }}
              >
                <motion.div className="flex gap-2">
                  <motion.div className="w-7 h-7 rounded-lg bg-muted/40 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-foreground/70" />
                  </motion.div>
                  <motion.div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold text-foreground leading-tight">{item.title}</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">{item.subtitle}</p>
                  </motion.div>
                </motion.div>
                <motion.button
                  type="button"
                  data-cursor-target={`pending-approve-${item.id}`}
                  className={`mt-2 w-full text-[9px] font-semibold py-1 rounded-md transition-colors ${
                    highlightedElement === approveHighlight
                      ? "bg-primary text-primary-foreground"
                      : "bg-[#37489d]/10 text-[#37489d] hover:bg-[#37489d]/15"
                  }`}
                  animate={{ scale: highlightedElement === approveHighlight ? 1.03 : 1 }}
                >
                  Aprovar
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <motion.div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-3">
          <motion.div className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center mb-1.5">
            <span className="text-sm">!</span>
          </motion.div>
          <span className="text-[9px] text-center leading-relaxed">Nenhum item em pendentes.</span>
        </motion.div>
      )}
    </motion.div>
  );
}
