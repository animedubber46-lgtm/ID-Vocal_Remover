import { Activity, Server, Cpu, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface StatusCardProps {
  label: string;
  value: string;
  subtext?: string;
  icon: "activity" | "server" | "cpu" | "clock";
  status?: "healthy" | "warning" | "error" | "neutral";
}

const icons = {
  activity: Activity,
  server: Server,
  cpu: Cpu,
  clock: Clock,
};

export function StatusCard({ label, value, subtext, icon, status = "neutral" }: StatusCardProps) {
  const Icon = icons[icon];
  
  const statusColors = {
    healthy: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    warning: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    error: "text-rose-400 bg-rose-400/10 border-rose-400/20",
    neutral: "text-primary bg-primary/10 border-primary/20",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`
        relative overflow-hidden rounded-xl p-6 border bg-card/40 backdrop-blur-md
        group hover:bg-card/60 transition-colors duration-300
        ${status === 'neutral' ? 'border-border' : statusColors[status].split(' ')[2]}
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-foreground group-hover:glow-text transition-all duration-300">
            {value}
          </h3>
          {subtext && (
            <p className="mt-1 text-xs text-muted-foreground/80">{subtext}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${statusColors[status]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      {/* Decorative gradient blob */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
    </motion.div>
  );
}
