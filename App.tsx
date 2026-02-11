
import React, { useState, useCallback } from 'react';
import { DeviceData, SearchHistoryItem } from './types';
import { fetchDeviceIntelligence } from './services/geminiService';
import { DeviceDashboard } from './components/DeviceDashboard';

const App: React.FC = () => {
  const [model, setModel] = useState('');
  const [os, setOs] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [currentDevice, setCurrentDevice] = useState<DeviceData | null>(null);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleKeySelection = async () => {
    try {
      const aiStudio = (window as any).aistudio;
      if (aiStudio?.openSelectKey) {
        await aiStudio.openSelectKey();
        setError(null);
      }
    } catch (e) {
      console.error("Key selection failed:", e);
    }
  };

  const generateMarkdownReport = (data: DeviceData): string => {
    const { insights, manufacturer, model, os, timestamp, specs } = data;
    let md = `# REPAIR AUDIT: ${manufacturer} ${model}\n`;
    md += `**OS TARGET:** ${os}\n`;
    md += `**TIMESTAMP:** ${timestamp}\n\n`;
    
    md += `## HARDWARE SPECIFICATIONS\n`;
    md += `- Processor: ${specs?.processor || 'N/A'}\n`;
    md += `- RAM: ${specs?.ram || 'N/A'}\n`;
    md += `- Storage: ${specs?.storage || 'N/A'}\n`;
    md += `- Display: ${specs?.display || 'N/A'}\n`;
    md += `- Battery: ${specs?.battery || 'N/A'}\n\n`;

    if (insights.windowsServices) {
      md += `## CRITICAL OS SERVICES\n`;
      insights.windowsServices.forEach(s => {
        md += `### ${s.displayName} (${s.name})\n`;
        md += `- **Impact:** ${s.impact}\n`;
        md += `- **Description:** ${s.description}\n`;
        md += `- **Troubleshooting:** ${s.troubleshootingTip}\n\n`;
      });
    }

    if (insights.automationScripts) {
      md += `## AUTOMATION SCRIPTS\n`;
      md += `### WINDOWS ADMIN CMD\n\`\`\`batch\n${insights.automationScripts.cmd}\n\`\`\`\n\n`;
      md += `### WSL LINUX\n\`\`\`bash\n${insights.automationScripts.wsl}\n\`\`\`\n\n`;
      md += `### TERMUX MOBILE\n\`\`\`bash\n${insights.automationScripts.termux}\n\`\`\`\n\n`;
    }

    return md;
  };

  const exportData = useCallback((data: DeviceData) => {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const baseName = `${data.manufacturer}_${data.model.replace(/\s+/g, '_')}_${timestamp}`;
      
      const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const jsonLink = document.createElement('a');
      jsonLink.href = URL.createObjectURL(jsonBlob);
      jsonLink.download = `AUDIT_${baseName}.json`;
      jsonLink.click();

      const mdContent = generateMarkdownReport(data);
      const mdBlob = new Blob([mdContent], { type: 'text/markdown' });
      const mdLink = document.createElement('a');
      mdLink.href = URL.createObjectURL(mdBlob);
      mdLink.download = `REPORT_${baseName}.md`;
      mdLink.click();
    } catch (err) {
      console.error("Export failed:", err);
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!model || !os) return;
    setIsLoading(true);
    setError(null);
    setStatusMessage("Connecting to intelligence grid...");
    
    // Status update timer to reassure the user
    const statusTimer = setInterval(() => {
      setStatusMessage(prev => {
        if (prev.includes("grid")) return "Parsing manufacturing schematics...";
        if (prev.includes("schematics")) return "Synthesizing automation scripts...";
        if (prev.includes("scripts")) return "Finalizing forensic report...";
        return "Still working, please hold...";
      });
    }, 4000);

    try {
      const data = await fetchDeviceIntelligence(model, os);
      setCurrentDevice(data);
      setHistory(prev => [{ id: crypto.randomUUID(), model: data.model, manufacturer: data.manufacturer, timestamp: data.timestamp, data }, ...prev].slice(0, 50));
      exportData(data);
    } catch (err: any) {
      let msg = err.message || 'Audit failed.';
      if (msg.includes('403') || msg.includes('permission') || msg.includes('not found')) {
        msg = "Authorization Error: Access denied. Please ensure your API key is correctly configured.";
      } else if (msg.includes('JSON')) {
        msg = "Parsing Error: The engine returned data in an unexpected format. Retrying may fix this.";
      }
      setError(msg);
    } finally {
      clearInterval(statusTimer);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      <nav className="bg-slate-900 text-white sticky top-0 z-50 px-10 py-6 border-b border-slate-800 shadow-2xl">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-3xl shadow-2xl shadow-indigo-500/30">RI</div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter leading-none">RepairIntel Hub</h1>
              <p className="text-[10px] text-indigo-400 uppercase font-black tracking-[0.4em] mt-2">Engineering Console v4.3</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
             <button 
               onClick={handleKeySelection}
               className="hidden sm:block px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-300 transition-all"
             >
               Configure Key
             </button>
             <div className="hidden sm:flex items-center space-x-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Ready</span>
             </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-[1800px] mx-auto w-full p-8 md:p-12">
        <div className="mb-12">
          <div className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center">
              Initialize Forensic Audit
              <span className="text-[10px] ml-4 px-3 py-1.5 rounded-full font-black uppercase tracking-widest bg-emerald-50 text-emerald-600">
                Resilient Engine Active
              </span>
            </h2>
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Device Model</label>
                <input type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g. Dell Precision 7550" className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-black focus:ring-4 focus:ring-indigo-500/10 transition-all" required />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Target OS</label>
                <input type="text" value={os} onChange={(e) => setOs(e.target.value)} placeholder="e.g. Windows 11 Enterprise" className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-black focus:ring-4 focus:ring-indigo-500/10 transition-all" required />
              </div>
              <button 
                type="submit" 
                disabled={isLoading} 
                className="font-black py-6 rounded-3xl shadow-2xl transition-all disabled:opacity-50 text-[13px] uppercase tracking-[0.2em] text-white bg-slate-900 hover:bg-black"
              >
                {isLoading ? 'HARVESTING INTEL...' : 'Run Forensic Audit'}
              </button>
            </form>
          </div>
        </div>

        <div className="w-full">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-8 rounded-[32px] mb-12 flex items-start animate-in fade-in slide-in-from-top-4 duration-300 shadow-lg">
              <span className="text-3xl mr-6">⚠️</span>
              <div className="flex-grow">
                <p className="font-black text-[15px] uppercase tracking-wider">Engine Fault Detected</p>
                <p className="text-xs mt-2 font-medium leading-relaxed">{error}</p>
                <div className="mt-8 flex space-x-4">
                   <button onClick={handleSearch} className="px-6 py-3 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg hover:bg-rose-700 transition-colors">Retry Audit</button>
                   <button onClick={handleKeySelection} className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase shadow-lg hover:bg-black transition-colors">Configure Key</button>
                </div>
              </div>
            </div>
          )}
          
          {isLoading ? (
            <div className="h-[600px] flex flex-col items-center justify-center space-y-12 animate-in fade-in duration-500">
              <div className="relative">
                <div className="w-32 h-32 border-[12px] border-indigo-100 rounded-full"></div>
                <div className="absolute top-0 w-32 h-32 border-[12px] border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl">📡</div>
              </div>
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{statusMessage}</h2>
                <p className="text-slate-400 font-bold text-sm">Forensic harvesting takes 15-30 seconds. Do not refresh.</p>
              </div>
            </div>
          ) : currentDevice ? (
            <DeviceDashboard 
              data={currentDevice} 
              history={history}
              onExport={exportData}
              onSelectAudit={setCurrentDevice}
            />
          ) : (
            <div className="h-[600px] flex flex-col items-center justify-center text-center space-y-12 bg-white border-2 border-dashed border-slate-200 rounded-[64px] p-10 shadow-inner">
               <div className="w-48 h-48 bg-slate-50 rounded-[48px] flex items-center justify-center text-7xl">🛠️</div>
               <h2 className="text-4xl font-black text-slate-900 tracking-tight">Audit Engine Standby.</h2>
               <p className="text-slate-400 font-bold text-sm max-w-md">Ready to generate a complete engineering profile. Enter device details above to begin forensic investigation.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
