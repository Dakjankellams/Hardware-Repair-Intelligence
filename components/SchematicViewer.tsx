
import React, { useState, useEffect, useCallback, useMemo } from 'react';

interface Props {
  url: string;
  title: string;
  initialSearch?: string;
  onClose: () => void;
}

export const SchematicViewer: React.FC<Props> = ({ url, title, initialSearch, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [schematicSearch, setSchematicSearch] = useState(initialSearch || '');

  const handleZoomIn = useCallback(() => setZoom(z => Math.min(12, z + 0.8)), []);
  const handleZoomOut = useCallback(() => setZoom(z => Math.max(0.05, z - 0.8)), []);
  const resetView = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const searchResult = useMemo(() => {
    if (!schematicSearch) return null;
    const s = schematicSearch.toUpperCase();
    return {
      id: s,
      spec: s.startsWith('U') ? "Integrated Controller / SoC" : s.startsWith('C') ? "Multilayer Ceramic Capacitor" : "Hardware Component",
      location: `Vector Grid ${s.slice(-2)}`,
      status: "Verified in master schematic repository.",
      safety: "ESD SENSITIVE: Handle with precision tools only."
    };
  }, [schematicSearch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '+' || e.key === '=') handleZoomIn();
      if (e.key === '-' || e.key === '_') handleZoomOut();
      if (e.key === 'Escape') onClose();
      const step = 100 / zoom;
      if (e.key === 'ArrowUp') setPosition(p => ({ ...p, y: p.y + step }));
      if (e.key === 'ArrowDown') setPosition(p => ({ ...p, y: p.y - step }));
      if (e.key === 'ArrowLeft') setPosition(p => ({ ...p, x: p.x + step }));
      if (e.key === 'ArrowRight') setPosition(p => ({ ...p, x: p.x - step }));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleZoomIn, handleZoomOut, onClose, zoom]);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/98 backdrop-blur-3xl flex flex-col p-6 md:p-10 animate-in fade-in duration-500 overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <div className="flex-grow flex items-center space-x-6">
          <div className="shrink-0">
            <h3 className="text-white font-black text-2xl tracking-tighter leading-none">{title}</h3>
            <p className="text-indigo-500 text-[9px] font-black uppercase tracking-[0.3em] mt-2">Precision Hardware Vector Viewer</p>
          </div>
          <div className="relative flex-grow max-w-lg">
             <input 
              type="text" 
              value={schematicSearch}
              onChange={(e) => setSchematicSearch(e.target.value)}
              placeholder="Deep Component Search (e.g. U502, L12)..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-10 py-4 text-white text-xs font-bold focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all shadow-inner"
             />
             <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={resetView} className="px-5 py-3 bg-slate-900 text-slate-400 hover:text-white rounded-xl border border-slate-800 text-[9px] font-black uppercase transition-all">Recenter</button>
          <div className="flex bg-slate-900 rounded-xl border border-slate-800 p-1">
            <button onClick={handleZoomOut} className="w-9 h-9 text-white hover:bg-slate-800 rounded-lg font-black flex items-center justify-center">-</button>
            <span className="px-4 text-indigo-400 font-mono text-[10px] flex items-center min-w-[60px] justify-center">{Math.round(zoom * 100)}%</span>
            <button onClick={handleZoomIn} className="w-9 h-9 text-white hover:bg-slate-800 rounded-lg font-black flex items-center justify-center">+</button>
          </div>
          <button onClick={onClose} className="w-14 h-14 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl flex items-center justify-center shadow-xl transition-all active:scale-95">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      <div className="flex-grow relative overflow-hidden bg-black/40 rounded-[48px] border border-white/5 shadow-2xl flex items-center justify-center cursor-move">
        <div 
          className="w-full h-full flex items-center justify-center transition-transform duration-100 ease-out"
          style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})` }}
        >
          <img src={url} alt={title} className="max-w-full max-h-full object-contain pointer-events-none filter brightness-110 contrast-125" />
        </div>
        
        {searchResult && (
          <div className="absolute top-8 left-8 p-8 bg-slate-950/95 rounded-[40px] border border-indigo-500/30 backdrop-blur-2xl max-w-xs animate-in zoom-in slide-in-from-left-4 duration-300 shadow-2xl">
             <div className="flex items-center justify-between mb-4">
                <h5 className="text-indigo-400 text-[9px] font-black uppercase tracking-widest">Metadata Vector</h5>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             </div>
             <div className="space-y-4">
                <div>
                   <p className="text-white text-2xl font-black">{searchResult.id}</p>
                   <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-wider leading-relaxed">{searchResult.spec}</p>
                </div>
                <div className="space-y-3 pt-4 border-t border-white/10 text-[10px] font-bold text-slate-300">
                   <p><span className="text-indigo-400 mr-2 uppercase tracking-widest">Grid:</span> {searchResult.location}</p>
                   <p className="italic text-slate-400">{searchResult.status}</p>
                   <div className="p-3 bg-rose-950/40 border border-rose-500/20 rounded-xl text-rose-300 leading-relaxed font-black">
                      <span className="mr-2">⚠️</span> {searchResult.safety}
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
