
import { GoogleGenAI, Type } from "@google/genai";
import { DeviceData, GroundingSource } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const cleanAndParseJSON = (rawText: string) => {
  try {
    return JSON.parse(rawText.trim());
  } catch (e) {
    const jsonMatch = rawText.match(/```json\n?([\s\S]*?)\n?```/) || 
                     rawText.match(/```\n?([\s\S]*?)\n?```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1].trim());
      } catch (innerE) {}
    }
    const firstBrace = rawText.indexOf('{');
    const lastBrace = rawText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      try {
        return JSON.parse(rawText.substring(firstBrace, lastBrace + 1));
      } catch (lastE) {}
    }
    throw new Error("Forensic parsing failed. The intelligence engine output was malformed. Please re-run the audit.");
  }
};

export const fetchDeviceIntelligence = async (model: string, os: string): Promise<DeviceData> => {
  const ai = getAI();
  // Using gemini-3-pro-preview for advanced reasoning and Google Search grounding
  const targetModel = 'gemini-3-pro-preview';

  const prompt = `
    PERFORM AN EXHAUSTIVE FORENSIC ENGINEERING AUDIT FOR:
    DEVICE: ${model}
    TARGET OS: ${os}

    MANDATORY CRITICAL SEARCH OBJECTIVES:
    1. SAFETY & RECALLS (HIGHEST PRIORITY): 
       - Search for any and all FIRE HAZARDS, specifically related to battery recalls.
       - Identify specific battery model numbers or serial number ranges involved in recalls.
       - List any thermal management vulnerabilities or cooling failures.
       - Find official CPSC (Consumer Product Safety Commission) or manufacturer recall notices.

    2. SYSTEM ENTRY PROTOCOLS: 
       - Find EXACT physical button sequences and timing for BIOS, UEFI, and Boot Selection.
       - Identify "Technician-Only" or "Engineering" menu shortcuts (e.g., secret Fn combinations).
       - Determine the exact protocol for System Recovery, CMOS Clear, and Hardware Diagnostics.
       - Look for undocumented "Admin Mode" entry points.

    3. COMPREHENSIVE REPAIR INTEL:
       - Find internal FRU/CRU (Field/Customer Replaceable Unit) part numbers for the battery, motherboard, and cooling assembly.
       - Summarize community-reported failure patterns from iFixit, specialized repair forums, and Reddit.
       - Identify critical Windows/OS services that are known to cause stability or performance issues on this specific hardware.

    RETURN ONLY THIS JSON OBJECT:
    {
      "manufacturer": "Exact Manufacturer Name",
      "model": "Full Device Model String",
      "status": "Market Status (Legacy/Active/End-of-Life)",
      "releaseYear": "YYYY",
      "specs": { 
        "processor": "CPU Details", 
        "ram": "Capacity and Type", 
        "storage": "Interface and Specs", 
        "display": "Panel info", 
        "ports": ["Port list"], 
        "battery": "Capacity/Specs/Model Number" 
      },
      "resources": [
        { "title": "Resource Name", "url": "URL", "type": "driver|manual|schematic|etc", "description": "Short info" }
      ],
      "insights": {
        "systemEntryProtocols": [
          { "mode": "System Admin|Engineering|Recovery|BIOS/UEFI|Diagnostics", "sequence": "The exact buttons", "description": "What this mode allows", "reliability": "High|Experimental" }
        ],
        "hazardsAndRecalls": [
          { "title": "Recall Title", "category": "Fire Hazard|Recall|etc", "severity": "CRITICAL|WARNING", "description": "Exhaustive details including serial ranges", "actionRequired": "Steps for the user", "sourceUrl": "Link" }
        ],
        "partNumbers": [
          { "component": "Component Name", "fru": "Part Number", "notes": "Compatibility/Recall notes" }
        ],
        "windowsServices": [
          { "name": "service_name", "displayName": "Display Name", "description": "Hardware relevance", "troubleshootingTip": "Fix", "impact": "Critical|Optimization" }
        ],
        "automationScripts": { 
          "cmd": "Forensic script for Windows", 
          "wsl": "Linux hardware diagnostic script", 
          "termux": "Android remote tool script" 
        },
        "ifixitSynopsis": { 
          "repairabilityScore": "X/10", 
          "commonFailures": ["Point 1"], 
          "wikiWorkarounds": ["Workaround 1"] 
        }
      }
    }

    IMPORTANT: Use Google Search to verify all button sequences and recall data. Do not use generic placeholders.
  `;

  try {
    const response = await ai.models.generateContent({
      model: targetModel,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      }
    });

    const rawText = response.text;
    if (!rawText) throw new Error("Intelligence harvest returned empty content.");

    const parsedData = cleanAndParseJSON(rawText);
    
    // Extract grounding sources to fulfill the "Grounding" requirement
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const groundingSources: GroundingSource[] = [];
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          groundingSources.push({
            title: chunk.web.title || "External Intelligence Source",
            url: chunk.web.uri
          });
        }
      });
    }

    return {
      ...parsedData,
      os,
      timestamp: new Date().toISOString(),
      groundingSources
    };
  } catch (error: any) {
    console.error("Forensic Engine Critical Failure:", error);
    throw error;
  }
};
