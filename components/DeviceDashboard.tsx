
import React, { useState } from 'react';
import { DeviceData, SearchHistoryItem, SystemEntryProtocol, HazardAdvisory } from '../types';
import { ResourceCard } from './ResourceCard';
import { AuditVault } from './AuditVault';

interface Props {
  data: DeviceData;
  history: SearchHistoryItem[];
  onExport: (data: DeviceData) => void;
  onSelectAudit: (data: DeviceData) => void;
}

export const DeviceDashboard: React.FC<Props> = ({ data, history, onExport, onSelectAudit }) => {
  const [activeScriptTab, setActiveScriptTab] = useState<'cmd' | 'wsl' | 'termux'>('cmd');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const criticalHazards = data.insights.hazardsAndRecalls.filter(h => h.severity === 'CRITICAL');
  const otherHazards = data.insights.hazardsAndRecalls.filter(h => h.severity !== 'CRITICAL');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-16 pb-64">
      
      {/* 1. CRITICAL HAZARD VAULT (URGENT SAFETY) */}
      {criticalHazards.length > 0 && (
        <section className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-rose-600 to-orange-600 rounded-[52px] blur opacity-75 animate-pulse"></div>
          <div className="relative bg-rose-700 border-[6px] border-rose-500 rounded-[48px] p-8 md:p-14 text-white shadow-2xl">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 mb-12">
              <div className="flex items-center space-x-8">
                <span className="text-8xl filter drop-shadow-lg">🔥</span>
                <div>
                  <h2 className="text-5xl font-black uppercase tracking-tighter leading-tight">Safety Critical: Fire Hazard</h2>
                  <p className="text-rose-100 font-black uppercase tracking-widest text-xs mt-2 flex items-center">
                    <span className="w-3 h-3 bg-white rounded-full mr-3 animate-ping"></span>
                    Immediate Forensic Action Required for {data.model}
                  </p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl px-8 py-4 rounded-3xl border border-white/20">
                <p className="text-[10px] font-black uppercase tracking-widest text-rose-200">Advisory Status</p>
                <p className="text-2xl font-black">CRITICAL RECALL</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {criticalHazards.map((h, i) => (
                <div key={i} className="bg-black/30 backdrop-blur-md p-10 rounded-[40px] border border-white/10 hover:bg-black/40 transition-all">
                  <h3 className="text-2xl font-black mb-4 flex items-center">
                    {h.title}
                  </h3>
                  <div className="space-y-6">
                    <p className="text-base font-medium text-rose-50 leading-relaxed">{h.description}</p>
                    <div className="bg-white p-6 rounded-[32px] text-rose-900 shadow-xl">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-600 mb-2">Mandatory Action Protocol</p>
                      <p className="text-lg font-black leading-tight">{h.actionRequired}</p>
                      {h.sourceUrl && (
                        <a href={h.sourceUrl} target="_blank" className="inline-block mt-4 text-[10px] font-bold underline hover:text-rose-500">Official Recall Documentation →</a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 2. HERO HEADER */}
      <div className="bg-white border border-slate-200 rounded-[48px] p-10 shadow-sm flex flex-col xl:flex-row justify-between items-start gap-10 relative overflow-hidden">
        <div className="space-y-6 flex-grow relative z-10">
          <div className="flex items-center space-x-4">
             <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">ENGINEERING HUB</span>
             <span className="text-slate-300">/</span>
             <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{data.manufacturer} FORENSICS</span>
          </div>
          <h1 className="text-7xl font-black text-slate-900 tracking-tighter leading-none">{data.model}</h1>
          <div className="flex items-center space-x-6">
            <p className="text-slate-500 font-medium text-lg italic border-l-4 border-indigo-500 pl-6">Optimized for <span className="text-indigo-600 font-black">{data.os}</span>.</p>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold border border-emerald-100 uppercase tracking-widest">Grounding Verified</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 shrink-0">
          <button 
            onClick={() => onExport(data)} 
            className="bg-slate-900 hover:bg-black text-white px-10 py-5 rounded-[24px] text-xs font-black uppercase shadow-xl transition-all active:scale-95"
          >
            Download Engineering Report
          </button>
        </div>
      </div>

      {/* 3. SYSTEM ENTRY CONSOLE (SHORTCUTS & SEQUENCES) */}
      <section className="space-y-10">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black text-slate-900 flex items-center">
             <span className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mr-5 text-2xl shadow-lg">⌨️</span>
             System Entry Protocols
          </h2>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hardware-Level Shortcuts</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.insights.systemEntryProtocols.map((protocol, i) => (
            <div key={i} className="bg-slate-900 p-10 rounded-[48px] border border-slate-800 group hover:border-indigo-500 transition-all relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors"></div>
              <div className="flex justify-between items-center mb-8 relative z-10">
                <span className="text-indigo-400 text-[11px] font-black uppercase tracking-[0.2em]">{protocol.mode}</span>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${protocol.reliability === 'High' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {protocol.reliability}
                </span>
              </div>
              <div className="mb-8 relative z-10">
                <code className="text-4xl font-black text-white group-hover:text-indigo-300 transition-colors block leading-none tracking-tighter">
                  {protocol.sequence}
                </code>
              </div>
              <p className="text-sm text-slate-400 font-medium leading-relaxed relative z-10">{protocol.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. RECALLS & ADVISORIES (NON-CRITICAL) */}
      {otherHazards.length > 0 && (
        <section className="space-y-10">
          <h2 className="text-3xl font-black text-slate-900 flex items-center">
             <span className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mr-5 text-2xl shadow-lg">🛡️</span>
             General Safety & Recall Registry
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {otherHazards.map((h, i) => (
              <div key={i} className="bg-white border-2 border-slate-100 p-10 rounded-[48px] flex items-start space-x-8 hover:border-amber-400 transition-colors">
                <span className="text-5xl filter grayscale group-hover:grayscale-0 transition-all">⚠️</span>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight">{h.title}</h4>
                    <span className="text-[10px] font-black bg-amber-50 text-amber-600 px-3 py-1 rounded-full border border-amber-100">{h.severity}</span>
                  </div>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{h.description}</p>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Recommended Action</p>
                    <p className="text-sm font-bold text-slate-800">{h.actionRequired}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. PARTS & SPECS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="bg-white border border-slate-200 rounded-[56px] p-12 shadow-sm">
          <h3 className="text-3xl font-black mb-10 text-slate-900 flex items-center justify-between">
            Hardware Profile
            <span className="text-2xl opacity-20">📊</span>
          </h3>
          <div className="grid grid-cols-2 gap-8">
            {Object.entries(data.specs).map(([key, val]) => (
              <div key={key} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 group hover:border-indigo-400 transition-colors">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{key}</p>
                <p className="text-sm font-black text-slate-800 leading-tight">{val || 'Not Detected'}</p>
              </div>
            ))}
          </div>
        </section>

        {data.insights.partNumbers && (
          <section className="bg-slate-950 text-white rounded-[56px] p-12 overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 p-12 opacity-5 text-9xl font-black tracking-tighter select-none">INTEL</div>
            <h3 className="text-3xl font-black mb-10 relative z-10">Parts Inventory</h3>
            <div className="space-y-6 relative z-10">
              {data.insights.partNumbers.map((p, i) => (
                <div key={i} className="flex justify-between items-start border-b border-white/5 pb-6 last:border-0">
                  <div className="space-y-1">
                    <p className="text-sm font-black text-indigo-400">{p.component}</p>
                    <p className="text-2xl font-black text-white tracking-tight">{p.fru}</p>
                  </div>
                  <p className="text-[11px] text-slate-500 max-w-[200px] text-right font-medium leading-relaxed italic">{p.notes}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* 6. AUTOMATION SUITE */}
      <section className="bg-slate-900 rounded-[64px] p-16 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full"></div>
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-16 relative z-10">
          <div>
            <h2 className="text-6xl font-black tracking-tighter mb-4">Forensic Automation</h2>
            <p className="text-slate-400 font-medium mb-8 max-w-xl">Pre-verified scripts for internal hardware diagnostics and system optimization on {data.os}.</p>
            <div className="flex gap-4">
              {(['cmd', 'wsl', 'termux'] as const).map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setActiveScriptTab(tab)} 
                  className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${activeScriptTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40' : 'bg-white/5 text-slate-500 hover:text-white'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <button 
            onClick={() => copyToClipboard(data.insights.automationScripts[activeScriptTab])} 
            className="bg-white text-slate-900 px-10 py-5 rounded-[32px] text-xs font-black uppercase shadow-2xl transition-all active:scale-95 group"
          >
            Copy Terminal Sequence
          </button>
        </div>
        <div className="relative group">
          <pre className="bg-black/60 p-12 rounded-[48px] border border-white/10 overflow-x-auto text-indigo-300 font-mono text-base leading-relaxed custom-scrollbar">
            <code>{data.insights.automationScripts[activeScriptTab]}</code>
          </pre>
          <div className="absolute top-6 right-10 flex space-x-2">
             <span className="w-3 h-3 rounded-full bg-rose-500/40"></span>
             <span className="w-3 h-3 rounded-full bg-amber-500/40"></span>
             <span className="w-3 h-3 rounded-full bg-emerald-500/40"></span>
          </div>
        </div>
      </section>

      {/* 7. SOURCES & HISTORY */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900">Intelligence Grounding</h2>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grounded via Google Search</span>
        </div>
        <div className="flex flex-wrap gap-4">
          {data.groundingSources?.map((s, i) => (
            <a 
              key={i} 
              href={s.url} 
              target="_blank" 
              className="px-6 py-3 bg-white border-2 border-slate-100 rounded-full text-xs font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 transition-all flex items-center shadow-sm"
            >
              <span className="mr-3 opacity-40">🔗</span>
              {s.title}
            </a>
          ))}
        </div>
      </section>

      <AuditVault history={history} onSelect={onSelectAudit} onExport={onExport} />
    </div>
  );
};
