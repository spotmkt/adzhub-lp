import { motion } from "framer-motion";
import { Zap, X } from "lucide-react";

export interface FormDialogueData {
  icon: "lightning" | "create" | "update";
  title: string;
  action: string;
  fields: { label: string; value: string }[];
}

interface FormDialogueProps {
  data: FormDialogueData;
  highlightedButton?: boolean;
}

export const FormDialogue = ({ data, highlightedButton }: FormDialogueProps) => {
  return (
    <motion.div
      className="bg-[hsl(40,25%,95%)] rounded-xl p-4 border border-border/30 max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
          <Zap className="w-4 h-4 text-amber-600" />
        </div>
        <span className="font-medium text-sm text-foreground">{data.title}</span>
      </div>

      <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded mb-3 inline-block">
        {data.action}
      </span>

      <div className="space-y-1.5 mb-4">
        {data.fields.map((field, i) => (
          <div key={i} className="flex gap-2 text-xs">
            <span className="text-primary font-medium">{field.label}:</span>
            <span className="text-foreground">{field.value}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <motion.button
          type="button"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            highlightedButton
              ? "bg-primary text-primary-foreground ring-2 ring-primary/40 scale-105"
              : "bg-primary text-primary-foreground"
          }`}
          animate={{ scale: highlightedButton ? 1.05 : 1 }}
        >
          <Zap className="w-3 h-3" />
          Confirmar alteração
        </motion.button>
        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-border bg-white text-foreground"
        >
          <X className="w-3 h-3" />
          Cancelar
        </button>
      </div>
    </motion.div>
  );
};
