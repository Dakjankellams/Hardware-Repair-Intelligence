
import React, { useState } from 'react';
import { SearchHistoryItem, DeviceData } from '../types';

interface Props {
  history: SearchHistoryItem[];
  onSelect: (data: DeviceData) => void;
  onExport: (data: DeviceData) => void;
}

export const AuditVault: React.FC<Props> = ({ history, onSelect, onExport }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter(h => 
    h.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.timestamp.includes(searchTerm)
  );

  const getLogFilename = (h: SearchHistoryItem) => {
    const date = new Date(h.timestamp).toISOString().split('T')[0];
    const time = new Date(h.timestamp).toLocaleTimeString().replace(/:/g, '-');
    return `${h.manufacturer}_${h.model.replace(/\s+/g, '_')}_${date}_${time}.audit`;
  };

  return (
    <section className="bg-white border border-slate-200 rounded-[64px] p-12 shadow-sm space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <h2 className="text-4xl font-black text-slate-900 flex items-center">
            <span className="w-16 h-16 rounded-[24px] bg-slate-900 text-white flex items-center justify-center mr-6 text-3xl shadow-xl">📁</span>
            Session Audit Vault
          </h2>
          <p className="text-slate-500 font-medium mt-3 ml-22">Searchable time-stamped log repository for all device investigations.</p>
        </div>
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search filenames or devices..."
            className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHistory.length > 0 ? filteredHistory.map((h) => (
          <div key={h.id} className="bg-slate-50 border border-slate-100 p-8 rounded-[40px] hover:border-indigo-400 hover:bg-white transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={() => onExport(h.data)} className="bg-white p-2 rounded-lg shadow-sm border border-slate-100 hover:text-indigo-600">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
               </button>
            </div>
            <div className="flex items-center space-x-6 mb-6">
               <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm border border-slate-100">📄</div>
               <div className="truncate">
                 <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Time-Stamped Log</p>
                 <p className="text-sm font-black text-slate-900 truncate">{getLogFilename(h)}</p>
               </div>
            </div>
            <div className="space-y-4">
               <div className="flex justify-between text-[11px] font-bold">
                 <span className="text-slate-400 uppercase">Hardware:</span>
                 <span className="text-slate-700">{h.model}</span>
               </div>
               <div className="flex justify-between text-[11px] font-bold">
                 <span className="text-slate-400 uppercase">Manufacturer:</span>
                 <span className="text-slate-700">{h.manufacturer}</span>
               </div>
            </div>
            <button 
              onClick={() => onSelect(h.data)}
              className="mt-8 w-full bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
            >
              Reload Audit Data
            </button>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center text-slate-400 font-black uppercase tracking-widest opacity-20">
            Vault is currently empty. Initialize audit to index logs.
          </div>
        )}
      </div>
    </section>
  );
};
