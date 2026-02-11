
/**
 * Core type definitions for the RepairIntel PRO application.
 */

export interface DeviceResource {
  title: string;
  url: string;
  type: 'driver' | 'manual' | 'schematic' | 'bios' | 'firmware' | 'forum' | 'blog' | 'diagnostic' | 'image' | 'guide' | 'community' | 'ifixit' | 'wiki' | 'archive' | 'reddit' | 'github' | 'stackexchange' | 'other';
  description?: string;
  isMirror?: boolean;
}

export interface SystemEntryProtocol {
  mode: 'System Admin' | 'Engineering' | 'Recovery' | 'BIOS/UEFI' | 'Diagnostics' | 'Safe Mode';
  sequence: string;
  description: string;
  reliability: 'High' | 'Experimental';
}

export interface HazardAdvisory {
  title: string;
  category: 'Recall' | 'Fire Hazard' | 'Electric Shock' | 'Data Loss';
  severity: 'CRITICAL' | 'WARNING' | 'NOTICE';
  description: string;
  actionRequired: string;
  sourceUrl?: string;
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface DeviceData {
  manufacturer: string;
  model: string;
  status: string;
  os: string;
  timestamp: string;
  releaseYear?: string;
  groundingSources?: GroundingSource[];
  specs: {
    processor: string;
    ram: string;
    storage: string;
    display: string;
    ports: string[];
    battery: string;
  };
  resources: DeviceResource[];
  insights: {
    systemEntryProtocols: SystemEntryProtocol[];
    hazardsAndRecalls: HazardAdvisory[];
    partNumbers?: { component: string; fru: string; notes: string }[];
    windowsServices?: {
      name: string;
      displayName: string;
      description: string;
      troubleshootingTip: string;
      impact: 'Critical' | 'Optional' | 'Optimization';
    }[];
    automationScripts: {
      cmd: string;
      wsl: string;
      termux: string;
    };
    ifixitSynopsis?: {
      repairabilityScore?: string;
      commonFailures: string[];
      wikiWorkarounds: string[];
    };
  };
}

export interface SearchHistoryItem {
  id: string;
  model: string;
  manufacturer: string;
  timestamp: string;
  data: DeviceData;
}
