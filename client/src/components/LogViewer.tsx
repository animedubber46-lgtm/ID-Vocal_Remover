import { useRef, useEffect, useState } from "react";
import { format } from "date-fns";
import { Terminal, Search, Filter, Trash2, ArrowDownCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Log } from "@shared/schema";

interface LogViewerProps {
  logs: Log[];
  isLoading: boolean;
}

export function LogViewer({ logs, isLoading }: LogViewerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);

  // Filter logs based on search
  const filteredLogs = logs.filter(log => 
    log.message.toLowerCase().includes(filter.toLowerCase()) || 
    log.level.toLowerCase().includes(filter.toLowerCase())
  );

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  // Detect manual scroll to disable auto-scroll
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    setAutoScroll(isAtBottom);
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      case 'warn': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'info': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    }
  };

  return (
    <div className="w-full flex flex-col h-[600px] glass-panel rounded-xl overflow-hidden mt-8">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Terminal className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold tracking-tight">System Logs</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground border border-white/5">
            Live
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search logs..." 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-sm bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all w-64 placeholder:text-muted-foreground/50"
            />
          </div>
          <button 
            onClick={() => setAutoScroll(!autoScroll)}
            className={`p-2 rounded-lg transition-colors ${autoScroll ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-white/5'}`}
            title="Auto-scroll"
          >
            <ArrowDownCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Log Content */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-sm bg-black/40 scroll-smooth"
      >
        {isLoading && logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground/50 space-y-4">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p>Connecting to log stream...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground/50">
            <p>No logs found matching filter</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {filteredLogs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="group flex items-start gap-4 p-2 rounded hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
              >
                <span className="text-muted-foreground/50 min-w-[150px] select-none">
                  {log.createdAt ? format(new Date(log.createdAt), 'MMM dd HH:mm:ss.SSS') : '---'}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getLevelColor(log.level)}`}>
                  {log.level}
                </span>
                <span className="text-foreground/90 break-all leading-relaxed">
                  {log.message}
                </span>
                {log.details && (
                  <pre className="text-xs text-muted-foreground overflow-x-auto max-w-[200px] opacity-0 group-hover:opacity-100 transition-opacity">
                    {JSON.stringify(log.details)}
                  </pre>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer Status */}
      <div className="px-6 py-2 border-t border-white/5 bg-black/20 text-xs text-muted-foreground flex justify-between items-center">
        <span>{filteredLogs.length} entries</span>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
          {isLoading ? 'Connected' : 'Disconnected'}
        </div>
      </div>
    </div>
  );
}
