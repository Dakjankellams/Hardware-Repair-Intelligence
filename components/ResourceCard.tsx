
import React from 'react';
import { DeviceResource } from '../types';

const typeIcons: Record<DeviceResource['type'], string> = {
  driver: '💾',
  manual: '📚',
  schematic: '📐',
  bios: '⚡',
  firmware: '💿',
  forum: '💬',
  blog: '✍️',
  diagnostic: '🩺',
  image: '🖼️',
  guide: '🛠️',
  community: '👥',
  ifixit: '🔧',
  wiki: '🌐',
  archive: '🏛️',
  reddit: '🤖',
  github: '💻',
  stackexchange: '🥞',
  other: '🔗'
};

const typeColors: Record<DeviceResource['type'], string> = {
  driver: 'bg-blue-100 text-blue-700 border-blue-200',
  manual: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  schematic: 'bg-purple-100 text-purple-700 border-purple-200',
  bios: 'bg-orange-100 text-orange-700 border-orange-200',
  firmware: 'bg-violet-100 text-violet-700 border-violet-200',
  forum: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  blog: 'bg-slate-100 text-slate-700 border-slate-200',
  diagnostic: 'bg-rose-100 text-rose-700 border-rose-200',
  image: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  guide: 'bg-lime-100 text-lime-700 border-lime-200',
  community: 'bg-teal-100 text-teal-700 border-teal-200',
  ifixit: 'bg-amber-100 text-amber-700 border-amber-200',
  wiki: 'bg-sky-100 text-sky-700 border-sky-200',
  archive: 'bg-stone-100 text-stone-700 border-stone-200',
  reddit: 'bg-orange-100 text-orange-600 border-orange-200',
  github: 'bg-slate-800 text-white border-slate-700',
  stackexchange: 'bg-blue-50 text-blue-800 border-blue-200',
  other: 'bg-gray-100 text-gray-700 border-gray-200'
};

export const ResourceCard: React.FC<{ resource: DeviceResource }> = ({ resource }) => {
  return (
    <a 
      href={resource.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group flex flex-col p-6 bg-white border border-slate-200 rounded-[32px] hover:border-indigo-400 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
    >
      {resource.isMirror && (
        <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[8px] px-3 py-1 font-black uppercase tracking-widest rounded-bl z-10">
          Mirror
        </div>
      )}
      <div className="flex items-start justify-between mb-4">
        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${typeColors[resource.type]}`}>
          {resource.type}
        </span>
        <span className="text-2xl">{typeIcons[resource.type]}</span>
      </div>
      <h4 className="font-black text-slate-800 text-sm mb-2 group-hover:text-indigo-600 transition-colors truncate">
        {resource.title}
      </h4>
      {resource.description && (
        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-medium">
          {resource.description}
        </p>
      )}
      <div className="mt-6 pt-4 border-t border-slate-50 flex items-center text-indigo-500 text-[10px] font-black uppercase tracking-widest">
        {resource.type === 'reddit' ? 'Read Discussion' : resource.type === 'github' ? 'Pull Repository' : 'Open Intel'}
        <svg className="w-3 h-3 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  );
};
