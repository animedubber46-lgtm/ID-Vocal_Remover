import { useLogs } from "@/hooks/use-logs";
import { LogViewer } from "@/components/LogViewer";
import { StatusCard } from "@/components/StatusCard";
import { AudioWaveform } from "lucide-react";

export default function Dashboard() {
  const { data: logs = [], isLoading } = useLogs();

  // Mock stats - in a real app, these would come from an API
  const activeJobs = logs.filter(l => l.message.includes("Processing")).length > 0 ? 1 : 0;
  const processedToday = logs.filter(l => l.message.includes("Complete")).length;
  const errorCount = logs.filter(l => l.level === "error").length;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0f1c] to-black text-foreground p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-primary to-blue-600 rounded-xl shadow-lg shadow-primary/20">
              <AudioWaveform className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Audio Bot Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Background voice extraction & processing monitor
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              System Online
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatusCard 
            label="Bot Status" 
            value={activeJobs > 0 ? "Processing" : "Idle"} 
            icon="activity"
            status={activeJobs > 0 ? "healthy" : "neutral"}
            subtext="Real-time operational state"
          />
          <StatusCard 
            label="Processed Today" 
            value={String(processedToday)} 
            icon="server"
            status="neutral"
            subtext="Audio files separated"
          />
          <StatusCard 
            label="System Load" 
            value={`${(activeJobs * 45) + 12}%`} 
            icon="cpu"
            status={activeJobs > 0 ? "warning" : "healthy"}
            subtext="CPU Usage (estimated)"
          />
          <StatusCard 
            label="Error Rate" 
            value={String(errorCount)} 
            icon="activity"
            status={errorCount > 0 ? "error" : "healthy"}
            subtext="Last 24 hours"
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-3">
             <LogViewer logs={logs} isLoading={isLoading} />
          </div>
        </div>

      </div>
    </div>
  );
}
