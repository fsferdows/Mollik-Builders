/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  Compass, 
  Square, 
  ShieldCheck, 
  Layout, 
  ChevronRight,
  TrendingUp,
  X,
  LineChart,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Lock,
  MapPin,
  Wind,
  Sun,
  FileDown,
  Maximize,
  Minimize,
  Settings
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { FlatDetail, Project } from '../types';
import { PROJECT_LIST } from '../data';

interface VisualUnit {
  id: string; // A, B, C, D
  name: string;
  sizeSqFt: number;
  bedrooms: number;
  bathrooms: number;
  verandas: number;
  facing: string;
  idealFor: string;
  priceEstimate: string;
  basePriceNum: number; // In Lakhs BDT
  description?: string;
  highlights?: string[];
}

export const getArchitectural3DHtmlBlock = (selectedProject: Project | null | undefined, language: "en" | "bn") => {
  const currentProj = selectedProject || PROJECT_LIST[0];
  const isBangla = language === 'bn';
  const projName = isBangla ? currentProj.nameBn : currentProj.name;
  
  // Extract specs
  const landAreaVal = currentProj.specs?.find(s => s.label === "Land Area")?.value || "10 Katha";
  const heightVal = currentProj.specs?.find(s => s.label === "Building Height")?.value || "G + 9 Floors";
  const parsedKatha = parseInt(landAreaVal.replace(/[^0-9]/g, '')) || 10;
  const parsedStoreys = parseInt(heightVal.replace(/[^0-9]/g, '')) || 10;

  // Custom colors and styling based on project ID
  let colColor = "0x475569";
  let frontFlatsColor = "0xb58e2d";
  let rearFlatsColor = "0x7c3aed";
  let glassCurtainColor = "0x0ea5e9";
  let louversColor = "0x1e293b";
  let oasisTurfColor = "0x059669";
  let slabGroundColor = "0x111625";
  let slabExecutiveColor = "0x1e293b";
  let slabPanoramicColor = "0x3d301b";
  let slabPenthouseColor = "0x5c4c23";
  
  if (currentProj.id === "mollik-tower") {
    colColor = "0x475569";
    frontFlatsColor = "0xd4af37";
    rearFlatsColor = "0x4c1d95";
  } else if (currentProj.id === "mollik-heights") {
    colColor = "0x1e293b";
    frontFlatsColor = "0x3b82f6";
    rearFlatsColor = "0x64748b";
    glassCurtainColor = "0x0284c7";
  } else if (currentProj.id === "mollik-garden") {
    colColor = "0x0f172a";
    frontFlatsColor = "0x10b981";
    rearFlatsColor = "0x059669";
    glassCurtainColor = "0x0d9488";
    oasisTurfColor = "0x047857";
    slabExecutiveColor = "0x064e3b";
    slabPanoramicColor = "0x022c22";
  } else if (currentProj.id === "mollik-serenade") {
    colColor = "0x3f220f";
    frontFlatsColor = "0xca8a04";
    rearFlatsColor = "0xd97706";
    slabExecutiveColor = "0x271306";
    slabPanoramicColor = "0x451a03";
  } else if (currentProj.id === "mollik-grandeur") {
    colColor = "0x292524";
    frontFlatsColor = "0xb45309";
    rearFlatsColor = "0x9a3412";
    slabExecutiveColor = "0x1c1917";
    slabPanoramicColor = "0x44403c";
  } else if (currentProj.id === "mollik-splendour") {
    colColor = "0xcbd5e1";
    frontFlatsColor = "0xf8fafc";
    rearFlatsColor = "0x38bdf8";
    glassCurtainColor = "0xbae6fd";
    slabExecutiveColor = "0x0f172a";
    slabPanoramicColor = "0x1e293b";
  } else if (currentProj.id === "mollik-heritage") {
    colColor = "0xb91c1c";
    frontFlatsColor = "0xef4444";
    rearFlatsColor = "0x7f1d1d";
    slabExecutiveColor = "0x451a03";
    slabPanoramicColor = "0xfef08a";
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mollik Tower — Interactive 3D Modified Master Plan</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      background-color: #05070f;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "JetBrains Mono", monospace;
      user-select: none;
    }
    #viewport-container {
      width: 100vw;
      height: 100vh;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
    }
    #ui-overlay {
      position: absolute;
      top: 15px;
      left: 15px;
      background: rgba(8, 11, 22, 0.95);
      border: 1px solid rgba(212, 175, 55, 0.3);
      border-radius: 6px;
      padding: 16px;
      color: #ffffff;
      width: 250px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.8);
      pointer-events: auto;
      backdrop-filter: blur(10px);
      z-index: 10;
      transition: opacity 0.25s ease, transform 0.25s ease;
    }
    h1 {
      font-size: 14px;
      font-weight: 700;
      margin: 0 0 2px 0;
      color: #d4af37;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .subtitle {
      font-size: 8px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 12px;
      display: block;
      border-bottom: 1px solid rgba(212, 175, 55, 0.15);
      padding-bottom: 6px;
    }
    .step-btn {
      display: block;
      width: 100%;
      background: rgba(30, 41, 59, 0.35);
      border: 1px solid rgba(255,255,255,0.05);
      color: #cbd5e1;
      padding: 8px 10px;
      margin-bottom: 6px;
      text-align: left;
      border-radius: 4px;
      cursor: pointer;
      font-size: 10px;
      font-weight: 500;
      transition: all 0.2s ease;
      font-family: monospace;
      outline: none;
    }
    .step-btn:hover {
      background: rgba(212, 175, 55, 0.15);
      color: #ffffff;
      border-color: rgba(212, 175, 55, 0.4);
    }
    .step-btn.active {
      background: #d4af37;
      color: #05070f;
      border-color: #d4af37;
      font-weight: 700;
    }
    #three-loader {
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: #05070f;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.6s;
    }
    .engine-spinner {
      width: 44px;
      height: 44px;
      border: 2px solid rgba(212, 175, 55, 0.12);
      border-top: 2px solid #d4af37;
      border-radius: 50%;
      animation: engine-spin 0.85s linear infinite;
      position: relative;
    }
    .engine-indicator {
      position: absolute;
      width: 22px;
      height: 22px;
      border: 1px solid rgba(212, 175, 55, 0.25);
      border-radius: 50%;
      animation: engine-pulse 1.7s ease-in-out infinite;
    }
    @keyframes engine-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes engine-pulse {
      0%, 100% { transform: scale(0.85); opacity: 0.35; }
      50% { transform: scale(1.15); opacity: 0.85; }
    }

    /* Class for sections inside the sidebar overlay */
    .overlay-sect {
      margin-top: 15px;
      border-top: 1px solid rgba(212, 175, 55, 0.15);
      padding-top: 12px;
    }
    .sect-title {
      font-size: 8px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 8px;
      display: block;
      font-weight: 600;
    }
    
    /* Elegant Custom Select Dropdown matching the quiet luxury style */
    .luxury-select {
      width: 100%;
      background: rgba(13, 17, 30, 0.9);
      border: 1px solid rgba(212, 175, 55, 0.25);
      color: #cbd5e1;
      padding: 6px 10px;
      font-size: 9px;
      font-family: monospace;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-radius: 4px;
      cursor: pointer;
      outline: none;
      transition: all 0.2s ease;
    }
    .luxury-select:hover {
      border-color: rgba(212, 175, 55, 0.5);
      color: #ffffff;
    }
    .luxury-select option {
      background: #080b16;
      color: #cbd5e1;
    }

    /* Lighting grid and controls */
    .grid-2col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5px;
    }
    .grid-btn {
      background: rgba(30, 41, 59, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.05);
      color: #cbd5e1;
      padding: 5px;
      font-size: 8px;
      font-family: monospace;
      text-transform: uppercase;
      border-radius: 4px;
      cursor: pointer;
      text-align: center;
      transition: all 0.2s ease;
    }
    .grid-btn:hover {
      background: rgba(212, 175, 55, 0.12);
      color: #fff;
      border-color: rgba(212, 175, 55, 0.3);
    }
    .grid-btn.active {
      background: rgba(212, 175, 55, 0.2);
      border-color: #d4af37;
      color: #d4af37;
      font-weight: bold;
    }

    /* Measure panel styles */
    .measure-btn {
      width: 100%;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #10b981;
      padding: 6px;
      font-size: 9px;
      font-family: monospace;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-radius: 4px;
      cursor: pointer;
      text-align: center;
      transition: all 0.2s;
    }
    .measure-btn:hover {
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
    }
    .measure-btn.active {
      background: #10b981;
      color: #05070f;
      border-color: #10b981;
      font-weight: bold;
    }
    .measure-clear {
      width: 100%;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #ef4444;
      padding: 5px;
      font-size: 8px;
      font-family: monospace;
      text-transform: uppercase;
      border-radius: 4px;
      cursor: pointer;
      text-align: center;
      margin-top: 5px;
      display: none;
    }
    .measure-clear:hover {
      background: rgba(239, 68, 68, 0.2);
    }
    
    /* Center Help HUD for Point Measurement */
    #measure-hud {
      position: absolute;
      top: 15px;
      transform: translateX(-50%);
      left: 50%;
      background: rgba(5, 7, 15, 0.95);
      border: 1px solid #10b981;
      border-radius: 6px;
      padding: 10px 16px;
      color: #ffffff;
      font-family: monospace;
      font-size: 9px;
      letter-spacing: 0.5px;
      display: none;
      align-items: center;
      gap: 8px;
      pointer-events: none;
      z-index: 100;
      box-shadow: 0 10px 30px rgba(0,0,0,0.8);
    }
    .hud-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
      animation: pulse-green 1.5s infinite;
    }
    @keyframes pulse-green {
      0% { transform: scale(0.9); opacity: 0.5; }
      50% { transform: scale(1.3); opacity: 1; }
      100% { transform: scale(0.9); opacity: 0.5; }
    }

    @media (max-width: 640px) {
      #ui-overlay {
        top: auto !important;
        bottom: 12px !important;
        left: 12px !important;
        right: 12px !important;
        width: auto !important;
        max-width: calc(100% - 24px) !important;
        max-height: 38vh !important;
        overflow-y: auto !important;
        padding: 10px 12px !important;
        font-size: 8px !important;
        box-shadow: 0 4px 20px rgba(0,0,0,0.95) !important;
      }
      h1 {
        font-size: 11px !important;
        margin-bottom: 2px !important;
      }
      .subtitle {
        font-size: 7px !important;
        margin-bottom: 8px !important;
        padding-bottom: 4px !important;
      }
      .step-btn {
        padding: 4px 6px !important;
        font-size: 8px !important;
        margin-bottom: 4px !important;
      }
      #measure-hud {
        top: 10px !important;
        width: 85% !important;
        padding: 6px 10px !important;
        font-size: 8px !important;
      }
      .luxury-select {
        font-size: 8px !important;
        padding: 4px 6px !important;
      }
      .grid-btn, .measure-btn {
        padding: 4px !important;
        font-size: 7px !important;
      }
      .overlay-sect {
        margin-top: 8px !important;
        padding-top: 6px !important;
      }
    }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
</head>
<body>

  <div id="three-loader">
    <div style="position: relative; display: flex; align-items: center; justify-content: center;">
      <div class="engine-spinner"></div>
      <div class="engine-indicator"></div>
    </div>
    <div style="margin-top: 18px; text-align: center;">
      <h2 style="margin: 0; color: #d4af37; font-family: serif; font-size: 13px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;">${projName} 3D</h2>
      <p style="margin: 5px 0 0 0; color: #64748b; font-family: monospace; font-size: 8px; text-transform: uppercase; letter-spacing: 0.18em; line-height: 1.2;">Initializing 3D Engine...<br><span style="color: #475569; font-size: 7px;">Plot & Column Matrix Calibration</span></p>
    </div>
  </div>

  <div id="viewport-container"></div>

  <div id="measure-hud">
    <div class="hud-dot"></div>
    <span id="measure-hud-text">MEASUREMENT ACTIVE: CLICK FIRST POINT ON THE BUILDING</span>
  </div>

  <div id="ui-overlay">
    <h1>${projName} 3D</h1>
    <span class="subtitle">Isolation Explorer</span>
    
    <button id="btn-all" class="step-btn active" onclick="focusStage('all', this)">[0] Full Exterior Profile</button>
    <button id="btn-step1" class="step-btn" onclick="focusStage('step1', this)">[1] 10-Katha Plot Setbacks</button>
    <button id="btn-step2" class="step-btn" onclick="focusStage('step2', this)">[2] Tapering Columns Grid</button>
    <button id="btn-step3" class="step-btn" onclick="focusStage('step3', this)">[3] Central Lift/Stairs Core</button>
    <button id="btn-step4" class="step-btn" onclick="focusStage('step4', this)">[4] Typical Floor Splitting</button>
    <button id="btn-step5" class="step-btn" onclick="focusStage('step5', this)">[5] G-Floor Covered Parking</button>
    <button id="btn-step6" class="step-btn" onclick="focusStage('step6', this)">[6] Rooftop Oasis Sanctuary</button>

    <!-- DRILL-DOWN LAYER FILTER -->
    <div class="overlay-sect">
      <span class="sect-title">Level Drill-Down</span>
      <select class="luxury-select" id="floor-filter-select" onchange="filterFloor(this.value)">
        <option value="all">[-] Display All Levels</option>
        <option value="ground">Ground Floor (Parking)</option>
        <option value="executive">Levels 1-3 (Executive Suites)</option>
        <option value="panoramic">Levels 4-7 (Panoramic Units)</option>
        <option value="penthouse">Levels 8-9 (Penthouse Suites)</option>
        <option value="rooftop">Level 10 (Rooftop Sanctuary)</option>
      </select>
    </div>

    <!-- ARCHITECTURAL PROJECTIONS -->
    <div class="overlay-sect">
      <span class="sect-title">Standard Elevations</span>
      <div class="grid-2col" style="grid-template-columns: 1fr 1fr 1fr; gap: 4px;">
        <button class="grid-btn" style="font-size: 7.5px;" onclick="setElevationView('north')">North Elev</button>
        <button class="grid-btn" style="font-size: 7.5px;" onclick="setElevationView('south')">South Iso</button>
        <button class="grid-btn" style="font-size: 7.5px;" onclick="setElevationView('top')">Rooftop Top</button>
      </div>
    </div>

    <!-- ORBIT SENSITIVITY CONTROLS -->
    <div class="overlay-sect">
      <span class="sect-title">Orbit Dynamics</span>
      <div style="margin-bottom: 5px;">
        <div style="display: flex; justify-content: space-between; font-family: monospace; font-size: 7.5px; color: #94a3b8; margin-bottom: 2px;">
          <span>ZOOM SPEED</span>
          <span id="zoom-lbl">1.0X</span>
        </div>
        <input type="range" id="zoom-speed-slider" min="0.2" max="3.0" step="0.1" value="1.0" style="width: 100%; accent-color: #d4af37;" oninput="updateOrbitSensitivity('zoom', this.value)">
      </div>
      <div>
        <div style="display: flex; justify-content: space-between; font-family: monospace; font-size: 7.5px; color: #94a3b8; margin-bottom: 2px;">
          <span>PAN DYNAMICS</span>
          <span id="pan-lbl">1.0X</span>
        </div>
        <input type="range" id="pan-speed-slider" min="0.2" max="3.0" step="0.1" value="1.0" style="width: 100%; accent-color: #d4af37;" oninput="updateOrbitSensitivity('pan', this.value)">
      </div>
    </div>

    <!-- VISUAL MODEL TOGGLE (TROGGLE MODE) -->
    <div class="overlay-sect">
      <span class="sect-title">Render Toggle Mode</span>
      <div class="grid-2col">
        <button id="render-realistic" class="grid-btn active" onclick="setRenderMode('realistic')">Layered Solid</button>
        <button id="render-blueprints" class="grid-btn" onclick="setRenderMode('blueprints')">Blueprint Glass</button>
      </div>
    </div>

    <!-- LIGHTING ENVIRONMENT SIMULATION -->
    <div class="overlay-sect">
      <span class="sect-title">Lighting & Solar Simulation</span>
      <div class="grid-2col">
        <button id="light-noon" class="grid-btn active" onclick="simulateLighting('noon')">Noon Sun</button>
        <button id="light-morning" class="grid-btn" onclick="simulateLighting('morning')">Morning Sun</button>
        <button id="light-dusk" class="grid-btn" onclick="simulateLighting('dusk')">Dusk Ambient</button>
        <button id="light-midnight" class="grid-btn" onclick="simulateLighting('midnight')">Midnight Glow</button>
      </div>
    </div>

    <!-- POINT-TO-POINT MEASUREMENT TOOL -->
    <div class="overlay-sect">
      <span class="sect-title">Precision Dimensions</span>
      <button id="btn-measure" class="measure-btn" onclick="toggleMeasurementMode()">Measure Distance</button>
      <button id="btn-measure-clear" class="measure-clear" onclick="clearMeasurements()">Clear Points</button>
    </div>

    <!-- STEREO WALKTHROUGH MODE -->
    <div class="overlay-sect">
      <span class="sect-title">Digital Twin Walkthrough</span>
      <button id="btn-vr" class="grid-btn" style="width: 100%; border-color: rgba(212, 175, 55, 0.2);" onclick="toggleVRMode()">
        👓 Toggle VR Stereo View
      </button>
    </div>

    <!-- FIELD SITE INSPECTION SNAPSHOT -->
    <div class="overlay-sect">
      <span class="sect-title">Verification Logs</span>
      <button id="btn-capture" class="grid-btn" style="width: 100%; background: rgba(212, 175, 55, 0.1); border-color: #d4af37; color: #d4af37; font-weight: 500;" onclick="triggerInspectionSnapshot()">
        📸 Capture Site Inspection
      </button>
    </div>
  </div>

  <!-- Snapshot View Camera Modal Viewfinder HUD -->
  <div id="snapshot-modal" style="position: absolute; inset: 0; background: rgba(5,7,15,0.96); z-index: 10000; display: none; flex-direction: column; align-items: center; justify-content: center; font-family: monospace; color: white; padding: 20px;">
    <div style="background: #080b16; border: 1px solid #d4af37; border-radius: 8px; width: 95%; max-width: 500px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 20px 50px rgba(0,0,0,0.95);">
      <div style="padding: 12px 16px; border-bottom: 1px solid rgba(212,175,55,0.25); display: flex; justify-content: space-between; align-items: center; background: rgba(212,175,55,0.06);">
        <span style="color: #d4af37; font-size: 10px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">Mollik-2 Field Inspection Camera</span>
        <button onclick="closeSnapshotModal()" style="background: none; border: none; color: #64748b; cursor: pointer; font-size: 18px; line-height: 1;">&times;</button>
      </div>
      
      <div style="position: relative; aspect-ratio: 4/3; margin: 16px; background: #000; border: 1px solid rgba(212,175,55,0.15); display: flex; align-items: center; justify-content: center; overflow: hidden;">
        <video id="webcam-video" autoplay playsinline style="width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); display: none;"></video>
        <canvas id="fallback-canvas" style="display: none; width: 100%; height: 100%; object-fit: contain;"></canvas>
        <div id="loader-camera" style="color: #64748b; font-size: 9px; text-transform: uppercase; letter-spacing: 1px; text-align: center;">Initializing live optical device...</div>
        
        <!-- Camera viewfinder UI markings -->
        <div style="position: absolute; inset: 24px; border: 1px dashed rgba(212,175,55,0.2); pointer-events: none;">
          <div style="position: absolute; top: -1px; left: -1px; width: 8px; height: 8px; border-top: 1.5px solid #d4af37; border-left: 1.5px solid #d4af37;"></div>
          <div style="position: absolute; top: -1px; right: -1px; width: 8px; height: 8px; border-top: 1.5px solid #d4af37; border-right: 1.5px solid #d4af37;"></div>
          <div style="position: absolute; bottom: -1px; left: -1px; width: 8px; height: 8px; border-bottom: 1.5px solid #d4af37; border-left: 1.5px solid #d4af37;"></div>
          <div style="position: absolute; bottom: -1px; right: -1px; width: 8px; height: 8px; border-bottom: 1.5px solid #d4af37; border-right: 1.5px solid #d4af37;"></div>
          
          <div style="position: absolute; top: 50%; left: 50%; width: 12px; height: 1.5px; background: rgba(212,175,55,0.45); transform: translate(-50%, -50%);"></div>
          <div style="position: absolute; top: 50%; left: 50%; width: 1.5px; height: 12px; background: rgba(212,175,55,0.45); transform: translate(-50%, -50%);"></div>
        </div>
      </div>

      <div style="padding: 0 16px 16px 16px; display: flex; flex-direction: column; gap: 8px;">
        <button id="btn-shutter" onclick="captureShutterFrame()" style="width: 100%; background: #d4af37; border: none; border-radius: 4px; color: #05070f; font-family: monospace; font-size: 11px; font-weight: bold; padding: 10px; cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px; transition: all 0.2s;">
          📷 Trigger Capture Frame
        </button>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <button id="btn-toggle-source" onclick="toggleSnapshotSource()" style="background: rgba(30,41,59,0.5); border: 1px solid rgba(212,175,55,0.2); color: #cbd5e1; border-radius: 4px; font-family: monospace; font-size: 8.5px; padding: 6px; cursor: pointer;">
            Toggle Source (Webcam/3D)
          </button>
          <button onclick="closeSnapshotModal()" style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); color: #fc8181; border-radius: 4px; font-family: monospace; font-size: 8.5px; padding: 6px; cursor: pointer;">
            Cancel Audit
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Snapshot View Save & Saved Document Sheet -->
  <div id="capture-saved-modal" style="position: absolute; inset: 0; background: rgba(5,7,15,0.98); z-index: 10001; display: none; flex-direction: column; align-items: center; justify-content: center; font-family: monospace; color: white; padding: 20px;">
    <div style="background: #080b16; border: 1px solid #d4af37; border-radius: 8px; width: 95%; max-width: 500px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 20px 50px rgba(0,0,0,0.95);">
      <div style="padding: 12px 16px; border-bottom: 1px solid rgba(212,175,55,0.25); display: flex; justify-content: space-between; align-items: center; background: rgba(212,175,55,0.06);">
        <span style="color: #d4af37; font-size: 10px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase;">Inspection Frame Compiled</span>
        <button onclick="closeSavedModal()" style="background: none; border: none; color: #64748b; cursor: pointer; font-size: 18px; line-height: 1;">&times;</button>
      </div>
      
      <div style="padding: 16px; text-align: center;">
        <div style="border: 4px solid #ffffff; background: #ffffff; box-shadow: 0 10px 30px rgba(0,0,0,0.6); overflow: hidden; margin-bottom: 16px;">
          <img id="saved-snapshot-img" style="width: 100%; display: block; filter: contrast(1.02) brightness(0.99);" />
        </div>
        <span style="color: #10b981; font-size: 9.5px; font-weight: bold; display: block; margin-bottom: 12px; tracking-wider: 1px;">✓ TECHNICAL RECORD SECURED WITH RAJUK METADATA HEADER</span>
        
        <div style="display: flex; gap: 8px;">
          <button id="btn-download-image" onclick="downloadCompiledLog()" style="flex: 1; background: #10b981; border: none; border-radius: 4px; color: #05070f; font-family: monospace; font-size: 11px; font-weight: bold; padding: 10px; cursor: pointer; text-transform: uppercase;">
            💾 Save Inspection JPEG
          </button>
          <button onclick="closeSavedModal()" style="background: rgba(30,41,59,0.5); border: 1px solid rgba(255,255,255,0.08); color: #fff; border-radius: 4px; font-family: monospace; font-size: 11px; padding: 10px; cursor: pointer;">
            Close Sheet
          </button>
        </div>
      </div>
    </div>
  </div>

  <script>
    const container = document.getElementById('viewport-container');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05070f);
    // Disable fog entirely to maintain beautiful, accurate, and pin-sharp graphics even at extreme zoom ranges
    scene.fog = null; 

    const initialWidth = container ? (container.clientWidth || window.innerWidth || 800) : 800;
    const initialHeight = container ? (container.clientHeight || window.innerHeight || 600) : 600;
    const camera = new THREE.PerspectiveCamera(45, initialWidth / initialHeight, 1, 1500);
    camera.position.set(55, 50, 75);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance", preserveDrawingBuffer: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1); 
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    
    if (container) {
      container.appendChild(renderer.domElement);
      renderer.setSize(initialWidth, initialHeight);
    }

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.01; 
    controls.minDistance = 12;
    // Set reasonable max distance corresponding to the site limits to avoid tiny-scale pixel interpolation
    controls.maxDistance = 260; 
    controls.target.set(0, 16, 0);
    controls.update();

    // Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffdf4, 1.35);
    sunLight.position.set(45, 90, 35);
    sunLight.castShadow = true;
    sunLight.shadow.bias = -0.0003;
    scene.add(sunLight);

    const rimSkyLight = new THREE.DirectionalLight(0x38bdf8, 0.5);
    rimSkyLight.position.set(-45, 30, -35);
    scene.add(rimSkyLight);

    // Ground Plot base
    const siteGeo = new THREE.PlaneGeometry(240, 240);
    const siteMat = new THREE.MeshStandardMaterial({ color: 0x060914, roughness: 0.98 });
    const ground = new THREE.Mesh(siteGeo, siteMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Site Plot boundary for 10 Katha
    // 10 Katha is 7,200 sqft. Let's model a 36m x 33.3m plot base (width=36m, depth=33.3m)
    const plotGrid = new THREE.GridHelper(180, 45, 0xd4af37, 0x111c30);
    plotGrid.position.y = 0.01;
    scene.add(plotGrid);

    // Helper function to draw rounded pill-shaped HTML labels or Canvas Text Sprites
    function roundRect(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    }

    function createTextSprite(text, color = '#d4af37', bgColor = 'rgba(8, 12, 24, 0.92)') {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 120;
      const ctx = canvas.getContext('2d');
      
      // Draw background rounded capsule
      ctx.fillStyle = bgColor;
      roundRect(ctx, 4, 4, 504, 112, 16);
      ctx.fill();
      
      // Border
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      roundRect(ctx, 4, 4, 504, 112, 16);
      ctx.stroke();
      
      // Core Monospace Text
      ctx.fillStyle = '#ffffff';
      ctx.font = '22px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 256, 60);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(15, 3.5, 1);
      return sprite;
    }

    // Dimension line logic with arrows and labels
    function createDimensionLine(p1, p2, color = 0xd4af37) {
      const dimGroup = new THREE.Group();
      const points = [p1, p2];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: color, linewidth: 2 });
      const line = new THREE.Line(geometry, material);
      dimGroup.add(line);

      // Attach tiny arrowheads
      const arrowMat = new THREE.MeshBasicMaterial({ color: color });
      const arrowGeo = new THREE.ConeGeometry(0.4, 1.2, 5);
      arrowGeo.rotateX(Math.PI / 2);

      const arrowStart = new THREE.Mesh(arrowGeo, arrowMat);
      arrowStart.position.copy(p1);
      arrowStart.lookAt(p2);

      const arrowEnd = new THREE.Mesh(arrowGeo, arrowMat);
      arrowEnd.position.copy(p2);
      arrowEnd.lookAt(p1);

      dimGroup.add(arrowStart, arrowEnd);
      return dimGroup;
    }

    // Set dynamic layers
    const structuralBaseGroup = new THREE.Group();
    const columnsGroup = new THREE.Group();
    const coreGroup = new THREE.Group();
    const flatsGroup = new THREE.Group();
    const roofGroup = new THREE.Group();
    const interactiveOverlayGroup = new THREE.Group();
    const completeBuildingGroup = new THREE.Group();

    // Materials definitions with authentic architectural texture looks
    const matSetbacks = new THREE.MeshStandardMaterial({ color: 0xd4af37, transparent: true, opacity: 0.12, wireframe: true });
    const matColumns = new THREE.MeshStandardMaterial({ color: ${colColor}, roughness: 0.5, metalness: 0.4, transparent: true, opacity: 1.0 });
    const matCoreArea = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.5, metalness: 0.1, transparent: true, opacity: 1.0 });
    const matFrontFlats = new THREE.MeshStandardMaterial({ color: ${frontFlatsColor}, transparent: true, opacity: 0.75, roughness: 0.3 }); // Unit A/B Golden
    const matRearFlats = new THREE.MeshStandardMaterial({ color: ${rearFlatsColor}, transparent: true, opacity: 0.75, roughness: 0.3 }); // Unit C/D Purple
    // Procedural Wood Parquet Texture Generator
    function createWoodTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#78350f';
      ctx.fillRect(0, 0, 512, 512);

      const rows = 16;
      const cols = 8;
      const rh = 512 / rows;
      const cw = 512 / cols;

      for (let r = 0; r < rows; r++) {
        const offset = (r % 2 === 0) ? cw / 2 : 0;
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 1;

        for (let c = -1; c <= cols; c++) {
          const x = c * cw + offset;
          const y = r * rh;
          ctx.fillStyle = (c + r) % 2 === 0 ? '#7c2d12' : '#9a3412';
          ctx.fillRect(x + 1, y + 1, cw - 2, rh - 2);
          ctx.strokeRect(x, y, cw, rh);

          // Grain lines
          ctx.fillStyle = '#451a03';
          ctx.globalAlpha = 0.12;
          for (let g = 0; g < 4; g++) {
            ctx.fillRect(x + Math.random() * (cw - 20), y + Math.random() * (rh - 2), 15 + Math.random() * 20, 1 + Math.random() * 2);
          }
          ctx.globalAlpha = 1.0;
        }
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 4);
      return texture;
    }

    // Procedural Veined Marble Texture Generator
    function createMarbleTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, 512, 512);

      ctx.strokeStyle = '#cbd5e1';
      ctx.globalAlpha = 0.45;
      for (let v = 0; v < 16; v++) {
        ctx.lineWidth = 0.5 + Math.random() * 1.5;
        ctx.beginPath();
        let sx = Math.random() * 512;
        let sy = 0;
        ctx.moveTo(sx, sy);
        while (sy < 512) {
          sx += (Math.random() - 0.5) * 35;
          sy += 10 + Math.random() * 30;
          ctx.lineTo(sx, sy);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;

      // Tile seams
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      for (let s = 1; s < 4; s++) {
        const val = s * 128;
        ctx.beginPath();
        ctx.moveTo(val, 0); ctx.lineTo(val, 512);
        ctx.moveTo(0, val); ctx.lineTo(512, val);
        ctx.stroke();
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(3, 3);
      return texture;
    }

    const texWood = createWoodTexture();
    const texMarble = createMarbleTexture();

    const matGlassCurtain = new THREE.MeshPhysicalMaterial({ 
      color: 0xbae6fd, 
      transparent: true, 
      opacity: 0.40, 
      roughness: 0.05, 
      metalness: 0.1,
      transmission: 0.85, 
      ior: 1.5, 
      thickness: 0.15,
      clearcoat: 1.0, 
      clearcoatRoughness: 0.05 
    });
    const matLouvers = new THREE.MeshStandardMaterial({ color: ${louversColor}, roughness: 0.6, transparent: true, opacity: 1.0 });
    const matOasisTurf = new THREE.MeshStandardMaterial({ color: ${oasisTurfColor}, roughness: 0.9, transparent: true, opacity: 1.0 });
    const matSetbackDanger = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.15 });

    // Realistic partition walls and furniture materials
    const matWall = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.85, metalness: 0.1, transparent: true, opacity: 0.95 });
    const matFloorWood = new THREE.MeshStandardMaterial({ map: texWood, bumpMap: texWood, bumpScale: 0.008, roughness: 0.55, transparent: true, opacity: 1.0 });
    const matFloorTile = new THREE.MeshPhysicalMaterial({ map: texMarble, roughness: 0.15, clearcoat: 0.9, clearcoatRoughness: 0.1, transparent: true, opacity: 1.0 });
    const matFloorBath = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8, transparent: true, opacity: 1.0 });
    const matFurnitureWood = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.5, transparent: true, opacity: 1.0 });
    const matFurnitureFabric = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.9, transparent: true, opacity: 1.0 });
    const matSanitary = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, transparent: true, opacity: 1.0 });

    const matMetalChrome = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 1.0 });
    const matLightWarm = new THREE.MeshBasicMaterial({ color: 0xfef08a }); 
    const matPlantLeaf = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8, transparent: true, opacity: 1.0 });
    const matPlantPot = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.9, transparent: true, opacity: 1.0 });

    // 4 Distinct Slab types/materials to color-code vertical tiers of the G+9 tower (Clearly Visible & Understandable)
    const matSlabGround = new THREE.MeshStandardMaterial({ color: ${slabGroundColor}, roughness: 0.95, transparent: true, opacity: 1.0 }); // Ground Floor Asphalt & Pavers
    const matSlabExecutive = new THREE.MeshStandardMaterial({ color: ${slabExecutiveColor}, roughness: 0.70, transparent: true, opacity: 1.0 }); // Levels 1 to 3 Executive
    const matSlabPanoramic = new THREE.MeshStandardMaterial({ color: ${slabPanoramicColor}, roughness: 0.50, transparent: true, opacity: 1.0 }); // Levels 4 to 7 Panoramic (Crema Beige look)
    const matSlabPenthouse = new THREE.MeshStandardMaterial({ color: ${slabPenthouseColor}, roughness: 0.30, metalness: 0.1, transparent: true, opacity: 1.0 }); // Levels 8 to 9 Penthouse (White & Gold)

    const floorHeight = 3.2; 
    const totalStoreys = 10;

    // 1. Plot Outlines & Setbacks (Ground)
    const wireframeGeo = new THREE.BoxGeometry(36, floorHeight * totalStoreys, 34);
    const setbackBox = new THREE.Mesh(wireframeGeo, matSetbacks);
    setbackBox.position.set(0, (floorHeight * totalStoreys) / 2, 0);
    structuralBaseGroup.add(setbackBox);

    // Highlight setback limits (MGC 60% compliance)
    const marginCover = new THREE.Mesh(new THREE.BoxGeometry(40, 0.1, 38), matSetbackDanger);
    marginCover.position.set(0, 0.05, 0);
    structuralBaseGroup.add(marginCover);

    // Adding Plot setbacks Dimension arrows
    const plotWidthArrow = createDimensionLine(new THREE.Vector3(-20, 0.2, 19), new THREE.Vector3(20, 0.2, 19), 0xd4af37);
    const plotLengthArrow = createDimensionLine(new THREE.Vector3(20, 0.2, -19), new THREE.Vector3(20, 0.2, 19), 0xd4af37);
    structuralBaseGroup.add(plotWidthArrow, plotLengthArrow);

    const sprite10Katha = createTextSprite("10-KATHA PLOT: 120 FT x 60 FT", "#d4af37");
    sprite10Katha.position.set(0, 1.2, 22);
    structuralBaseGroup.add(sprite10Katha);

    const spriteSetbacks = createTextSprite("RAJUK COMPLIANCE: 20% SETBACKS (MGC 60%)", "#ef4444");
    spriteSetbacks.position.set(0, 5, 0);
    structuralBaseGroup.add(spriteSetbacks);

    // Deep Subterranean Bored Cast-in-situ Piles (Civil Engineering Foundation)
    const pileMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9, transparent: true, opacity: 0.65 });
    const colsListGrid = [
      [-12, -14], [-4, -14], [4, -14], [12, -14],
      [-12, 0],   [-4, 0],   [4, 0],   [12, 0],
      [-12, 14],  [-4, 14],  [4, 14],  [12, 14]
    ];
    colsListGrid.forEach((coord) => {
      // Create a long cast pile going from y = -25 to y = 0 (110ft deep equivalent)
      const pileGeo = new THREE.CylinderGeometry(0.5, 0.5, 25, 8);
      const pileMesh = new THREE.Mesh(pileGeo, pileMat);
      pileMesh.position.set(coord[0], -12.5, coord[1]);
      pileMesh.castShadow = true;
      pileMesh.receiveShadow = true;
      structuralBaseGroup.add(pileMesh);
      
      // Concrete Pile cap block
      const capGeo = new THREE.BoxGeometry(1.6, 1.0, 1.6);
      const capMesh = new THREE.Mesh(capGeo, pileMat);
      capMesh.position.set(coord[0], -0.5, coord[1]);
      structuralBaseGroup.add(capMesh);
    });
    
    // Label for subterranean piling
    const pileLabelSprite = createTextSprite("110-FT DEEP BORED CAST-IN-SITU PILES FOUNDATION", "#38bdf8", "rgba(13, 17, 30, 0.95)");
    pileLabelSprite.position.set(0, -6, 20);
    pileLabelSprite.scale.set(13, 3.0, 1);
    structuralBaseGroup.add(pileLabelSprite);


    // 2. Pillars Grid
    const columnBaseGrid = [
      [-12, -14], [-4, -14], [4, -14], [12, -14],
      [-12, 0],   [-4, 0],   [4, 0],   [12, 0],
      [-12, 14],  [-4, 14],  [4, 14],  [12, 14]
    ];

    function createDetailedUnit(width, depth, isLeft, isFront, tier) {
      const unitGroup = new THREE.Group();
      
      const accentColor = isFront ? 0xb58e2d : 0x7c3aed;
      const mx = isLeft ? 1 : -1;
      const mz = isFront ? 1 : -1;

      // Helper to add floor meshes
      function addFloorSection(lx, lz, w, d, material, roomName, roomNameBn, sizeSqFt) {
        const geo = new THREE.BoxGeometry(w, 0.02, d);
        const mesh = new THREE.Mesh(geo, material);
        mesh.position.set(lx, -floorHeight / 2 + 0.01, lz);
        mesh.receiveShadow = true;
        mesh.userData = { 
          floorIndex: tier,
          roomName: roomName,
          roomNameBn: roomNameBn,
          sizeSqFt: sizeSqFt
        };
        unitGroup.add(mesh);
      }

      // Add floor sectors
      if (depth > 12) {
        // Unit A/B (depth 13)
        // Bedrooms
        addFloorSection(mx * -3.2, mz * 3.5, 5.5, 5.0, matFloorWood, "Master Bedroom", "মাস্টার বেডরুম", 185);     // Master Bed
        addFloorSection(mx * -3.8, mz * -2.5, 4.4, 4.0, matFloorWood, "Bedroom 2", "বেডরুম ২", 145);    // Bed 2
        addFloorSection(mx * 0.7, mz * -2.5, 4.0, 4.0, matFloorWood, "Bedroom 3", "বেডরুম ৩", 130);     // Bed 3
        // Living & Dining
        addFloorSection(mx * 3.3, mz * 2.0, 5.5, 8.0, matFloorTile, "Living & Dining Room", "লিভিং ও ডাইনিং রুম", 320);
        // Kitchen
        addFloorSection(mx * 4.4, mz * -3.0, 3.2, 4.0, matFloorTile, "Kitchen Area", "রান্নাঘর", 110);
        // Bathrooms
        addFloorSection(mx * -1.0, mz * 0.2, 2.0, 2.0, matFloorBath, "Master Bathroom (Attached)", "মাস্টার বাথরুম", 65);     // Master Bath
        addFloorSection(mx * 2.2, mz * -3.0, 2.0, 2.0, matFloorBath, "Common Bathroom", "কমন বাথরুম", 65);     // Common Bath
      } else {
        // Unit C/D (depth 11)
        // Bedrooms
        addFloorSection(mx * -3.2, mz * 2.8, 5.5, 4.4, matFloorWood, "Master Bedroom", "মাস্টার বেডরুম", 175);     // Master Bed
        addFloorSection(mx * -3.8, mz * -2.5, 4.4, 3.5, matFloorWood, "Bedroom 2", "বেডরুম ২", 135);    // Bed 2
        addFloorSection(mx * 0.7, mz * -2.5, 4.0, 3.5, matFloorWood, "Bedroom 3", "বেডরুম ৩", 125);     // Bed 3
        // Living & Dining
        addFloorSection(mx * 3.3, mz * 1.5, 5.5, 7.0, matFloorTile, "Living & Dining Room", "লিভিং ও ডাইনিং রুম", 290);
        // Kitchen
        addFloorSection(mx * 4.4, mz * -3.0, 3.2, 3.5, matFloorTile, "Kitchen Area", "রান্নাঘর", 100);
        // Bathrooms
        addFloorSection(mx * -1.0, mz * 0.1, 2.0, 1.8, matFloorBath, "Master Bathroom (Attached)", "মাস্টার বাথরুম", 60);     // Master Bath
        addFloorSection(mx * 2.2, mz * -3.0, 2.0, 1.8, matFloorBath, "Common Bathroom", "কমন বাথরুম", 60);     // Common Bath
      }

      // 2. WALL PARTITIONS (0.12 thickness, wHeight)
      const wHeight = floorHeight - 0.12;
      const wThickness = 0.12;

      function addWall(lx, lz, w, d) {
        const geo = new THREE.BoxGeometry(w, wHeight, d);
        const mesh = new THREE.Mesh(geo, matWall);
        mesh.position.set(lx, -floorHeight / 2 + wHeight / 2, lz);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData = { floorIndex: tier };
        unitGroup.add(mesh);
      }

      // Outer border walls (with gaps for windows/balconies)
      addWall(0, mz * (depth/2 - wThickness/2), width - 1.0, wThickness);
      addWall(0, mz * (-depth/2 + wThickness/2), width - 1.0, wThickness);
      addWall(mx * (-width/2 + wThickness/2), 0, wThickness, depth - 1.0);
      addWall(mx * (width/2 - wThickness/2), 0, wThickness, depth - 1.0);

      // Inner divider walls
      if (depth > 12) {
        addWall(mx * 0.5, mz * 1.5, wThickness, 6.0);
        addWall(mx * -3.2, mz * 1.0, 5.5, wThickness);
        addWall(mx * -1.6, mz * -2.5, wThickness, 4.0);
        addWall(mx * 2.7, mz * -2.5, wThickness, 4.0);
        addWall(mx * -1.0, mz * 1.0, 2.0, wThickness);
        addWall(mx * 0.0, mz * 0.2, wThickness, 2.0);
        addWall(mx * 2.2, mz * -2.0, 2.0, wThickness);
        addWall(mx * 1.2, mz * -3.0, wThickness, 2.0);
      } else {
        addWall(mx * 0.5, mz * 1.0, wThickness, 5.5);
        addWall(mx * -3.2, mz * 0.6, 5.5, wThickness);
        addWall(mx * -1.6, mz * -2.5, wThickness, 3.5);
        addWall(mx * 2.7, mz * -2.5, wThickness, 3.5);
        addWall(mx * -1.0, mz * 0.6, 2.0, wThickness);
        addWall(mx * 0.0, mz * 0.1, wThickness, 1.8);
        addWall(mx * 2.2, mz * -2.1, 2.0, wThickness);
        addWall(mx * 1.2, mz * -3.0, wThickness, 1.8);
      }

      // Windows
      function addWindow(lx, lz, w, d) {
        const geo = new THREE.BoxGeometry(w, wHeight * 0.6, d);
        const mesh = new THREE.Mesh(geo, matGlassCurtain);
        mesh.position.set(lx, -floorHeight / 2 + wHeight * 0.5, lz);
        mesh.userData = { floorIndex: tier };
        unitGroup.add(mesh);
      }

      if (isFront) {
        addWindow(mx * -3.0, mz * (depth/2 - 0.05), 3.0, 0.08);
        addWindow(mx * 3.0, mz * (depth/2 - 0.05), 4.0, 0.08);
      } else {
        addWindow(mx * -3.0, mz * (-depth/2 + 0.05), 3.0, 0.08);
        addWindow(mx * 3.0, mz * (-depth/2 + 0.05), 4.0, 0.08);
      }

      // Open passage doors (realistic transitions)
      function addDoor(lx, lz, rotY, w = 0.95) {
        const doorGroup = new THREE.Group();
        const frameMat = matFurnitureWood;
        const leftPost = new THREE.Mesh(new THREE.BoxGeometry(0.08, wHeight, 0.08), frameMat);
        leftPost.position.set(-w/2, 0, 0);
        const rightPost = new THREE.Mesh(new THREE.BoxGeometry(0.08, wHeight, 0.08), frameMat);
        rightPost.position.set(w/2, 0, 0);
        const topBar = new THREE.Mesh(new THREE.BoxGeometry(w + 0.08, 0.08, 0.08), frameMat);
        topBar.position.set(0, wHeight/2 - 0.04, 0);
        doorGroup.add(leftPost, rightPost, topBar);

        const slab = new THREE.Mesh(new THREE.BoxGeometry(w - 0.04, wHeight - 0.08, 0.04), frameMat);
        slab.position.set((w - 0.04)/2, 0, 0);
        
        const pivotGroup = new THREE.Group();
        pivotGroup.position.set(-w/2 + 0.04, 0, 0);
        pivotGroup.add(slab);
        pivotGroup.rotation.y = -Math.PI / 3; 
        doorGroup.add(pivotGroup);

        doorGroup.position.set(lx, -floorHeight / 2 + wHeight / 2, lz);
        doorGroup.rotation.y = rotY;

        doorGroup.traverse(c => {
          if (c.isMesh) c.userData = { floorIndex: tier };
        });
        unitGroup.add(doorGroup);
      }

      if (depth > 12) {
        addDoor(mx * -1.8, mz * 1.0, 0);        
        addDoor(mx * -1.6, mz * -1.0, Math.PI/2); 
        addDoor(mx * 0.7, mz * -0.5, 0);        
        addDoor(mx * -1.0, mz * 1.0, 0, 0.75);   
        addDoor(mx * 2.2, mz * -2.0, 0, 0.75);   
        addDoor(mx * 2.7, mz * -1.5, Math.PI/2, 0.85); 
      } else {
        addDoor(mx * -1.8, mz * 0.6, 0);
        addDoor(mx * -1.6, mz * -1.0, Math.PI/2);
        addDoor(mx * 0.7, mz * -0.8, 0);
        addDoor(mx * -1.0, mz * 0.6, 0, 0.75);
        addDoor(mx * 2.2, mz * -2.1, 0, 0.75);
        addDoor(mx * 2.7, mz * -1.5, Math.PI/2, 0.85);
      }

      // Ceiling Spot Lights (glow cylinders)
      function addCeilingLight(lx, lz) {
        const geo = new THREE.CylinderGeometry(0.18, 0.18, 0.04, 8);
        const mesh = new THREE.Mesh(geo, matLightWarm);
        mesh.position.set(lx, floorHeight / 2 - 0.02, lz);
        mesh.userData = { floorIndex: tier };
        unitGroup.add(mesh);
      }
      
      addCeilingLight(mx * 2.0, mz * 5.0);
      addCeilingLight(mx * 5.0, mz * 5.0);
      addCeilingLight(mx * 3.3, mz * 1.5);
      addCeilingLight(mx * -3.5, mz * 3.0);
      addCeilingLight(mx * -3.5, mz * -2.5);

      // Potted Plants (Greenery)
      function addPottedPlant(lx, lz) {
        const plantGroup = new THREE.Group();
        const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.18, 0.5, 8), matPlantPot);
        pot.position.y = 0.25;
        pot.castShadow = true;
        plantGroup.add(pot);

        const leaf1 = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), matPlantLeaf);
        leaf1.position.set(0, 0.6, 0);
        const leaf2 = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8), matPlantLeaf);
        leaf2.position.set(0.1, 0.9, -0.05);
        const leaf3 = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), matPlantLeaf);
        leaf3.position.set(-0.08, 1.15, 0.08);
        plantGroup.add(leaf1, leaf2, leaf3);

        plantGroup.position.set(lx, -floorHeight / 2 + 0.01, lz);
        plantGroup.traverse(c => {
          if (c.isMesh) c.userData = { floorIndex: tier };
        });
        unitGroup.add(plantGroup);
      }

      addPottedPlant(mx * 5.5, mz * 5.5); 
      addPottedPlant(mx * -5.5, mz * 5.5); 

      // Split Air Conditioners (AC Units)
      function addACUnit(lx, lz, rotY) {
        const acGroup = new THREE.Group();
        const acBody = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.35, 0.25), matSanitary);
        acBody.position.y = 0.175;
        acGroup.add(acBody);

        const louver = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.03, 0.02), matFurnitureWood);
        louver.position.set(0, 0.05, 0.12);
        acGroup.add(louver);

        acGroup.position.set(lx, floorHeight / 2 - 0.5, lz);
        acGroup.rotation.y = rotY;
        acGroup.traverse(c => {
          if (c.isMesh) c.userData = { floorIndex: tier };
        });
        unitGroup.add(acGroup);
      }

      addACUnit(mx * -3.5, mz * 5.8, (mz === 1 ? 0 : Math.PI)); 
      addACUnit(mx * -5.8, mz * -2.5, (mx === 1 ? Math.PI/2 : -Math.PI/2)); 

      // Nightstands (Bedside cabinets)
      function addNightstand(lx, lz) {
        const stand = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), matFurnitureWood);
        stand.position.set(lx, -floorHeight / 2 + 0.25, lz);
        stand.castShadow = true;
        stand.userData = { floorIndex: tier };
        unitGroup.add(stand);
      }
      if (depth > 12) {
        addNightstand(mx * -5.0, mz * 5.0);
        addNightstand(mx * -2.0, mz * 5.0);
      } else {
        addNightstand(mx * -5.0, mz * 4.3);
        addNightstand(mx * -2.0, mz * 4.3);
      }

      // Beds
      function addBed(lx, lz, rotY, bedColor) {
        const bedGroup = new THREE.Group();
        const base = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.4, 2.2), matFurnitureWood);
        base.position.y = 0.2;
        bedGroup.add(base);

        const mattressMat = matFurnitureFabric.clone();
        mattressMat.color.setHex(0xffffff);
        const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.2, 2.1), mattressMat);
        mattress.position.y = 0.4;
        bedGroup.add(mattress);

        const blanketMat = matFurnitureFabric.clone();
        blanketMat.color.setHex(bedColor);
        const blanket = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.05, 1.4), blanketMat);
        blanket.position.set(0, 0.52, -0.3);
        bedGroup.add(blanket);

        const pillowMat = matFurnitureFabric.clone();
        pillowMat.color.setHex(0xf1f5f9);
        const pillow1 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.1, 0.45), pillowMat);
        pillow1.position.set(-0.45, 0.48, 0.8);
        const pillow2 = pillow1.clone();
        pillow2.position.x = 0.45;
        bedGroup.add(pillow1, pillow2);

        const headboard = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.9, 0.15), matFurnitureWood);
        headboard.position.set(0, 0.45, 1.05);
        bedGroup.add(headboard);

        bedGroup.position.set(lx, -floorHeight / 2 + 0.01, lz);
        bedGroup.rotation.y = rotY;

        bedGroup.traverse(c => {
          if (c.isMesh) c.userData = { floorIndex: tier };
        });
        unitGroup.add(bedGroup);
      }

      if (depth > 12) {
        addBed(mx * -3.5, mz * 4.5, (mz === 1 ? 0 : Math.PI), accentColor);
        addBed(mx * -4.2, mz * -3.0, (mz === 1 ? Math.PI / 2 : -Math.PI / 2), 0x475569);
        addBed(mx * 0.7, mz * -3.0, (mz === 1 ? Math.PI : 0), 0x334155);
      } else {
        addBed(mx * -3.5, mz * 3.8, (mz === 1 ? 0 : Math.PI), accentColor);
        addBed(mx * -4.2, mz * -3.0, (mz === 1 ? Math.PI / 2 : -Math.PI / 2), 0x475569);
        addBed(mx * 0.7, mz * -3.0, (mz === 1 ? Math.PI : 0), 0x334155);
      }

      // Sofa
      function addSofa(lx, lz, rotY) {
        const sofaGroup = new THREE.Group();
        const sofaMat = matFurnitureFabric.clone();
        sofaMat.color.setHex(0xe2e8f0);

        const seat = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.35, 0.85), sofaMat);
        seat.position.set(0, 0.2, 0);
        sofaGroup.add(seat);

        const section = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.35, 1.4), sofaMat);
        section.position.set(-1.075, 0.2, -0.65);
        sofaGroup.add(section);

        const back1 = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.55, 0.15), sofaMat);
        back1.position.set(0, 0.55, 0.425);
        sofaGroup.add(back1);

        const back2 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.55, 1.4), sofaMat);
        back2.position.set(-1.425, 0.55, -0.65);
        sofaGroup.add(back2);

        const table = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.45, 0.7), matFurnitureWood);
        table.position.set(0.2, 0.225, -0.6);
        sofaGroup.add(table);

        sofaGroup.position.set(lx, -floorHeight / 2 + 0.01, lz);
        sofaGroup.rotation.y = rotY;

        sofaGroup.traverse(c => {
          if (c.isMesh) c.userData = { floorIndex: tier };
        });
        unitGroup.add(sofaGroup);
      }

      if (depth > 12) {
        addSofa(mx * 3.3, mz * 4.0, (mx === 1 ? -Math.PI / 2 : Math.PI / 2));
      } else {
        addSofa(mx * 3.3, mz * 3.2, (mx === 1 ? -Math.PI / 2 : Math.PI / 2));
      }

      // Dining Table
      function addDiningSet(lx, lz) {
        const diningGroup = new THREE.Group();
        const table = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.06, 0.9), matFurnitureWood);
        table.position.y = 0.75;
        diningGroup.add(table);

        const legGeo = new THREE.BoxGeometry(0.08, 0.72, 0.08);
        const legLocations = [
          [-0.72, 0.36, -0.38],
          [0.72, 0.36, -0.38],
          [-0.72, 0.36, 0.38],
          [0.72, 0.36, 0.38]
        ];
        legLocations.forEach(pos => {
          const leg = new THREE.Mesh(legGeo, matFurnitureWood);
          leg.position.set(pos[0], pos[1], pos[2]);
          diningGroup.add(leg);
        });

        const chairGeo = new THREE.BoxGeometry(0.35, 0.4, 0.35);
        const backGeo = new THREE.BoxGeometry(0.35, 0.45, 0.05);
        const chairMat = matFurnitureFabric.clone();
        chairMat.color.setHex(0x334155);

        const chairLocations = [
          [-0.5, 0.2, 0.55, 0],
          [0.0, 0.2, 0.55, 0],
          [0.5, 0.2, 0.55, 0],
          [-0.5, 0.2, -0.55, Math.PI],
          [0.0, 0.2, -0.55, Math.PI],
          [0.5, 0.2, -0.55, Math.PI]
        ];

        chairLocations.forEach(pos => {
          const chair = new THREE.Group();
          const seat = new THREE.Mesh(chairGeo, chairMat);
          const back = new THREE.Mesh(backGeo, chairMat);
          back.position.set(0, 0.425, pos[3] === 0 ? 0.15 : -0.15);
          chair.add(seat, back);
          chair.position.set(pos[0], 0, pos[2]);
          chair.rotation.y = pos[3];
          diningGroup.add(chair);
        });

        diningGroup.position.set(lx, -floorHeight / 2 + 0.01, lz);
        diningGroup.traverse(c => {
          if (c.isMesh) c.userData = { floorIndex: tier };
        });
        unitGroup.add(diningGroup);
      }

      if (depth > 12) {
        addDiningSet(mx * 3.3, mz * -0.5);
      } else {
        addDiningSet(mx * 3.3, mz * -0.6);
      }

      // Bathroom fixtures (mirror, faucet, basin, shower glass screen)
      function addBathroomFixtures(lx, lz, isMaster) {
        const bathGroup = new THREE.Group();
        
        const glass = new THREE.Mesh(new THREE.BoxGeometry(0.04, wHeight, 1.2), matGlassCurtain);
        glass.position.set(-0.4, wHeight/2, 0.2);
        bathGroup.add(glass);

        const counter = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.75, 0.5), matFurnitureWood);
        counter.position.set(0.3, 0.375, -0.4);
        counter.castShadow = true;
        bathGroup.add(counter);

        const basin = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.15, 0.35), matSanitary);
        basin.position.set(0.3, 0.75 + 0.075, -0.4);
        bathGroup.add(basin);

        const faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.12, 6), matMetalChrome);
        faucet.position.set(0.3, 0.9, -0.52);
        bathGroup.add(faucet);

        const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.0, 0.02), matMetalChrome);
        mirror.position.set(0.3, 1.35, -0.63);
        bathGroup.add(mirror);

        bathGroup.position.set(lx, -floorHeight / 2 + 0.01, lz);
        if (!isMaster) bathGroup.rotation.y = Math.PI;

        bathGroup.traverse(c => {
          if (c.isMesh) c.userData = { floorIndex: tier };
        });
        unitGroup.add(bathGroup);
      }

      if (depth > 12) {
        addBathroomFixtures(mx * -1.0, mz * 0.2, true);
        addBathroomFixtures(mx * 2.2, mz * -3.0, false);
      } else {
        addBathroomFixtures(mx * -1.0, mz * 0.1, true);
        addBathroomFixtures(mx * 2.2, mz * -3.0, false);
      }

      // Kitchen Appliances (fridge, stove with burners)
      function addKitchenAppliances(lx, lz, rotY) {
        const kitGroup = new THREE.Group();

        const fridge = new THREE.Mesh(new THREE.BoxGeometry(0.75, 1.85, 0.75), matMetalChrome);
        fridge.position.set(-0.7, 0.925, 0.2);
        fridge.castShadow = true;
        kitGroup.add(fridge);

        const stove = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.03, 0.5), new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.1 }));
        stove.position.set(0.3, 0.85 + 0.015, -0.2);
        kitGroup.add(stove);

        for (let b = 0; b < 4; b++) {
          const burner = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.01, 8), matMetalChrome);
          burner.position.set(0.15 + (b % 2) * 0.3, 0.88, -0.3 + Math.floor(b / 2) * 0.2);
          kitGroup.add(burner);
        }

        kitGroup.position.set(lx, -floorHeight / 2 + 0.01, lz);
        kitGroup.rotation.y = rotY;
        kitGroup.traverse(c => {
          if (c.isMesh) c.userData = { floorIndex: tier };
        });
        unitGroup.add(kitGroup);
      }

      if (depth > 12) {
        addKitchenAppliances(mx * 4.4, mz * -3.0, (mx === 1 ? 0 : Math.PI));
      } else {
        addKitchenAppliances(mx * 4.4, mz * -3.0, (mx === 1 ? 0 : Math.PI));
      }

      // Toilets commodes
      function addToilet(lx, lz, rotY) {
        const tGroup = new THREE.Group();
        const bowl = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.6), matSanitary);
        bowl.position.set(0, 0.2, 0);
        const tank = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.2), matSanitary);
        tank.position.set(0, 0.45, 0.35);

        tGroup.add(bowl, tank);
        tGroup.position.set(lx, -floorHeight / 2 + 0.01, lz);
        tGroup.rotation.y = rotY;

        tGroup.traverse(c => {
          if (c.isMesh) c.userData = { floorIndex: tier };
        });
        unitGroup.add(tGroup);
      }

      if (depth > 12) {
        addToilet(mx * -1.0, mz * 0.8, (mz === 1 ? Math.PI : 0));
        addToilet(mx * 2.2, mz * -2.4, (mz === 1 ? Math.PI : 0));
      } else {
        addToilet(mx * -1.0, mz * 0.7, (mz === 1 ? Math.PI : 0));
        addToilet(mx * 2.2, mz * -2.4, (mz === 1 ? Math.PI : 0));
      }

      // Balcony outdoor furniture
      function addBalconyFurniture(lx, lz) {
        const furnGroup = new THREE.Group();
        const table = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.6, 8), matFurnitureWood);
        table.position.y = 0.3;
        table.castShadow = true;
        furnGroup.add(table);

        const chairGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.45, 8);
        const chair1 = new THREE.Mesh(chairGeo, matFurnitureFabric);
        chair1.position.set(-0.55, 0.225, 0);
        chair1.castShadow = true;

        const chair2 = chair1.clone();
        chair2.position.x = 0.55;

        furnGroup.add(chair1, chair2);
        furnGroup.position.set(lx, -floorHeight / 2 + 0.01, lz);
        furnGroup.traverse(c => {
          if (c.isMesh) c.userData = { floorIndex: tier };
        });
        unitGroup.add(furnGroup);
      }

      if (isFront) {
        addBalconyFurniture(mx * -5.0, mz * 6.0);
      } else {
        addBalconyFurniture(mx * -5.0, mz * -5.0);
      }

      return unitGroup;
    }

    for (let tier = 0; tier < totalStoreys; tier++) {
      const currentY = tier * floorHeight;

      // Structural Column Tapering logic
      let colWidth = 1.3;
      let colDepth = 0.9;
      if (tier >= 4 && tier <= 6) { colWidth = 1.0; colDepth = 0.7; }
      else if (tier >= 7) { colWidth = 0.8; colDepth = 0.5; }

      columnBaseGrid.forEach((coord, idx) => {
        const colGeo = new THREE.BoxGeometry(colWidth, floorHeight - 0.02, colDepth);
        const colMesh = new THREE.Mesh(colGeo, matColumns);
        colMesh.position.set(coord[0], currentY + floorHeight / 2, coord[1]);
        colMesh.castShadow = true;
        colMesh.receiveShadow = true;
        colMesh.userData = { floorIndex: tier };
        columnsGroup.add(colMesh);

        // Label pillar size dynamically on a few columns in step 2
        if (idx === 7 && (tier === 1 || tier === 5 || tier === 8)) {
          let labelStr = "Pillar: " + colWidth + "m x " + colDepth + "m";
          const colLabel = createTextSprite(labelStr, "#cbd5e1", "rgba(15, 23, 42, 0.85)");
          colLabel.position.set(coord[0], currentY + floorHeight, coord[1] + 1.2);
          colLabel.scale.set(6, 1.6, 1);
          colLabel.userData = { floorIndex: tier };
          columnsGroup.add(colLabel);
        }
      });

      // G-Floor elements
      if (tier === 0) {
        const foyerGeo = new THREE.BoxGeometry(16, floorHeight, 18);
        const foyerMesh = new THREE.Mesh(foyerGeo, matGlassCurtain);
        foyerMesh.position.set(0, currentY + floorHeight / 2, 0);
        foyerMesh.userData = { floorIndex: tier };
        columnsGroup.add(foyerMesh);

        const mechWingGeo = new THREE.BoxGeometry(32, floorHeight, 6);
        const mechWing = new THREE.Mesh(mechWingGeo, matLouvers);
        mechWing.position.set(0, currentY + floorHeight / 2, -13);
        mechWing.userData = { floorIndex: tier };
        columnsGroup.add(mechWing);
      } else {
        // Elevator & Core Shaft blocks (Circulation Core)
        const coreBoxGeo = new THREE.BoxGeometry(7, floorHeight - 0.02, 10);
        const coreBoxMesh = new THREE.Mesh(coreBoxGeo, matCoreArea);
        coreBoxMesh.position.set(0, currentY + floorHeight / 2, 0);
        coreBoxMesh.castShadow = true;
        coreBoxMesh.userData = { floorIndex: tier };
        coreGroup.add(coreBoxMesh);

        // Unit A & B (SW/SE facing - Amber style)
        const unitAGroup = createDetailedUnit(12.5, 13, true, true, tier);
        unitAGroup.position.set(-10.2, currentY + floorHeight / 2, 9.5);
        flatsGroup.add(unitAGroup);

        const unitBGroup = createDetailedUnit(12.5, 13, false, true, tier);
        unitBGroup.position.set(10.2, currentY + floorHeight / 2, 9.5);
        flatsGroup.add(unitBGroup);

        // balconies & louvers representation
        const frontRailGeo = new THREE.BoxGeometry(32.8, floorHeight - 0.8, 0.1);
        const frontRail = new THREE.Mesh(frontRailGeo, matGlassCurtain);
        frontRail.position.set(0, currentY + floorHeight / 2, 15.5);
        frontRail.userData = { floorIndex: tier };
        flatsGroup.add(frontRail);

        // Unit C & D (NW/NE facing - Orchid style)
        const unitCGroup = createDetailedUnit(12.5, 11, true, false, tier);
        unitCGroup.position.set(-10.2, currentY + floorHeight / 2, -10.5);
        flatsGroup.add(unitCGroup);

        const unitDGroup = createDetailedUnit(12.5, 11, false, false, tier);
        unitDGroup.position.set(10.2, currentY + floorHeight / 2, -10.5);
        flatsGroup.add(unitDGroup);

        // Aesthetic Louvers
        const slatGeo = new THREE.BoxGeometry(0.1, floorHeight - 0.1, 5);
        const lLeft = new THREE.Mesh(slatGeo, matLouvers);
        lLeft.position.set(-16.6, currentY + floorHeight / 2, 0);
        lLeft.userData = { floorIndex: tier };
        const lRight = lLeft.clone();
        lRight.position.x = 16.6;
        lRight.userData = { floorIndex: tier };
        flatsGroup.add(lLeft, lRight);
      }

      // 4-Layers Color-coded vertical tiers of floor slabs
      let slabMat = matSlabExecutive;
      if (tier === 0) slabMat = matSlabGround;
      else if (tier >= 1 && tier <= 3) slabMat = matSlabExecutive;
      else if (tier >= 4 && tier <= 7) slabMat = matSlabPanoramic;
      else if (tier >= 8) slabMat = matSlabPenthouse;

      const floorSlabGeo = new THREE.BoxGeometry(33.8, 0.12, 31.8);
      const slabMesh = new THREE.Mesh(floorSlabGeo, slabMat);
      slabMesh.position.set(0, currentY + floorHeight, 0);
      slabMesh.receiveShadow = true;
      slabMesh.userData = { floorIndex: tier };
      completeBuildingGroup.add(slabMesh);
    }

    // Active flowing lift simulation inside Core Group
    const elevatorCabMat = new THREE.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.8 });
    const elevatorCabGeo = new THREE.BoxGeometry(2.5, 2.5, 2.5);
    
    const elevatorCab1 = new THREE.Mesh(elevatorCabGeo, elevatorCabMat);
    elevatorCab1.position.set(-1.8, 4, 2);
    coreGroup.add(elevatorCab1);

    const elevatorCab2 = new THREE.Mesh(elevatorCabGeo, elevatorCabMat);
    elevatorCab2.position.set(1.8, 16, 2);
    coreGroup.add(elevatorCab2);

    // Anchored Sprites for elevators core
    const coreMetricsSprite = createTextSprite("CIRCULATION CORE: DUAL EXPRESS TRACTION LIFT", "#2563eb");
    coreMetricsSprite.position.set(0, 36, 6);
    coreGroup.add(coreMetricsSprite);

    // Dimensions lines inside Central core
    const liftCoreArrow = createDimensionLine(new THREE.Vector3(-3.5, 33, 5), new THREE.Vector3(3.5, 33, 5), 0x2563eb);
    coreGroup.add(liftCoreArrow);

    // Tapering Columns grid description labels
    const taperingLabel = createTextSprite("BNBC CODES: COLUMN MATRIX TAPERING (1.3m to 0.8m)", "#38bdf8");
    taperingLabel.position.set(0, 35, -16);
    columnsGroup.add(taperingLabel);


    // 4. Typical Floor Splits and specifications
    const splitTagA = createTextSprite("UNIT A (SW): 920 SQ FT | 3 BEDROOMS", "#d4af37");
    splitTagA.position.set(-16, 22, 17);
    flatsGroup.add(splitTagA);

    const splitTagB = createTextSprite("UNIT B (SE): 920 SQ FT | 3 BEDROOMS", "#d4af37");
    splitTagB.position.set(16, 22, 17);
    flatsGroup.add(splitTagB);

    const splitTagC = createTextSprite("UNIT C (NW): 880 SQ FT | 3 BEDROOMS", "#a855f7");
    splitTagC.position.set(-16, 22, -17);
    flatsGroup.add(splitTagC);

    const splitTagD = createTextSprite("UNIT D (NE): 880 SQ FT | 3 BEDROOMS", "#a855f7");
    splitTagD.position.set(16, 22, -17);
    flatsGroup.add(splitTagD);

    // 5. G-Floor Parking specifications & car lots representation
    const parkingBaseGroup = new THREE.Group();
    parkingBaseGroup.userData = { floorIndex: 0 };
    columnsGroup.add(parkingBaseGroup);

    // High fidelity 3D Low-Poly Luxury Car Custom Mesh Generator
    function createCarMesh(colorHex) {
      const carGroup = new THREE.Group();
      
      // Chassis
      const chassisMat = new THREE.MeshStandardMaterial({ 
        color: colorHex, 
        roughness: 0.25, 
        metalness: 0.8 
      });
      const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.45, 2.7), chassisMat);
      chassis.position.y = 0.35;
      chassis.castShadow = true;
      chassis.receiveShadow = true;
      carGroup.add(chassis);
      
      // Glass Cabin
      const cabMat = new THREE.MeshStandardMaterial({ 
        color: 0x090d16, 
        roughness: 0.1, 
        metalness: 0.9, 
        transparent: true, 
        opacity: 0.8 
      });
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.4, 1.55), cabMat);
      cabin.position.set(0, 0.65, -0.15);
      cabin.castShadow = true;
      carGroup.add(cabin);
      
      // Dark Wheels
      const tireMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.95 });
      const wheelGeo = new THREE.BoxGeometry(0.3, 0.45, 0.45);
      [
        [-0.72, 0.22, 0.75],  // FL
        [0.72, 0.22, 0.75],   // FR
        [-0.72, 0.22, -0.75], // RL
        [0.72, 0.22, -0.75]   // RR
      ].forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeo, tireMat);
        wheel.position.set(pos[0], pos[1], pos[2]);
        wheel.castShadow = true;
        carGroup.add(wheel);
      });
      
      return carGroup;
    }

    // Creating 10 distinct parking bays drawn onto the ground
    const bayMat = new THREE.LineBasicMaterial({ color: 0xd4af37, linewidth: 2 });
    for (let p = 0; p < 10; p++) {
      const posX = -15 + (p * 3.3);
      const points = [
        new THREE.Vector3(posX, 0.05, -8),
        new THREE.Vector3(posX + 2.5, 0.05, -8),
        new THREE.Vector3(posX + 2.5, 0.05, -3),
        new THREE.Vector3(posX, 0.05, -3),
        new THREE.Vector3(posX, 0.05, -8)
      ];
      const bayGeo = new THREE.BufferGeometry().setFromPoints(points);
      const bayLine = new THREE.Line(bayGeo, bayMat);
      bayLine.userData = { floorIndex: 0 };
      parkingBaseGroup.add(bayLine);

      // Park realistic miniature luxury cars in certain bays (lived-in community feel)
      if (p === 1 || p === 3 || p === 6 || p === 8) {
        const carPalette = [0xd4af37, 0x1e293b, 0x475569, 0xb91c1c]; // Luxury Gold, Navy Blue, Silver Gray, Cherry Red
        const car = createCarMesh(carPalette[(p - 1) % 4]);
        car.position.set(posX + 1.25, 0.05, -5.5);
        car.userData = { floorIndex: 0 };
        parkingBaseGroup.add(car);
      }

      // Small numbering sprite
      const bayIdxSprite = createTextSprite("P" + (p + 1), "#ffffff", "rgba(5, 5, 5, 0.9)");
      bayIdxSprite.position.set(posX + 1.25, 0.1, -5.5);
      bayIdxSprite.scale.set(1.5, 0.5, 1);
      bayIdxSprite.userData = { floorIndex: 0 };
      parkingBaseGroup.add(bayIdxSprite);
    }

    const pBayLabel = createTextSprite("10 CAR PARKING BAYS (5.0m x 2.5m STANDARD)", "#d4af37");
    pBayLabel.position.set(0, 1.5, -9);
    pBayLabel.userData = { floorIndex: 0 };
    parkingBaseGroup.add(pBayLabel);


    // 6. Rooftop Sanctuary Elements
    const roofLevelY = totalStoreys * floorHeight;
    
    const oasisTurfGeo = new THREE.BoxGeometry(33.2, 0.1, 31.2);
    const oasisTurf = new THREE.Mesh(oasisTurfGeo, matOasisTurf);
    oasisTurf.position.set(0, roofLevelY + 0.05, 0);
    oasisTurf.userData = { floorIndex: 10 };
    roofGroup.add(oasisTurf);

    // Shimmering Rooftop Infinity Splash Pool
    const poolWaterGeo = new THREE.BoxGeometry(10, 0.1, 7.5);
    const poolWaterMat = new THREE.MeshStandardMaterial({ 
      color: 0x0ea5e9, 
      roughness: 0.05, 
      metalness: 0.85, 
      emissive: 0x0ea5e9, 
      emissiveIntensity: 0.3 
    });
    const poolWater = new THREE.Mesh(poolWaterGeo, poolWaterMat);
    poolWater.position.set(-9.5, roofLevelY + 0.12, 5.5);
    poolWater.userData = { floorIndex: 10 };
    roofGroup.add(poolWater);
    
    // Pool stone border
    const poolBorderGeo = new THREE.BoxGeometry(10.8, 0.18, 8.3);
    const poolBorderMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.85 });
    const poolBorder = new THREE.Mesh(poolBorderGeo, poolBorderMat);
    poolBorder.position.set(-9.5, roofLevelY + 0.09, 5.5);
    poolBorder.userData = { floorIndex: 10 };
    roofGroup.add(poolBorder);
    
    const poolLabel = createTextSprite("ROOFTOP POOL & INFINITY DECK", "#38bdf8", "rgba(8, 11, 22, 0.9)");
    poolLabel.position.set(-9.5, roofLevelY + 2.0, 5.5);
    poolLabel.scale.set(6, 1.4, 1);
    poolLabel.userData = { floorIndex: 10 };
    roofGroup.add(poolLabel);

    // Beautiful pergola structure with beams
    const pergolaStructuralGeo = new THREE.BoxGeometry(12, 2.8, 14);
    const pergolaMesh = new THREE.Mesh(pergolaStructuralGeo, matLouvers);
    pergolaMesh.position.set(0, roofLevelY + 1.4, 0);
    pergolaMesh.castShadow = true;
    pergolaMesh.userData = { floorIndex: 10 };
    roofGroup.add(pergolaMesh);

    // Glass Balustrades
    const safetyGlassGeo = new THREE.BoxGeometry(33, 1.2, 31);
    const safetyGlass = new THREE.Mesh(safetyGlassGeo, matGlassCurtain);
    safetyGlass.position.set(0, roofLevelY + 0.6, 0);
    safetyGlass.userData = { floorIndex: 10 };
    roofGroup.add(safetyGlass);

    // Solar panels representations (Active sustainable energy grid)
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x1e1e38, roughness: 0.1, metalness: 0.9 });
    const panelGeo = new THREE.BoxGeometry(4, 0.1, 2.5);
    for (let s = 0; s < 4; s++) {
      const panel = new THREE.Mesh(panelGeo, panelMat);
      panel.position.set(-10 + (s * 6.5), roofLevelY + 0.2, -10);
      panel.rotation.x = -0.3; // Tilt solar panels
      panel.userData = { floorIndex: 10 };
      roofGroup.add(panel);
    }

    const roofSustainSprite = createTextSprite("15KW INTEGRATED SOLAR ARRAY - COMPLIANCE", "#10b981");
    roofSustainSprite.position.set(0, roofLevelY + 3.5, -10);
    roofSustainSprite.userData = { floorIndex: 10 };
    roofGroup.add(roofSustainSprite);

    const roofOasisSprite = createTextSprite("COMMUNITY ROOFTOP GARDEN OASIS", "#34d399");
    roofOasisSprite.position.set(0, roofLevelY + 4, 3);
    roofOasisSprite.userData = { floorIndex: 10 };
    roofGroup.add(roofOasisSprite);


    // Compose total hierarchical groups
    completeBuildingGroup.add(structuralBaseGroup);
    completeBuildingGroup.add(columnsGroup);
    completeBuildingGroup.add(coreGroup);
    completeBuildingGroup.add(flatsGroup);
    completeBuildingGroup.add(roofGroup);
    scene.add(completeBuildingGroup);

    // Dynamic Measurement Tool & Overlay Support
    const measurementGroup = new THREE.Group();
    scene.add(measurementGroup);

    const isolationLightsGroup = new THREE.Group();
    scene.add(isolationLightsGroup);

    let isMeasuring = false;
    let measurePoint1 = null;
    let measurePoint2 = null;

    window.toggleMeasurementMode = function() {
      isMeasuring = !isMeasuring;
      const btn = document.getElementById('btn-measure');
      const hud = document.getElementById('measure-hud');
      const hudText = document.getElementById('measure-hud-text');
      const clearBtn = document.getElementById('btn-measure-clear');
      
      if (isMeasuring) {
        btn.classList.add('active');
        btn.innerHTML = 'Cancel Measurement';
        hud.style.display = 'flex';
        hudText.textContent = 'MEASUREMENT ACTIVE: CLICK FIRST POINT ON THE STRUCTURE';
        clearBtn.style.display = 'block';
        renderer.domElement.style.cursor = 'crosshair';
        
        measurePoint1 = null;
        measurePoint2 = null;
      } else {
        btn.classList.remove('active');
        btn.innerHTML = 'Measure Distance';
        hud.style.display = 'none';
        renderer.domElement.style.cursor = 'auto';
      }
    };

    window.clearMeasurements = function() {
      while (measurementGroup.children.length > 0) {
        measurementGroup.remove(measurementGroup.children[0]);
      }
      measurePoint1 = null;
      measurePoint2 = null;
      const clearBtn = document.getElementById('btn-measure-clear');
      if (clearBtn) clearBtn.style.display = 'none';
      const hud = document.getElementById('measure-hud');
      if (hud) hud.style.display = 'none';
    };

    window.addEventListener('pointerdown', function(event) {
      if (!isMeasuring) return;
      
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      
      // We intersect with all children within the tower and ground base
      const intersects = raycaster.intersectObjects(completeBuildingGroup.children, true);
      
      if (intersects.length > 0) {
        const hitPoint = intersects[0].point;
        const hudText = document.getElementById('measure-hud-text');
        
        if (!measurePoint1) {
          measurePoint1 = hitPoint.clone();
          
          // Add a green glowing point indicator mesh
          const markerGeo = new THREE.SphereGeometry(0.35, 12, 12);
          const markerMat = new THREE.MeshBasicMaterial({ color: 0x10b981, depthTest: false });
          const markerMesh = new THREE.Mesh(markerGeo, markerMat);
          markerMesh.position.copy(measurePoint1);
          markerMesh.renderOrder = 9999;
          measurementGroup.add(markerMesh);
          
          if (hudText) {
            hudText.textContent = 'POINT [1] PLACED. SELECT THE SECOND PILLAR/WALL POINT...';
          }
        } else if (!measurePoint2) {
          measurePoint2 = hitPoint.clone();
          
          // Add second point indicator
          const markerGeo = new THREE.SphereGeometry(0.35, 12, 12);
          const markerMat = new THREE.MeshBasicMaterial({ color: 0x10b981, depthTest: false });
          const markerMesh = new THREE.Mesh(markerGeo, markerMat);
          markerMesh.position.copy(measurePoint2);
          markerMesh.renderOrder = 9999;
          measurementGroup.add(markerMesh);
          
          // Calculate and draw the line in WebGL space
          const distVal = measurePoint1.distanceTo(measurePoint2);
          const feetVal = distVal * 3.28084;
          
          const arrowLine = createDimensionLine(measurePoint1, measurePoint2, 0x10b981);
          measurementGroup.add(arrowLine);
          
          // Place high contrast text sprite at the midpoint
          const labelStr = distVal.toFixed(2) + "m (" + feetVal.toFixed(1) + " ft)";
          const labelSpr = createTextSprite(labelStr, "#10b981", "rgba(5, 7, 15, 0.95)");
          
          const midPt = new THREE.Vector3().addVectors(measurePoint1, measurePoint2).multiplyScalar(0.5);
          midPt.y += 1.2; // raise label slightly for clarity
          labelSpr.position.copy(midPt);
          labelSpr.scale.set(6, 1.6, 1);
          measurementGroup.add(labelSpr);
          
          if (hudText) {
            hudText.textContent = 'DIMENSION LOADED: ' + labelStr;
          }
          
          // Auto disable measurement state once result is drawn
          isMeasuring = false;
          const btn = document.getElementById('btn-measure');
          if (btn) {
            btn.classList.remove('active');
            btn.innerHTML = 'Measure Distance';
          }
          renderer.domElement.style.cursor = 'auto';
          
          setTimeout(() => {
            if (!isMeasuring) {
              const hud = document.getElementById('measure-hud');
              if (hud) hud.style.display = 'none';
            }
          }, 4500);
        }
      }
    });

    let lastHoveredSection = null;

    window.addEventListener('pointermove', function(event) {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      
      const intersects = raycaster.intersectObjects(completeBuildingGroup.children, true);
      
      let foundRoom = null;
      let hoveredMesh = null;

      if (intersects.length > 0) {
        let current = intersects[0].object;
        while (current && current !== scene) {
          if (current.userData && current.userData.roomName) {
            foundRoom = {
              name: current.userData.roomName,
              nameBn: current.userData.roomNameBn || current.userData.roomName,
              sizeSqFt: current.userData.sizeSqFt || 150
            };
            if (current.isMesh) {
              hoveredMesh = current;
            }
            break;
          }
          current = current.parent;
        }
      }

      // Reset old hover emission
      if (lastHoveredSection && lastHoveredSection !== hoveredMesh) {
        if (lastHoveredSection.userData.originalMaterial) {
          lastHoveredSection.material = lastHoveredSection.userData.originalMaterial;
        }
        lastHoveredSection = null;
      }

      // Apply new hover emission
      if (hoveredMesh && hoveredMesh.material) {
        if (!hoveredMesh.userData.originalMaterial) {
          hoveredMesh.userData.originalMaterial = hoveredMesh.material;
        }
        const clonedMat = hoveredMesh.material.clone();
        if (clonedMat.emissive) {
          clonedMat.emissive.setHex(0x2d240c); 
        }
        hoveredMesh.material = clonedMat;
        lastHoveredSection = hoveredMesh;
      }

      // Post to parent React window with coordinates relative to the iframe bounds
      window.parent.postMessage({ 
        type: 'hover-room', 
        room: foundRoom,
        clientX: event.clientX,
        clientY: event.clientY
      }, '*');
    });

    // Level-specific filter drill downs
    // Level-specific filter drill downs
    window.filterFloor = function(floorOption) {
      autoRotateActive = false; // Disable auto rotation during isolation inspects
      
      completeBuildingGroup.traverse((child) => {
        if (child.isMesh || child.isLine || child.isSprite) {
          if (child === ground || child === plotGrid || structuralBaseGroup.children.includes(child)) {
            return;
          }
          if (child.userData && child.userData.floorIndex !== undefined) {
            const fIdx = child.userData.floorIndex;
            let visible = false;
            if (floorOption === 'all') {
              visible = true;
            } else if (floorOption === 'ground' && fIdx === 0) {
              visible = true;
            } else if (floorOption === 'executive' && fIdx >= 1 && fIdx <= 3) {
              visible = true;
            } else if (floorOption === 'panoramic' && fIdx >= 4 && fIdx <= 7) {
              visible = true;
            } else if (floorOption === 'penthouse' && fIdx >= 8 && fIdx <= 9) {
              visible = true;
            } else if (floorOption === 'rooftop' && fIdx === 10) {
              visible = true;
            }
            child.visible = visible;
          }
        }
      });

      // Clear old isolation lights
      while (isolationLightsGroup.children.length > 0) {
        const child = isolationLightsGroup.children[0];
        if (child.shadow && child.shadow.map) {
          child.shadow.map.dispose();
        }
        isolationLightsGroup.remove(child);
      }

      if (floorOption !== 'all' && floorOption !== 'ground') {
        let floorsToLight = [];
        if (floorOption === 'executive') floorsToLight = [2];
        else if (floorOption === 'panoramic') floorsToLight = [5];
        else if (floorOption === 'penthouse') floorsToLight = [9];
        else if (floorOption === 'rooftop') floorsToLight = [10];

        floorsToLight.forEach(f => {
          const floorY = f * floorHeight;
          
          if (f === 10) {
            const rtLight = new THREE.PointLight(0xffb74d, 1.5, 20);
            rtLight.position.set(0, floorY + 3.0, 0);
            rtLight.castShadow = true;
            rtLight.shadow.bias = -0.001;
            isolationLightsGroup.add(rtLight);
          } else {
            const lightA = new THREE.PointLight(0xffb74d, 1.2, 18);
            lightA.position.set(-6.9, floorY + floorHeight - 0.5, 13.5);
            lightA.castShadow = true;
            lightA.shadow.bias = -0.002;
            lightA.shadow.mapSize.width = 512;
            lightA.shadow.mapSize.height = 512;

            const lightB = lightA.clone();
            lightB.position.x = 6.9;

            const lightC = new THREE.PointLight(0xffb74d, 1.2, 18);
            lightC.position.set(-6.9, floorY + floorHeight - 0.5, -13.7);
            lightC.castShadow = true;
            lightC.shadow.bias = -0.002;
            lightC.shadow.mapSize.width = 512;
            lightC.shadow.mapSize.height = 512;

            const lightD = lightC.clone();
            lightD.position.x = 6.9;

            isolationLightsGroup.add(lightA, lightB, lightC, lightD);
          }
        });
      }

      // Recalibrate focus camera targets
      if (floorOption === 'ground') {
        smoothCameraTransition(36, 12, 32, 0, 2, 0);
      } else if (floorOption === 'executive') {
        smoothCameraTransition(40, 22, 40, 0, 6, 0);
      } else if (floorOption === 'panoramic') {
        smoothCameraTransition(42, 32, 42, 0, 18, 0);
      } else if (floorOption === 'penthouse') {
        smoothCameraTransition(45, 42, 38, 0, 28, 0);
      } else if (floorOption === 'rooftop') {
        smoothCameraTransition(0, 52, 46, 0, 32, 0);
      } else {
        smoothCameraTransition(55, 50, 75, 0, 16, 0);
      }
    };

    // Environments solar paths simulations
    window.simulateLighting = function(lightMode) {
      const buttons = document.querySelectorAll('.grid-btn');
      buttons.forEach(btn => btn.classList.remove('active'));
      const activeBtn = document.getElementById('light-' + lightMode);
      if (activeBtn) activeBtn.classList.add('active');

      if (lightMode === 'noon') {
        ambientLight.color.setHex(0xffffff);
        ambientLight.intensity = 0.65;
        
        sunLight.color.setHex(0xfffdf4);
        sunLight.intensity = 1.35;
        sunLight.position.set(45, 90, 35);
        
        rimSkyLight.color.setHex(0x38bdf8);
        rimSkyLight.intensity = 0.5;
        scene.background.setHex(0x05070f);
        if (scene.fog) scene.fog.color.setHex(0x05070f);
      } 
      else if (lightMode === 'morning') {
        ambientLight.color.setHex(0xb3e5fc);
        ambientLight.intensity = 0.55;
        
        sunLight.color.setHex(0xffaa66); // warm sunset/sunrise orange
        sunLight.intensity = 1.5;
        sunLight.position.set(-60, 25, 10);
        
        rimSkyLight.color.setHex(0xe0f2fe);
        rimSkyLight.intensity = 0.4;
        scene.background.setHex(0x0a0c16);
        if (scene.fog) scene.fog.color.setHex(0x0a0c16);
      } 
      else if (lightMode === 'dusk') {
        ambientLight.color.setHex(0x4c1d95); // Deep purple dusk sky
        ambientLight.intensity = 0.60;
        
        sunLight.color.setHex(0xf59e0b); // golden dusk beam
        sunLight.intensity = 1.1;
        sunLight.position.set(65, 12, -25);
        
        rimSkyLight.color.setHex(0xec4899);
        rimSkyLight.intensity = 0.6;
        scene.background.setHex(0x0a050e);
        if (scene.fog) scene.fog.color.setHex(0x0a050e);
      } 
      else if (lightMode === 'midnight') {
        ambientLight.color.setHex(0x1e1b4b);
        ambientLight.intensity = 0.40;
        
        sunLight.color.setHex(0x38bdf8); // Pale moonlight
        sunLight.intensity = 0.35;
        sunLight.position.set(-20, 50, -40);
        
        rimSkyLight.color.setHex(0x4f46e5);
        rimSkyLight.intensity = 0.5;
        scene.background.setHex(0x020308);
        if (scene.fog) scene.fog.color.setHex(0x020308);
      }
    };

    window.setRenderMode = function(mode) {
      const buttons = document.querySelectorAll('[id^="render-"]');
      buttons.forEach(btn => btn.classList.remove('active'));
      const activeBtn = document.getElementById('render-' + mode);
      if (activeBtn) activeBtn.classList.add('active');

      if (mode === 'blueprints') {
        matFrontFlats.wireframe = true;
        matRearFlats.wireframe = true;
        matFrontFlats.opacity = 0.18;
        matFrontFlats.color.setHex(0x00ffcc);
        matRearFlats.opacity = 0.18;
        matRearFlats.color.setHex(0xbc13fe);
        
        matSlabGround.wireframe = true;
        matSlabExecutive.wireframe = true;
        matSlabPanoramic.wireframe = true;
        matSlabPenthouse.wireframe = true;
        matSlabGround.opacity = 0.15;
        matSlabExecutive.opacity = 0.15;
        matSlabPanoramic.opacity = 0.15;
        matSlabPenthouse.opacity = 0.15;
        
        matColumns.color.setHex(0x38bdf8);
        matColumns.opacity = 0.9;
        matCoreArea.color.setHex(0xf43f5e);
        matCoreArea.opacity = 0.9;
        
        matLouvers.wireframe = true;
        matLouvers.opacity = 0.2;
        matGlassCurtain.opacity = 0.1;

        // Custom realistic materials for blueprint wireframe mode
        matWall.wireframe = true;
        matWall.opacity = 0.18;
        matWall.color.setHex(0x00ffcc);
        matFloorWood.wireframe = true;
        matFloorWood.opacity = 0.1;
        matFloorTile.wireframe = true;
        matFloorTile.opacity = 0.1;
        matFloorBath.wireframe = true;
        matFloorBath.opacity = 0.1;
        matFurnitureWood.wireframe = true;
        matFurnitureWood.opacity = 0.15;
        matFurnitureFabric.wireframe = true;
        matFurnitureFabric.opacity = 0.15;
        matSanitary.wireframe = true;
        matSanitary.opacity = 0.1;
      } else {
        matFrontFlats.wireframe = false;
        matRearFlats.wireframe = false;
        matFrontFlats.opacity = 0.75;
        matFrontFlats.color.setHex(0xb58e2d);
        matRearFlats.opacity = 0.75;
        matRearFlats.color.setHex(0x7c3aed);
        
        matSlabGround.wireframe = false;
        matSlabExecutive.wireframe = false;
        matSlabPanoramic.wireframe = false;
        matSlabPenthouse.wireframe = false;
        matSlabGround.opacity = 1.0;
        matSlabExecutive.opacity = 1.0;
        matSlabPanoramic.opacity = 1.0;
        matSlabPenthouse.opacity = 1.0;
        
        matColumns.color.setHex(0x475569);
        matColumns.opacity = 1.0;
        matCoreArea.color.setHex(0x2563eb);
        matCoreArea.opacity = 1.0;
        
        matLouvers.wireframe = false;
        matLouvers.opacity = 1.0;
        matGlassCurtain.opacity = 0.45;

        // Custom realistic materials for solid mode
        matWall.wireframe = false;
        matWall.opacity = 0.95;
        matWall.color.setHex(0xf8fafc);
        matFloorWood.wireframe = false;
        matFloorWood.opacity = 1.0;
        matFloorTile.wireframe = false;
        matFloorTile.opacity = 1.0;
        matFloorBath.wireframe = false;
        matFloorBath.opacity = 1.0;
        matFurnitureWood.wireframe = false;
        matFurnitureWood.opacity = 1.0;
        matFurnitureFabric.wireframe = false;
        matFurnitureFabric.opacity = 1.0;
        matSanitary.wireframe = false;
        matSanitary.opacity = 1.0;

        // Custom new materials for solid mode
        matMetalChrome.wireframe = false;
        matMetalChrome.opacity = 1.0;
        matPlantLeaf.wireframe = false;
        matPlantLeaf.opacity = 1.0;
        matPlantPot.wireframe = false;
        matPlantPot.opacity = 1.0;
      }
    };

    let autoRotateActive = true;

    // Animation loop of lifts
    let liftTime = 0;

    window.focusStage = function(stageId, element) {
      const buttons = document.querySelectorAll('.step-btn');
      buttons.forEach(btn => btn.classList.remove('active'));
      if(element) {
        element.classList.add('active');
      } else {
        const activeBtn = document.getElementById('btn-' + stageId);
        if (activeBtn) activeBtn.classList.add('active');
      }

      autoRotateActive = false;

      // Notify React parent system cleanly
      window.parent.postMessage({ type: '3d-step', step: stageId }, '*');

      // Keep all architectural groups visible for fully interconnected representation 
      structuralBaseGroup.visible = true;
      columnsGroup.visible = true;
      coreGroup.visible = true;
      flatsGroup.visible = true;
      roofGroup.visible = true;

      // Reset all opacities first to fully solid
      matColumns.opacity = 1.0;
      matCoreArea.opacity = 1.0;
      matFrontFlats.opacity = 0.75;
      matRearFlats.opacity = 0.75;
      matLouvers.opacity = 1.0;
      matGlassCurtain.opacity = 0.45;
      matOasisTurf.opacity = 1.0;
      matSlabGround.opacity = 1.0;
      matSlabExecutive.opacity = 1.0;
      matSlabPanoramic.opacity = 1.0;
      matSlabPenthouse.opacity = 1.0;

      switch(stageId) {
        case 'step1': // Plot setbacks - Dim all upper residential systems to ghost layers
          matColumns.opacity = 0.05;
          matCoreArea.opacity = 0.05;
          matFrontFlats.opacity = 0.02;
          matRearFlats.opacity = 0.02;
          matLouvers.opacity = 0.05;
          matGlassCurtain.opacity = 0.03;
          matOasisTurf.opacity = 0.05;
          matSlabGround.opacity = 0.4;
          matSlabExecutive.opacity = 0.02;
          matSlabPanoramic.opacity = 0.02;
          matSlabPenthouse.opacity = 0.02;
          smoothCameraTransition(0, 32, 65, 0, 8, 0);
          break;
        case 'step2': // Column matrix - Set columns to full strength, others to faint dust outlines
          matColumns.opacity = 1.0;
          matCoreArea.opacity = 0.1;
          matFrontFlats.opacity = 0.02;
          matRearFlats.opacity = 0.02;
          matLouvers.opacity = 0.1;
          matGlassCurtain.opacity = 0.03;
          matOasisTurf.opacity = 0.05;
          matSlabGround.opacity = 0.1;
          matSlabExecutive.opacity = 0.1;
          matSlabPanoramic.opacity = 0.1;
          matSlabPenthouse.opacity = 0.1;
          smoothCameraTransition(-35, 18, 45, 0, 16, 0);
          break;
        case 'step3': // Elevator core - Core full opacity, rest translucent
          matColumns.opacity = 0.1;
          matCoreArea.opacity = 1.0;
          matFrontFlats.opacity = 0.02;
          matRearFlats.opacity = 0.02;
          matLouvers.opacity = 0.1;
          matGlassCurtain.opacity = 0.03;
          matOasisTurf.opacity = 0.05;
          matSlabGround.opacity = 0.1;
          matSlabExecutive.opacity = 0.1;
          matSlabPanoramic.opacity = 0.1;
          matSlabPenthouse.opacity = 0.1;
          smoothCameraTransition(15, 38, 38, 0, 15, 0);
          break;
        case 'step4': // Typical floors layout
          matColumns.opacity = 0.15;
          matCoreArea.opacity = 0.25;
          matFrontFlats.opacity = 0.85;
          matRearFlats.opacity = 0.85;
          matLouvers.opacity = 0.7;
          matGlassCurtain.opacity = 0.45;
          matOasisTurf.opacity = 0.1;
          matSlabGround.opacity = 0.15;
          matSlabExecutive.opacity = 0.85;
          matSlabPanoramic.opacity = 0.85;
          matSlabPenthouse.opacity = 0.85;
          smoothCameraTransition(42, 38, 48, 0, 18, 0);
          break;
        case 'step5': // Parking levels (Ground)
          matColumns.opacity = 0.4;
          matCoreArea.opacity = 0.15;
          matFrontFlats.opacity = 0.05;
          matRearFlats.opacity = 0.05;
          matLouvers.opacity = 0.2;
          matGlassCurtain.opacity = 0.05;
          matOasisTurf.opacity = 0.05;
          matSlabGround.opacity = 1.0;
          matSlabExecutive.opacity = 0.05;
          matSlabPanoramic.opacity = 0.05;
          matSlabPenthouse.opacity = 0.05;
          smoothCameraTransition(36, 10, 30, 0, 2, 0);
          break;
        case 'step6': // Garden roofscape
          matColumns.opacity = 0.1;
          matCoreArea.opacity = 0.1;
          matFrontFlats.opacity = 0.05;
          matRearFlats.opacity = 0.05;
          matLouvers.opacity = 0.3;
          matGlassCurtain.opacity = 0.3;
          matOasisTurf.opacity = 1.0;
          matSlabGround.opacity = 0.08;
          matSlabExecutive.opacity = 0.08;
          matSlabPanoramic.opacity = 0.08;
          matSlabPenthouse.opacity = 1.0;
          smoothCameraTransition(0, 48, 40, 0, 32, 0);
          break;
        case 'all':
        default:
          autoRotateActive = true;
          smoothCameraTransition(55, 50, 75, 0, 16, 0);
          break;
      }
    }

    function smoothCameraTransition(camX, camY, camZ, tarX, tarY, tarZ) {
      camera.position.set(camX, camY, camZ);
      controls.target.set(tarX, tarY, tarZ);
      controls.update();
    }

    // 1. VR Stereo Headset mode control
    let isVRMode = false;
    const stereoCamera = new THREE.StereoCamera();
    stereoCamera.eyeSeparation = 0.55; 

    window.toggleVRMode = function() {
      isVRMode = !isVRMode;
      const btn = document.getElementById('btn-vr');
      if (isVRMode) {
        btn.classList.add('active');
        btn.innerHTML = '🕶️ VR Mode: Stereo (Active)';
      } else {
        btn.classList.remove('active');
        btn.innerHTML = '👓 Toggle VR Stereo View';
        
        // Reset full size single viewport
        renderer.setScissorTest(false);
        renderer.setViewport(0, 0, container.clientWidth || window.innerWidth, container.clientHeight || window.innerHeight);
      }
    };

    // 2. Standard elevation projections jumping
    window.setElevationView = function(viewType) {
      autoRotateActive = false;
      if (viewType === 'north') {
        smoothCameraTransition(0, 16, 75, 0, 16, 0);
      } else if (viewType === 'south') {
        smoothCameraTransition(50, 40, -50, 0, 16, 0);
      } else if (viewType === 'top') {
        smoothCameraTransition(0, 90, 0.1, 0, 16, 0); 
      }
    };

    // 3. Orbit Dynamics controls
    window.updateOrbitSensitivity = function(type, value) {
      const val = parseFloat(value);
      if (type === 'zoom') {
        controls.zoomSpeed = val;
        document.getElementById('zoom-lbl').innerHTML = val.toFixed(1) + 'X';
      } else if (type === 'pan') {
        controls.panSpeed = val;
        controls.rotateSpeed = val / 2 + 0.5;
        document.getElementById('pan-lbl').innerHTML = val.toFixed(1) + 'X';
      }
      controls.update();
    };

    // 4. Inspection Camera Snapshot Suite
    let stream = null;
    let currentSource = 'camera'; 
    let capturedImgData = null;

    window.triggerInspectionSnapshot = function() {
      document.getElementById('snapshot-modal').style.display = 'flex';
      document.getElementById('loader-camera').style.display = 'block';
      document.getElementById('webcam-video').style.display = 'none';
      document.getElementById('fallback-canvas').style.display = 'none';
      
      currentSource = 'camera';
      
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
        .then(s => {
          stream = s;
          const video = document.getElementById('webcam-video');
          video.srcObject = stream;
          video.style.display = 'block';
          document.getElementById('loader-camera').style.display = 'none';
        })
        .catch(err => {
          console.log("No camera found. Falling back to 3D virtual snapshot.");
          useBackup3DRender();
        });
    };

    function useBackup3DRender() {
      currentSource = '3d';
      document.getElementById('loader-camera').style.display = 'none';
      document.getElementById('webcam-video').style.display = 'none';
      
      const canvas = document.getElementById('fallback-canvas');
      canvas.style.display = 'block';
      
      renderer.render(scene, camera);
      const dataUrl = renderer.domElement.toDataURL('image/png');
      const img = new Image();
      img.onload = () => {
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
      img.src = dataUrl;
    }

    window.toggleSnapshotSource = function() {
      if (currentSource === 'camera') {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          stream = null;
        }
        useBackup3DRender();
      } else {
        window.triggerInspectionSnapshot();
      }
    };

    window.closeSnapshotModal = function() {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
      }
      document.getElementById('snapshot-modal').style.display = 'none';
    };

    window.captureShutterFrame = function() {
      const compositeCanvas = document.createElement('canvas');
      const ctx = compositeCanvas.getContext('2d');
      
      let sourceW = 640;
      let sourceH = 480;
      
      if (currentSource === 'camera') {
        const video = document.getElementById('webcam-video');
        sourceW = video.videoWidth || 640;
        sourceH = video.videoHeight || 480;
      } else {
        const fallbackCanvas = document.getElementById('fallback-canvas');
        sourceW = fallbackCanvas.width || 640;
        sourceH = fallbackCanvas.height || 480;
      }
      
      compositeCanvas.width = sourceW;
      compositeCanvas.height = sourceH + 110; 
      
      // Paint background
      ctx.fillStyle = '#05070f';
      ctx.fillRect(0, 0, compositeCanvas.width, compositeCanvas.height);
      
      // Draw primary image
      if (currentSource === 'camera') {
        const video = document.getElementById('webcam-video');
        ctx.translate(sourceW, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, sourceW, sourceH);
        ctx.setTransform(1, 0, 0, 1, 0, 0); 
      } else {
        const fallbackCanvas = document.getElementById('fallback-canvas');
        ctx.drawImage(fallbackCanvas, 0, 0, sourceW, sourceH);
      }
      
      // Frame borders
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 4;
      ctx.strokeRect(4, 4, compositeCanvas.width - 8, compositeCanvas.height - 8);
      
      // Bottom title drawer
      ctx.fillStyle = '#0a0d1a';
      ctx.fillRect(4, sourceH, compositeCanvas.width - 8, 106);
      
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
      ctx.lineWidth = 1;
      ctx.moveTo(4, sourceH);
      ctx.lineTo(compositeCanvas.width - 4, sourceH);
      ctx.stroke();
      
      ctx.fillStyle = '#d4af37';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('MOLLIK TOWER-2 // FIELD QUALITY VERIFICATION LOG', 16, sourceH + 26);
      
      ctx.fillStyle = '#94a3b8';
      ctx.font = '8.5px monospace';
      ctx.fillText('STATION: DHAKA SECTORS PLOT // VERIFIER LOGGED', 16, sourceH + 44);
      ctx.fillText('GEOLOGY RAFT STRUCT: BSRM 72.5 Grade Piles Installed', 16, sourceH + 60);
      ctx.fillText('COMPLIANCE STANDARD: RAJUK Building Ordinance approved', 16, sourceH + 76);
      
      // Draw bar code
      ctx.fillStyle = '#d4af37';
      for(let i = 0; i < 22; i++) {
        const barW = (i % 3 === 0) ? 3 : (i % 2 === 0 ? 1 : 2);
        ctx.fillRect(compositeCanvas.width - 140 + (i*4), sourceH + 18, barW, 26);
      }
      
      const now = new Date();
      ctx.fillStyle = '#64748b';
      ctx.font = '8px monospace';
      ctx.fillText('UTC: ' + now.toISOString().replace('T', ' ').substring(0, 19), compositeCanvas.width - 140, sourceH + 56);
      ctx.fillText('AZIM: 23.8732° N, 90.3985° E // ELEV: 12M', compositeCanvas.width - 140, sourceH + 72);
      
      capturedImgData = compositeCanvas.toDataURL('image/jpeg', 0.9);
      
      document.getElementById('saved-snapshot-img').src = capturedImgData;
      document.getElementById('snapshot-modal').style.display = 'none';
      document.getElementById('capture-saved-modal').style.display = 'flex';
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
      }
    };

    window.closeSavedModal = function() {
      document.getElementById('capture-saved-modal').style.display = 'none';
    };

    window.downloadCompiledLog = function() {
      if (capturedImgData) {
        const link = document.createElement('a');
        link.download = 'mollik_tower_inspection_' + Date.now() + '.jpg';
        link.href = capturedImgData;
        link.click();
      }
    };

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      
      if (autoRotateActive) {
        completeBuildingGroup.rotation.y += 0.0012;
      } else {
        completeBuildingGroup.rotation.y = 0; // standard view lock
      }

      // Actively animate elevators
      liftTime += 0.015;
      elevatorCab1.position.y = 3 + Math.abs(Math.sin(liftTime)) * 26;
      elevatorCab2.position.y = 3 + Math.abs(Math.cos(liftTime + 1.5)) * 26;
      
      if (isVRMode) {
        // Enforce side-by-side stereo split-screen
        renderer.setScissorTest(true);
        const w = renderer.domElement.clientWidth;
        const h = renderer.domElement.clientHeight;
        const halfW = w / 2;

        // Set eye camera separation ratio aspect
        camera.aspect = halfW / h;
        camera.updateProjectionMatrix();

        // Render left eye view
        renderer.setViewport(0, 0, halfW, h);
        renderer.setScissor(0, 0, halfW, h);
        stereoCamera.update(camera);
        renderer.render(scene, stereoCamera.cameraL);

        // Render right eye view
        renderer.setViewport(halfW, 0, halfW, h);
        renderer.setScissor(halfW, 0, halfW, h);
        renderer.render(scene, stereoCamera.cameraR);
      } else {
        renderer.setScissorTest(false);
        renderer.setViewport(0, 0, renderer.domElement.clientWidth, renderer.domElement.clientHeight);
        renderer.render(scene, camera);
      }
    }

    window.addEventListener('resize', () => {
      const w = container ? (container.clientWidth || window.innerWidth || 800) : window.innerWidth;
      const h = container ? (container.clientHeight || window.innerHeight || 600) : window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    // Sync messages from React parent controls to update active focus
    window.addEventListener('message', (e) => {
      if (e.data) {
        if (e.data.type === 'trigger-step') {
          const btn = document.getElementById('btn-' + e.data.step);
          window.focusStage(e.data.step, btn);
        }
        if (e.data.type === 'toggle-tower-visibility') {
          if (typeof completeBuildingGroup !== 'undefined') {
            completeBuildingGroup.visible = e.data.visible;
          }
        }
        if (e.data.type === 'set-explode-factor') {
          const factor = e.data.factor || 0;
          if (typeof completeBuildingGroup !== 'undefined') {
            completeBuildingGroup.traverse((child) => {
              if (child.userData && child.userData.floorIndex !== undefined) {
                if (child.userData.originalY === undefined) {
                  child.userData.originalY = child.position.y;
                }
                const floorIdx = child.userData.floorIndex;
                child.position.y = child.userData.originalY + (floorIdx * factor * floorHeight * 0.9);
              }
            });
          }
        }
        if (e.data.type === 'toggle-wireframe') {
          const isWireframe = e.data.wireframe || false;
          scene.traverse((child) => {
            if (child.isMesh && child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(m => m.wireframe = isWireframe);
              } else {
                child.material.wireframe = isWireframe;
              }
            }
          });
        }
        if (e.data.type === 'simulate-lighting') {
          if (typeof window.simulateLighting === 'function') {
            window.simulateLighting(e.data.lightMode);
          }
        }
        if (e.data.type === 'toggle-ui-overlay') {
          const overlay = document.getElementById('ui-overlay');
          if (overlay) {
            if (e.data.visible) {
              overlay.style.display = 'block';
              setTimeout(() => { overlay.style.opacity = '1'; }, 10);
            } else {
              overlay.style.opacity = '0';
              setTimeout(() => { overlay.style.display = 'none'; }, 250);
            }
          }
        }
        // Explicilty update on interactions or parent message triggers
        setTimeout(() => {
          const w = container ? (container.clientWidth || window.innerWidth || 800) : window.innerWidth;
          const h = container ? (container.clientHeight || window.innerHeight || 600) : window.innerHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }, 100);
      }
    });

    // Dismiss the internal loader once setup is fully initialized and render is ready
    setTimeout(() => {
      const loaderElement = document.getElementById('three-loader');
      if (loaderElement) {
        loaderElement.style.opacity = '0';
        loaderElement.style.visibility = 'hidden';
      }
    }, 450);

    animate();
  </script>
</body>
</html>
`;
};

interface FloorPlanProps {
  language?: "en" | "bn";
  selectedProject?: Project | null;
  active3DProject?: Project | null;
  onClose3D?: () => void;
}

export default function FloorPlan({ language = 'en', selectedProject, active3DProject, onClose3D }: FloorPlanProps = {}) {
  const [isLoading3D, setIsLoading3D] = useState<boolean>(true);
  const [isLoading3DFullscreen, setIsLoading3DFullscreen] = useState<boolean>(true);
  const [selectedFloor, setSelectedFloor] = useState<number>(1); // 0 = Ground Floor, 1-9 = Residential Floors
  const [selectedUnitId, setSelectedUnitId] = useState<string>('A');
  const [layoutViewMode, setLayoutViewMode] = useState<'blueprint' | 'three3d' | 'analytics'>('three3d');
  const [selectedThreeStep, setSelectedThreeStep] = useState<string>('all');
  const [isFullScreen3D, setIsFullScreen3D] = useState<boolean>(false);
  const [is3DModelHidden, setIs3DModelHidden] = useState<boolean>(false);
  const [isIsolationExplorerHidden, setIsIsolationExplorerHidden] = useState<boolean>(false);
  const [isPureView, setIsPureView] = useState<boolean>(false);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);
  const [autoShowProgress, setAutoShowProgress] = useState<number>(0);
  const [hoveredRoom, setHoveredRoom] = useState<{ name: string; nameBn: string; sizeSqFt: number } | null>(null);
  const [isMaximizedBlueprint, setIsMaximizedBlueprint] = useState<boolean>(false);
  
  // Interactive 3D Simulation States
  const [explodeFactor, setExplodeFactor] = useState<number>(0);
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);
  const [lightingMode, setLightingMode] = useState<'noon' | 'morning' | 'dusk' | 'midnight'>('noon');

  const send3DMessage = (message: any) => {
    try {
      const iframeNormal = document.getElementById('abrar-3d-iframe') as HTMLIFrameElement | null;
      if (iframeNormal?.contentWindow) {
        iframeNormal.contentWindow.postMessage(message, '*');
      }
      const iframeFull = document.getElementById('abrar-3d-iframe-fullscreen') as HTMLIFrameElement | null;
      if (iframeFull?.contentWindow) {
        iframeFull.contentWindow.postMessage(message, '*');
      }
    } catch (err) {
      console.warn("Failed to send 3D message:", err);
    }
  };

  useEffect(() => {
    send3DMessage({ type: 'set-explode-factor', factor: explodeFactor });
  }, [explodeFactor, layoutViewMode]);

  useEffect(() => {
    send3DMessage({ type: 'toggle-wireframe', wireframe: wireframeMode });
  }, [wireframeMode, layoutViewMode]);

  useEffect(() => {
    send3DMessage({ type: 'simulate-lighting', lightMode: lightingMode });
  }, [lightingMode, layoutViewMode]);
  
  const autoPlayTimerRef = useRef<any>(null);
  const autoPlayProgressIntervalRef = useRef<any>(null);

  const currentProj = active3DProject || selectedProject || PROJECT_LIST[0];
  const isBangla = language === 'bn';
  const projName = isBangla ? currentProj.nameBn : currentProj.name;
  
  // Extract specs
  const landAreaVal = currentProj.specs?.find(s => s.label === "Land Area")?.value || "10 Katha";
  const heightVal = currentProj.specs?.find(s => s.label === "Building Height")?.value || "G + 9 Floors";
  const apartmentsVal = currentProj.specs?.find(s => s.label === "Total Apartments")?.value || "36 family flats";
  const parsedKatha = parseInt(landAreaVal.replace(/[^0-9]/g, '')) || 10;
  const totalSqFt = parsedKatha * 720;

  // Trigger cinematic full screen automatically if active3DProject is set by parent (e.g. from ProjectCard)
  useEffect(() => {
    if (active3DProject) {
      setIsFullScreen3D(true);
      setIsLoading3DFullscreen(true);
    }
  }, [active3DProject]);

  // Reset loading progress state on project change to show premium fetch/render feedback
  useEffect(() => {
    setIsLoading3D(true);
    setIsLoading3DFullscreen(true);

    // Dynamic backup timers to resolve raw iframe loading overlays on standard browsers
    const nativeTimer1 = setTimeout(() => {
      setIsLoading3D(false);
    }, 1200);

    const nativeTimer2 = setTimeout(() => {
      setIsLoading3DFullscreen(false);
    }, 1200);

    return () => {
      clearTimeout(nativeTimer1);
      clearTimeout(nativeTimer2);
    };
  }, [active3DProject, selectedProject]);

  const handleClose3D = () => {
    setIsFullScreen3D(false);
    onClose3D?.();
  };

  // Sync iframe overlays (such as the isolation explorer menu inside the 3D scene) whenever visibility flags change
  useEffect(() => {
    if (isFullScreen3D) {
      setIsIsolationExplorerHidden(true);
    } else {
      setIsIsolationExplorerHidden(false);
    }
  }, [isFullScreen3D]);

  useEffect(() => {
    const isOverlayHidden = isIsolationExplorerHidden || isPureView;
    const iframeNormal = document.getElementById('abrar-3d-iframe') as HTMLIFrameElement;
    const iframeFull = document.getElementById('abrar-3d-iframe-fullscreen') as HTMLIFrameElement;
    
    if (iframeNormal?.contentWindow) {
      iframeNormal.contentWindow.postMessage({ type: 'toggle-ui-overlay', visible: !isOverlayHidden }, '*');
    }
    if (iframeFull?.contentWindow) {
      iframeFull.contentWindow.postMessage({ type: 'toggle-ui-overlay', visible: !isOverlayHidden }, '*');
    }
  }, [isIsolationExplorerHidden, isPureView, isFullScreen3D, isLoading3D, isLoading3DFullscreen]);

  // Sync tower visibility based on is3DModelHidden state
  useEffect(() => {
    const iframeNormal = document.getElementById('abrar-3d-iframe') as HTMLIFrameElement;
    const iframeFull = document.getElementById('abrar-3d-iframe-fullscreen') as HTMLIFrameElement;
    
    if (iframeNormal?.contentWindow) {
      iframeNormal.contentWindow.postMessage({ type: 'toggle-tower-visibility', visible: !is3DModelHidden }, '*');
    }
    if (iframeFull?.contentWindow) {
      iframeFull.contentWindow.postMessage({ type: 'toggle-tower-visibility', visible: !is3DModelHidden }, '*');
    }
  }, [is3DModelHidden, isFullScreen3D, isLoading3D, isLoading3DFullscreen]);

  // Unified Auto-Play feature (Revives hidden towers and cycles through layers automatically)
  useEffect(() => {
    if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    if (autoPlayProgressIntervalRef.current) clearInterval(autoPlayProgressIntervalRef.current);
    
    if (!isAutoPlay) {
      setAutoShowProgress(0);
      return;
    }

    const durationMs = 5500; // 5.5 seconds per structural slide
    const intervalTickMs = 100;
    const progressPerTick = (intervalTickMs / durationMs) * 100;
    let accumulatedProgress = 0;

    autoPlayProgressIntervalRef.current = setInterval(() => {
      accumulatedProgress += progressPerTick;
      if (accumulatedProgress >= 100) {
        accumulatedProgress = 0;
        
        // Advance to next design step
        const stepsOrder = ['all', 'step1', 'step2', 'step3', 'step4', 'step5', 'step6'];
        setSelectedThreeStep((prevStep) => {
          const nextIdx = (stepsOrder.indexOf(prevStep) + 1) % stepsOrder.length;
          const nextStep = stepsOrder[nextIdx];
          
          // Revive / Show tower when it switches, to view the next structure clearly
          setIs3DModelHidden(false);

          // Dispatch trigger-step message
          const iframeNorm = document.getElementById('abrar-3d-iframe') as HTMLIFrameElement;
          const iframeFull = document.getElementById('abrar-3d-iframe-fullscreen') as HTMLIFrameElement;
          if (iframeNorm?.contentWindow) {
            iframeNorm.contentWindow.postMessage({ type: 'trigger-step', step: nextStep }, '*');
            iframeNorm.contentWindow.postMessage({ type: 'toggle-tower-visibility', visible: true }, '*');
          }
          if (iframeFull?.contentWindow) {
            iframeFull.contentWindow.postMessage({ type: 'trigger-step', step: nextStep }, '*');
            iframeFull.contentWindow.postMessage({ type: 'toggle-tower-visibility', visible: true }, '*');
          }
          return nextStep;
        });
      }
      setAutoShowProgress(Math.min(accumulatedProgress, 100));
    }, intervalTickMs);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      if (autoPlayProgressIntervalRef.current) clearInterval(autoPlayProgressIntervalRef.current);
    };
  }, [isAutoPlay]);

  const toggleHideTower = () => {
    const nextHidden = !is3DModelHidden;
    setIs3DModelHidden(nextHidden);
    
    // Notify iframes immediately
    const iframeNorm = document.getElementById('abrar-3d-iframe') as HTMLIFrameElement;
    const iframeFull = document.getElementById('abrar-3d-iframe-fullscreen') as HTMLIFrameElement;
    if (iframeNorm?.contentWindow) {
      iframeNorm.contentWindow.postMessage({ type: 'toggle-tower-visibility', visible: !nextHidden }, '*');
    }
    if (iframeFull?.contentWindow) {
      iframeFull.contentWindow.postMessage({ type: 'toggle-tower-visibility', visible: !nextHidden }, '*');
    }
  };
  const [filterStatus, setFilterStatus] = useState<'All' | 'Available' | 'Reserved' | 'Sold'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredFlatId, setHoveredFlatId] = useState<string | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringUnit, setIsHoveringUnit] = useState(false);
  const [hoveredUnitData, setHoveredUnitData] = useState<VisualUnit | null>(null);
  const [hoveredStatus, setHoveredStatus] = useState<string>('');
  const [selectedFlatForDetail, setSelectedFlatForDetail] = useState<FlatDetail | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  
  // Interactive graph hover states
  const [activeLandSegment, setActiveLandSegment] = useState<number | null>(null);
  const [activePriceBar, setActivePriceBar] = useState<number | null>(null);

  const triggerIframeStep = (stepId: string) => {
    setSelectedThreeStep(stepId);
    
    // Dispatch to ordinary 3D canvas iframe
    const iframeNormal = document.getElementById('abrar-3d-iframe') as HTMLIFrameElement;
    if (iframeNormal && iframeNormal.contentWindow) {
      iframeNormal.contentWindow.postMessage({ type: 'trigger-step', step: stepId }, '*');
    }
    
    // Dispatch to fullscreen popup iframe
    const iframeFull = document.getElementById('abrar-3d-iframe-fullscreen') as HTMLIFrameElement;
    if (iframeFull && iframeFull.contentWindow) {
      iframeFull.contentWindow.postMessage({ type: 'trigger-step', step: stepId }, '*');
    }
  };

  // Monitor orbital visual step updates loaded securely
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data) {
        if (event.data.type === '3d-step') {
          setSelectedThreeStep(event.data.step);
        }
        if (event.data.type === 'hover-room') {
          setHoveredRoom(event.data.room);
          setIsHoveringUnit(event.data.room !== null);
          if (event.data.clientX !== undefined && event.data.clientY !== undefined) {
            setMousePos({ x: event.data.clientX, y: event.data.clientY });
          }
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Keyboard listener for escape shortcut to close immersion modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose3D();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose3D]);

  const [liftState, setLiftState] = useState<{
    currentFloor: number;
    targetFloor: number;
    direction: 'up' | 'down' | 'idle';
    isMoving: boolean;
  }>({
    currentFloor: 1,
    targetFloor: 1,
    direction: 'idle',
    isMoving: false,
  });

  // Handle lift logic when floor changes
  useEffect(() => {
    if (selectedFloor !== liftState.currentFloor && !liftState.isMoving) {
      const direction = selectedFloor > liftState.currentFloor ? 'up' : 'down';
      setLiftState({
        currentFloor: liftState.currentFloor,
        targetFloor: selectedFloor,
        direction,
        isMoving: true,
      });

      // Animated movement simulation
      const duration = Math.abs(selectedFloor - liftState.currentFloor) * 350 + 350;
      const timer = setTimeout(() => {
        setLiftState({
          currentFloor: selectedFloor,
          targetFloor: selectedFloor,
          direction: 'idle',
          isMoving: false,
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [selectedFloor, liftState.currentFloor, liftState.isMoving]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // 4 Unit templates matching the 10 Katha landscape design
  const bespokeUnits: VisualUnit[] = [
    {
      id: 'A',
      name: 'Residence Unit A',
      sizeSqFt: 920,
      bedrooms: 3,
      bathrooms: 2,
      verandas: 2,
      facing: 'South-West (Front Corner)',
      idealFor: 'Families desiring high front-exposure daylight and rich cross breezes',
      priceEstimate: '৳85 Lakh',
      basePriceNum: 85
    },
    {
      id: 'B',
      name: 'Residence Unit B',
      sizeSqFt: 920,
      bedrooms: 3,
      bathrooms: 2,
      verandas: 2,
      facing: 'South-East (Front Corner)',
      idealFor: 'Morning-light lovers holding high priority for sunrise and deep windflow',
      priceEstimate: '৳85 Lakh',
      basePriceNum: 85
    },
    {
      id: 'C',
      name: 'Residence Unit C',
      sizeSqFt: 880,
      bedrooms: 3,
      bathrooms: 2,
      verandas: 1,
      facing: 'North-West (Rear Privacy Corner)',
      idealFor: 'Privacy-oriented buyers requiring acoustic isolation and thermal calmness',
      priceEstimate: '৳79 Lakh',
      basePriceNum: 79
    },
    {
      id: 'D',
      name: 'Residence Unit D',
      sizeSqFt: 880,
      bedrooms: 3,
      bathrooms: 2,
      verandas: 1,
      facing: 'North-East (Rear Privacy Corner)',
      idealFor: 'Professionals seeking serene northern skylights and pleasant layouts',
      priceEstimate: '৳79 Lakh',
      basePriceNum: 79
    }
  ];

  // Static determinism for the 36 flats status & pricing (9 floors * 4 units = 36 flats)
  const getFlatStatus = (floor: number, unitCode: string): 'Available' | 'Reserved' | 'Sold' => {
    const sum = floor * 3 + unitCode.charCodeAt(0);
    const hash = sum % 7;
    if (hash === 1 || hash === 4) return 'Reserved';
    if (hash === 0 || hash === 3 || hash === 5) return 'Sold';
    return 'Available';
  };

  const getFlatReservedDates = (floor: number, unitCode: string): string[] => {
    const status = getFlatStatus(floor, unitCode);
    if (status === 'Available') return [];
    const day = ((floor * 7 + unitCode.charCodeAt(0)) % 20) + 5;
    const month = ((floor + unitCode.charCodeAt(0)) % 3) + 6; // June, July, August 2026
    return [
      `2026-0${month}-${day < 10 ? '0' + day : day}`,
      `2026-0${month}-${(day + 1) < 10 ? '0' + (day + 1) : (day + 1)}`,
      `2026-0${month}-${(day + 2) < 10 ? '0' + (day + 2) : (day + 2)}`
    ];
  };

  const getFlatPriceNum = (floor: number, basePrice: number): number => {
    // Floor premium rises by ৳0.5 Lakh per floor for level 2-5, and ৳0.8 Lakh per floor for level 6-9
    let premium = 0;
    if (floor > 1 && floor <= 5) {
      premium = (floor - 1) * 0.50;
    } else if (floor > 5) {
      premium = 4 * 0.50 + (floor - 5) * 0.85;
    }
    return Math.round((basePrice + premium) * 100) / 100;
  };

  // Generate the full database of all 36 flats
  const allFlats: FlatDetail[] = [];
  for (let floor = 1; floor <= 9; floor++) {
    const units = ['A', 'B', 'C', 'D'];
    units.forEach((u) => {
      const template = bespokeUnits.find(bu => bu.id === u)!;
      const flatIdNum = `${floor}0${units.indexOf(u) + 1}`;
      const finalPrice = getFlatPriceNum(floor, template.basePriceNum);
      const status = getFlatStatus(floor, u);
      allFlats.push({
        id: flatIdNum,
        floor,
        unitCode: u,
        flatName: `Flat #${flatIdNum}`,
        sizeSqFt: template.sizeSqFt,
        bedrooms: template.bedrooms,
        bathrooms: template.bathrooms,
        verandas: template.verandas,
        facing: template.facing,
        priceBDT: `৳${finalPrice.toFixed(2)} Lakh`,
        priceNum: finalPrice,
        status: status,
        idealFor: template.idealFor,
        ReservedDates: getFlatReservedDates(floor, u)
      });
    });
  }

  const activeUnit = bespokeUnits.find(u => u.id === selectedUnitId) || bespokeUnits[0];
  const activeFlatPrice = getFlatPriceNum(selectedFloor === 0 ? 1 : selectedFloor, activeUnit.basePriceNum);

  const handleSelectFlatDetail = (floor: number, unitCode: string) => {
    setSelectedFloor(floor);
    setSelectedUnitId(unitCode);
    const flat = allFlats.find(f => f.floor === floor && f.unitCode === unitCode);
    if (flat) {
      setSelectedFlatForDetail(flat);
      setIsDetailModalOpen(true);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Color definitions
    const cCharcoal = [15, 23, 42]; // #0f172a
    const cGold = [212, 175, 55]; // #d4af37
    const cSoftGray = [241, 245, 249];
    const cTextDark = [30, 41, 59];
    const cTextMuted = [100, 116, 139];

    // Page styling & margins
    const marginX = 20;
    
    // Draw charcoal header block
    doc.setFillColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
    doc.rect(0, 0, 210, 45, 'F');

    // Header Content
    doc.setTextColor(cGold[0], cGold[1], cGold[2]);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('MOLLIK TOWER - II', marginX, 18);

    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('BESPOKE ARCHITECTURAL LANDMARK // PRE-LAUNCH BROCHURE', marginX, 25);
    doc.text('LOCATION: EAST FAYDABAD, UTTARA RAJUK BOUNDS, DHAKA', marginX, 30);

    // Decorative gold line divider
    doc.setFillColor(cGold[0], cGold[1], cGold[2]);
    doc.rect(marginX, 43, 170, 0.8, 'F');

    // Apartment details
    doc.setTextColor(cTextDark[0], cTextDark[1], cTextDark[2]);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(`Flat #${selectedFloor}0${['A', 'B', 'C', 'D'].indexOf(selectedUnitId) + 1}`, marginX, 60);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(cTextMuted[0], cTextMuted[1], cTextMuted[2]);
    doc.text(`Level 0${selectedFloor} // Unit Category ${selectedUnitId}`, marginX, 67);

    // Grid details box
    doc.setFillColor(cSoftGray[0], cSoftGray[1], cSoftGray[2]);
    doc.rect(marginX, 75, 170, 35, 'F');

    doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('KEY SPECIFICATIONS', marginX + 6, 82);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(cTextDark[0], cTextDark[1], cTextDark[2]);
    doc.text(`• Total Area: ${activeUnit.sizeSqFt} SQ FT`, marginX + 6, 89);
    doc.text(`• Bed Tiers: ${activeUnit.bedrooms} BHK Arrangement`, marginX + 6, 95);
    doc.text(`• Bathroom Suites: ${activeUnit.bathrooms} Luxury Baths`, marginX + 6, 101);

    doc.text(`• Orientation: ${activeUnit.facing}`, marginX + 85, 89);
    doc.text(`• Premium Slabs: Italian Statuario & Greek Marble`, marginX + 85, 95);
    doc.text(`• Natural Daylight Vent Index: Guaranteed Corner`, marginX + 85, 101);

    // Subtitle section
    doc.setFont('Helvetica', 'oblique');
    doc.setFontSize(11);
    doc.setTextColor(cGold[0], cGold[1], cGold[2]);
    doc.text(`"Recommended for: ${activeUnit.idealFor}"`, marginX, 122);

    // Divider
    doc.setDrawColor(226, 232, 240);
    doc.line(marginX, 128, 190, 128);

    // Architectural description header
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
    doc.text('ARCHITECTURAL SYNTHESIS', marginX, 137);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(cTextDark[0], cTextDark[1], cTextDark[2]);
    
    const textDesc = activeUnit.description || `Residence Category ${activeUnit.id} is a meticulously planned luxury residential apartment featuring premium layout details. Configured with a ${activeUnit.bedrooms} BHK spacious plan, ${activeUnit.bathrooms} bathrooms, and anti-skid premium floor finishes, this unit offers maximum space efficiency matching Dhaka RAJUK standards on a 10 Katha core plot footprint. Highly recommended for families seeking long-term quality, safety, and comfort.`;
    
    const splitDescription = doc.splitTextToSize(
      textDesc,
      170
    );
    doc.text(splitDescription, marginX, 144);

    // Highlights list
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
    doc.text('INTERIOR SPACE LAYOUT EXTRA HIGHLIGHTS', marginX, 170);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(cTextDark[0], cTextDark[1], cTextDark[2]);
    let currentY = 177;
    
    const listHighlights = activeUnit.highlights || [
      'Stator-equipped high capacity structural safety core layers',
      'Dual high-speed residential lift circulation core portals',
      'Fully compliant double-staircase emergency exit systems',
      'Anti-skid premium basalt flooring and wooden deck balconies'
    ];
    
    listHighlights.forEach((h: string) => {
      doc.text(`- ${h}`, marginX + 4, currentY);
      currentY += 6;
    });

    // Pricing & Reservation Estimate Box (Gold highlighted)
    doc.setFillColor(253, 250, 242);
    doc.setDrawColor(cGold[0], cGold[1], cGold[2]);
    doc.rect(marginX, 210, 170, 24, 'FD');

    doc.setTextColor(cGold[0], cGold[1], cGold[2]);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('EXCLUSIVE RESERVATION VALUATION (Q2 2026 ESTIMATE)', marginX + 6, 216);

    doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(15);
    doc.text(`BDT ৳${activeFlatPrice.toFixed(2)} Lakhs`, marginX + 6, 225);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(cTextMuted[0], cTextMuted[1], cTextMuted[2]);
    doc.text('* Exclusive of car parking spaces, gas/power connections, and central registry fees.', marginX + 6, 230);

    // Footer Block
    doc.setDrawColor(226, 232, 240);
    doc.line(marginX, 255, 190, 255);

    doc.setTextColor(cTextMuted[0], cTextMuted[1], cTextMuted[2]);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(`This sheet is a digital specification card issued on behalf of ${projName} Development, Chittagong & Dhaka Registry Office.`, marginX, 262);
    doc.text('Official RAJUK registry coordinates are maintained under standard delta 10 katha plots codes. Double-glazing and structural standards apply.', marginX, 266);
    doc.text('PRE-LAUNCH REGISTRATION SECURED • STAMP CODE: ATX-2026-DHAKA', marginX, 273);

    // Save PDF
    doc.save(`${currentProj.id || 'Mollik_Tower'}_Flat_${selectedFloor}0${['A', 'B', 'C', 'D'].indexOf(selectedUnitId) + 1}_Brochure.pdf`);
  };

  // Filter & Search all 36 flats for the matrix & spreadsheet list
  const filteredFlats = allFlats.filter(flat => {
    const matchesStatus = filterStatus === 'All' || flat.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      flat.id.includes(searchQuery) || 
      flat.unitCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flat.facing.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getFloorName = (lvl: number) => {
    if (lvl === 0) return 'Ground Floor';
    return `Level ${lvl} (${lvl === 9 ? 'Top Residential' : 'Typical Floor'})`;
  };

  // Dynamic land utilization details for data visualization based on active project specs
  const landAllocation = [
    { 
      id: 1, 
      label: '60% Building Footprint (MGC)', 
      size: `${(totalSqFt * 0.60).toLocaleString(undefined, { maximumFractionDigits: 0 })} sq ft`, 
      percentage: 60, 
      color: '#d4af37', 
      desc: 'Main tower frame, fire doors lobby, and elevators structural column core.' 
    },
    { 
      id: 2, 
      label: '20% Side & Rear Permitted Setbacks', 
      size: `${(totalSqFt * 0.20).toLocaleString(undefined, { maximumFractionDigits: 0 })} sq ft`, 
      percentage: 20, 
      color: '#16a34a', 
      desc: 'Sufficient setbacks maintaining passive thermal insulation corridor breezes.' 
    },
    { 
      id: 3, 
      label: '10% Gated Driveway & Pavers', 
      size: `${(totalSqFt * 0.10).toLocaleString(undefined, { maximumFractionDigits: 0 })} sq ft`, 
      percentage: 10, 
      color: '#2563eb', 
      desc: 'Entry vehicular bay leading to G-floor covered parking allotments.' 
    },
    { 
      id: 4, 
      label: '10% Outdoor Peripheral Green Courtyard', 
      size: `${(totalSqFt * 0.10).toLocaleString(undefined, { maximumFractionDigits: 0 })} sq ft`, 
      percentage: 10, 
      color: '#eab308', 
      desc: 'Rainwater recharging grass bedding and peripheral flower boxes.' 
    },
  ];

  const totalLandSqFt = totalSqFt;

  // Count availability stats for our flats
  const totalFlatsCount = allFlats.length;
  const availableCount = allFlats.filter(f => f.status === 'Available').length;
  const reservedCount = allFlats.filter(f => f.status === 'Reserved').length;
  const soldCount = allFlats.filter(f => f.status === 'Sold').length;

  return (
    <section id="floorplan" className="py-16 md:py-24 bg-gradient-to-b from-[#0c0e14] via-[#090b10] to-[#050609] text-white relative border-t border-neutral-900 overflow-hidden shadow-[inset_0_4px_30px_rgba(0,0,0,0.5)]">
      {/* FULLSCREEN 3D CINEMATIC IMMERSION MODAL */}
      <AnimatePresence>
        {isFullScreen3D && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-[#05070f] z-[99999] flex flex-col md:flex-row overflow-hidden font-sans text-white"
          >
            {/* Immersive Overlay Sidebar Panel - Hide if Pure View mode is engaged or HUD Hidden is active to allow completely unobstructed view */}
            {!isPureView && !isIsolationExplorerHidden && (
              <div className="w-full md:w-[360px] h-[220px] md:h-screen shrink-0 bg-neutral-950/95 border-r border-[#1a1a1a] p-6 flex flex-col justify-between z-10 overflow-y-auto transition-all duration-300 animate-in slide-in-from-left">
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-900">
                    <div>
                      <h2 className="font-serif text-lg text-gold-400">{projName} 3D</h2>
                      <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest block mt-0.5">Architectural Portal</span>
                    </div>
                    <button 
                      onClick={handleClose3D}
                      className="p-1.5 text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-850 rounded border border-neutral-800 transition-all cursor-pointer flex items-center justify-center animate-pulse"
                      title="Exit Fullscreen"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-[8px] font-mono tracking-widest text-[#777] uppercase block mb-3">
                        Operational Layers
                      </span>
                      <div className="space-y-2">
                        {[
                          { id: 'all', title: '[0] Exterior Profile', d: 'Complete 10-storey landmark representation in WebGL 3D, showcasing Dhaka delta light.' },
                          { id: 'step1', title: '[1] 10-Katha Setbacks', d: 'Analyze the plot bounds dimensions. Highlights maximum ground coverage (MGC 60%).' },
                          { id: 'step2', title: '[2] Structural Columns Grid', d: 'Inspect Cast-In-Situ pillars matrix with tapering logic of lower Level 1-3 pillars.' },
                          { id: 'step3', title: '[3] Elevator & Stairs Core', d: 'Circulation hub with dual high-speed express elevators moving lift locations.' },
                          { id: 'step4', title: '[4] Typical Floor Splitting', d: 'Only 4 corner apartments per level to secure personal privacy, sizing 920 & 880 sqft.' },
                          { id: 'step5', title: '[5] Parking Layout Bay', d: 'Ground floor covered garage featuring exactly 10 parking slots labeled P1 to P10.' },
                          { id: 'step6', title: '[6] Rooftop Green Oasis', d: 'Premium communal sky lawn cooling the building structures, complete with shading pergolas.' },
                        ].map((s) => {
                          const isSel = selectedThreeStep === s.id;
                          return (
                            <button
                              key={s.id}
                              onClick={() => {
                                setIsAutoPlay(false); // Pause auto play on manual choice
                                triggerIframeStep(s.id);
                              }}
                              className={`w-full p-2 rounded text-left transition-all cursor-pointer border flex flex-col gap-1 ${
                                isSel 
                                  ? 'bg-neutral-900 border-gold-400/40 text-gold-300' 
                                  : 'bg-neutral-950 border-neutral-900 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/40'
                              }`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className="font-mono text-[10px] font-semibold">{s.title}</span>
                                {isSel && <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />}
                              </div>
                              <p className="text-[9px] text-neutral-450 font-light leading-snug font-sans">{s.d}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-900 mt-6 text-2xs font-mono text-neutral-500 flex justify-between items-center">
                  <span>DRAG ROTATE • ZOOM</span>
                  <span className="text-gold-400 font-bold">MOLLIK TOWER-2</span>
                </div>
              </div>
            )}

            {/* Immersive 3D Render Host inside Fullscreen overlay */}
            <div className="flex-1 h-full bg-[#05070f] relative min-h-[50vh]">
              {isLoading3DFullscreen && (
                <div className="absolute inset-0 z-40 bg-neutral-950 flex flex-col items-center justify-center p-8 text-center overflow-hidden">
                  <style>{`
                    @keyframes progressSweep {
                      0% { transform: translateX(-100%); }
                      100% { transform: translateX(200%); }
                    }
                  `}</style>
                  {/* Pulsing blueprint grid mockup */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.015)_1px,transparent_1px)] bg-[size:25px_25px] opacity-70 pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col items-center max-w-sm w-full space-y-6">
                    {/* Logo wireframe pulsing skeleton */}
                    <div className="relative">
                      <div className="w-20 h-20 border-t border-b border-l border-r border-gold-400/20 rounded-full flex items-center justify-center animate-ping duration-1000 opacity-20 absolute inset-0" />
                      <div className="w-20 h-20 border border-gold-400/30 rounded-full flex items-center justify-center bg-neutral-900 shadow-[0_0_20px_rgba(212,175,55,0.05)]">
                        <Compass className="text-gold-400 rotate-45 animate-pulse" size={32} />
                      </div>
                    </div>

                    {/* Skeleton Text */}
                    <div className="w-full space-y-3">
                      <div className="h-5 bg-neutral-900 border border-neutral-850 rounded w-3/4 mx-auto animate-pulse flex items-center justify-center">
                        <span className="text-[10px] font-serif text-gold-300 font-semibold tracking-wider uppercase">Loading Cinematic Portal</span>
                      </div>
                      <div className="h-3 bg-neutral-900 border border-neutral-850 rounded w-5/6 mx-auto animate-pulse" />
                      <div className="h-2.5 bg-neutral-900 border border-neutral-850 rounded w-1/2 mx-auto animate-pulse" />
                    </div>

                    {/* Sophisticated glowing linear progress bar */}
                    <div className="w-full">
                      <div className="h-[2px] w-full bg-neutral-900 border border-neutral-850 rounded-full overflow-hidden relative">
                        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-gold-400 to-transparent w-1/2 h-full rounded-full" style={{ animation: "progressSweep 1.8s ease-in-out infinite" }} />
                      </div>
                      <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500 uppercase tracking-widest mt-2 select-none">
                        <span>3D WALKTHROUGH</span>
                        <span className="animate-pulse">BOOTING LIGHTMAPS</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <iframe
                id="abrar-3d-iframe-fullscreen"
                title="3D Cinematic Walkthrough"
                className="w-full h-full border-none bg-[#05070f] block"
                referrerPolicy="no-referrer"
                srcDoc={getArchitectural3DHtmlBlock(currentProj, language)}
                onLoad={(e) => {
                  setIsLoading3DFullscreen(false);
                  try {
                    const iframe = e.currentTarget;
                    if (iframe.contentWindow) {
                      iframe.contentWindow.dispatchEvent(new Event('resize'));
                      // Sync states on load securely
                      iframe.contentWindow.postMessage({ type: 'toggle-tower-visibility', visible: !is3DModelHidden }, '*');
                      iframe.contentWindow.postMessage({ type: 'set-explode-factor', factor: explodeFactor }, '*');
                      iframe.contentWindow.postMessage({ type: 'toggle-wireframe', wireframe: wireframeMode }, '*');
                      iframe.contentWindow.postMessage({ type: 'simulate-lighting', lightMode: lightingMode }, '*');
                    }
                  } catch (err) {
                    console.warn(err);
                  }
                }}
              />
              
              {/* Permanent float exit button (Essential for responsive mobile/tablet devices or when HUD is hidden) */}
              <button 
                onClick={handleClose3D}
                className="absolute top-5 right-5 z-50 p-2 bg-neutral-950/90 hover:bg-neutral-900 text-[#C8A165] hover:text-white rounded-lg border border-neutral-850 hover:border-[#C8A165]/50 transition-all cursor-pointer flex items-center justify-center shadow-2xl backdrop-blur-md"
                title="Exit Walkthrough"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Cinematic Hide/Show Controllers overlay */}
              <div className="absolute top-16 md:top-5 left-5 md:left-auto md:right-16 z-50 flex flex-wrap items-center gap-2">
                {/* HUD HOVER TOGGLE FOR HIDE & SEEK */}
                <button
                  onClick={() => setIsIsolationExplorerHidden(!isIsolationExplorerHidden)}
                  className={`p-2 px-3.5 rounded font-mono text-[9px] uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 border shadow-lg backdrop-blur-md ${isIsolationExplorerHidden ? 'bg-amber-950/90 text-amber-300 border-amber-600/50 font-bold animate-pulse' : 'bg-neutral-950/90 text-neutral-300 border-neutral-850 hover:bg-neutral-900 hover:text-white'}`}
                  title={isIsolationExplorerHidden ? 'Show Controls HUD Overlay' : 'Hide Controls HUD Overlay'}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    {isIsolationExplorerHidden ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21" />
                    )}
                  </svg>
                  <span>{isIsolationExplorerHidden ? "HUD Hidden" : "Hide HUD Overlay"}</span>
                </button>

                <button
                  onClick={toggleHideTower}
                  className={`p-2 px-3.5 rounded font-mono text-[9px] uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 border shadow-lg backdrop-blur-md ${is3DModelHidden ? 'bg-gold-400 text-neutral-950 border-gold-400 font-bold' : 'bg-neutral-950/90 text-neutral-300 border-neutral-850 hover:bg-neutral-900 hover:text-white'}`}
                >
                  {is3DModelHidden ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-950 animate-pulse" />
                      Show 3D Tower
                    </>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                      Conceal Tower Envelope
                    </>
                  )}
                </button>
              </div>

              {is3DModelHidden && (
                <div className="absolute top-18 right-16 z-50 p-4 rounded-lg bg-neutral-950/90 border border-gold-400/20 max-w-xs shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 leading-normal">
                  <h4 className="font-mono text-[9px] font-bold text-gold-300 uppercase tracking-wider">Viewing Pure Footprint</h4>
                  <p className="text-[10px] text-neutral-400 mt-1 font-light">
                    Main 3-dimensional building volume is hidden. Showing raw plot setbacks, orientation axis, gridlines, and elevator rails.
                  </p>
                  {isAutoPlay && (
                    <div className="mt-2 text-[8px] font-mono text-neutral-500 uppercase tracking-widest flex items-center justify-between">
                      <span>Restoring automatically in</span>
                      <span className="text-gold-400">{Math.max(0, ((4000 - (autoShowProgress / 100 * 4000)) / 1000)).toFixed(1)}s</span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Fullscreen Interactive Floating Panel */}
              {isFullScreen3D && !isIsolationExplorerHidden && (
                <div className="absolute top-28 right-5 z-40 bg-neutral-950/95 border border-neutral-850 p-4.5 rounded-xl flex flex-col gap-4 shadow-2xl backdrop-blur-md max-w-xs animate-in slide-in-from-right border-gold-400/15">
                  <div className="flex items-center gap-1.5 pb-1 border-b border-neutral-900">
                    <Settings size={12} className="text-[#C8A165]" />
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#C8A165]">
                      {language === 'bn' ? '৩ডি অ্যানালিটিক্স প্যানেল' : '3D Analytics Control'}
                    </span>
                  </div>
                  
                  {/* Explosion slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[9px] font-mono">
                      <span className="text-neutral-400 uppercase tracking-wider">{language === 'bn' ? 'ফ্লোর বিচ্ছিন্নকরণ' : 'Explode Levels'}</span>
                      <span className="text-gold-300 font-bold">{Math.round(explodeFactor * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={explodeFactor}
                      onChange={(e) => setExplodeFactor(Number(e.target.value))}
                      className="w-full accent-[#C8A165] cursor-pointer bg-neutral-955 h-1.5 rounded-lg appearance-none"
                    />
                  </div>

                  {/* Wireframe toggle */}
                  <div className="flex items-center justify-between border-t border-neutral-900 pt-2">
                    <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">
                      {language === 'bn' ? 'ওয়্যারফ্রেম' : 'Wireframe'}
                    </span>
                    <button
                      onClick={() => setWireframeMode(!wireframeMode)}
                      className={`px-2 py-1 rounded font-mono text-[8px] uppercase tracking-wider transition-all border ${
                        wireframeMode 
                          ? 'bg-gold-400 text-neutral-950 border-gold-400 font-bold shadow-md' 
                          : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                      }`}
                    >
                      {wireframeMode ? (language === 'bn' ? 'অন' : 'ON') : (language === 'bn' ? 'অফ' : 'OFF')}
                    </button>
                  </div>

                  {/* Solar light dropdown/buttons */}
                  <div className="space-y-1.5 border-t border-neutral-900 pt-2">
                    <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider block">
                      {language === 'bn' ? 'আলোর সিমুলেশন' : 'Lighting Path'}
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: 'noon', label: 'Noon', labelBn: 'দুপুর' },
                        { id: 'morning', label: 'Morning', labelBn: 'সকাল' },
                        { id: 'dusk', label: 'Dusk', labelBn: 'সন্ধ্যা' },
                        { id: 'midnight', label: 'Midnight', labelBn: 'রাত' }
                      ].map((light) => (
                        <button
                          key={light.id}
                          onClick={() => setLightingMode(light.id as any)}
                          className={`py-1.5 rounded font-mono text-[7.5px] uppercase tracking-wider transition-all border ${
                            lightingMode === light.id
                              ? 'bg-[#1B4D3E] text-white border-[#C8A165]/50 shadow-md font-bold'
                              : 'bg-neutral-950 text-neutral-400 border-neutral-850 hover:bg-neutral-900 hover:text-white'
                          }`}
                        >
                          {language === 'bn' ? light.labelBn : light.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* INTERACTIVE CONTROLS HUD LEGEND */}
              {!isPureView && !isIsolationExplorerHidden && (
                <div className="absolute bottom-5 left-5 z-50 bg-neutral-950/90 border border-neutral-850 px-4 py-3 rounded-lg flex flex-col gap-2 shadow-2xl backdrop-blur-md max-w-xs animate-in slide-in-from-bottom border-gold-400/15">
                  <div className="flex items-center gap-2 pb-1 border-b border-neutral-900">
                    <Compass className="w-3.5 h-3.5 text-[#C8A165]" />
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#C8A165]">3D Navigation HUD</span>
                  </div>
                  <div className="space-y-1.5 text-[9px] font-mono text-neutral-400">
                    <div className="flex items-center gap-2 justify-between">
                      <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 font-sans font-bold text-white text-[8px] uppercase">Left Click & Drag</span>
                      <span>Orbit view</span>
                    </div>
                    <div className="flex items-center gap-2 justify-between">
                      <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 font-sans font-bold text-white text-[8px] uppercase">Right Click & Drag</span>
                      <span>Pan scene</span>
                    </div>
                    <div className="flex items-center gap-2 justify-between">
                      <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 font-sans font-bold text-white text-[8px] uppercase">Scroll Wheel</span>
                      <span>Zoom in / out</span>
                    </div>
                  </div>
                  <div className="text-[7.5px] text-neutral-500 font-light font-sans mt-0.5 leading-normal">
                    Double-click elements to focus orbital pivot. Press Close to return.
                  </div>
                </div>
              )}

              <div className="absolute bottom-5 right-5 pointer-events-none bg-neutral-950/80 border border-neutral-800 text-[9px] font-mono uppercase tracking-widest px-3 py-1.5 rounded text-neutral-400">
                Press [Esc] or click Close to Return
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative background grids & elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-400/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-neutral-800/10 rounded-full filter blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-neutral-900" />

      <motion.div 
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-6 md:px-12 relative z-10"
      >
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="font-mono text-xs text-gold-400 tracking-[0.3em] uppercase block mb-3">
            ARCHITECTURAL DESIGN & ANALYTICS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight leading-none mb-4">
            The {projName} Matrix
          </h2>
          <div className="w-16 h-[1px] bg-gold-400 mb-6" />
          <p className="font-sans text-neutral-400 font-light text-sm md:text-base leading-relaxed">
            {projName} is strategically seated over a **{landAreaVal}** premium land plot. The development comprises **{apartmentsVal}** across **{heightVal}**, maintaining a highly exclusive architectural footprint. Select between typical floor drawings or our interactive statistics chart below.
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={() => {
                setLayoutViewMode('blueprint');
                setTimeout(() => {
                  const element = document.getElementById("floorplan");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }, 100);
              }}
              className="px-5 py-2.5 bg-gold-400 hover:bg-gold-300 text-neutral-950 rounded font-mono text-[10px] font-bold uppercase tracking-wider transition-all inline-flex items-center gap-2 group cursor-pointer hover:shadow-lg active:scale-98"
            >
              <span>{isBangla ? "ডিজিটাল ব্লুপ্রিন্ট ও অ্যাপার্টমেন্ট ম্যাপ" : "Access Live Blueprint & Suite Map"}</span>
              <span className="group-hover:translate-x-1.5 transition-transform duration-300">&rarr;</span>
            </button>
          </div>
        </div>

        {/* View Mode Switch Row */}
        <div className="mb-10 flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center border-b border-neutral-900 pb-6">
          <div className="p-1 bg-neutral-900/85 rounded-lg inline-flex flex-wrap gap-1 border border-neutral-850 relative">
            {[
              { id: 'three3d', label: 'Interactive 3D Model', icon: <Building2 size={13} /> },
              { id: 'blueprint', label: 'Floor Blueprint (CAD)', icon: <Layout size={13} /> },
              { id: 'analytics', label: `${totalFlatsCount}-Flat & ${parsedKatha} Katha Analytics`, icon: <TrendingUp size={13} /> }
            ].map((tab) => {
              const isActive = layoutViewMode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setLayoutViewMode(tab.id as any)}
                  className={`px-4 py-2 rounded text-xs font-mono transition-all duration-300 uppercase tracking-wider cursor-pointer flex items-center gap-2 relative z-10 ${
                    isActive ? 'text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeLayoutTab"
                      className="absolute inset-0 bg-gold-400 rounded shadow-md"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      style={{ zIndex: -1 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex gap-4 text-xs font-mono text-neutral-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
              <span>{availableCount} Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-500" />
              <span>{reservedCount} Reserved</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-neutral-700" />
              <span>{soldCount} Sold</span>
            </div>
          </div>
        </div>

        {/* VIEW 0: 3D INTERACTIVE BUILD MASTER MODEL */}
        {layoutViewMode === 'three3d' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start duration-500 animate-in fade-in mb-16">
            {/* 3D CANVAS PORT */}
            <div className="lg:col-span-8 bg-neutral-900/40 rounded-xl border border-neutral-850 overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-500">
              {/* HUD Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-neutral-850 bg-neutral-950/70 gap-3">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${is3DModelHidden ? 'bg-red-500' : 'bg-gold-400 animate-pulse'}`} />
                  <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                    MODEL RENDER PORT // {is3DModelHidden ? 'STRUCTURE HIDDEN' : 'ISOLATED 3D'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {/* AUTO-PLAY TOUR TOGGLE */}
                  <div className="flex items-center gap-2 px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded font-mono text-[9px] text-neutral-400">
                    <span className="uppercase text-[8px] tracking-wider text-neutral-500">Auto-Play Tour</span>
                    <button
                      onClick={() => {
                        const nextAuto = !isAutoPlay;
                        setIsAutoPlay(nextAuto);
                      }}
                      className={`relative inline-flex h-4 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isAutoPlay ? 'bg-gold-400/80' : 'bg-neutral-800'}`}
                    >
                      <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-neutral-950 shadow ring-0 transition duration-200 ease-in-out ${isAutoPlay ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                    {isAutoPlay && (
                      <span className="text-gold-400 text-[8px] font-bold">
                        {Math.max(0, ((5500 - (autoShowProgress / 100 * 5500)) / 1000)).toFixed(1)}s
                      </span>
                    )}
                  </div>

                  {/* HIDE 3D TOWER BUTTON */}
                  <button
                    onClick={toggleHideTower}
                    className={`p-1.5 px-3 rounded font-mono text-[9px] uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 border ${is3DModelHidden ? 'bg-gold-400/10 text-gold-300 border-gold-400' : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:text-white hover:bg-neutral-800'}`}
                    title={is3DModelHidden ? 'Restore Tower Envelope Mesh' : 'Conceal Tower Envelope Mesh to Show Setbacks'}
                  >
                    {is3DModelHidden ? (
                      <>
                        <svg className="w-3 h-3 text-gold-400 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Show 3D Tower
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21" />
                        </svg>
                        Hide 3D Tower
                      </>
                    )}
                  </button>

                  {/* TOGGLE INNER HUD EXPLORER */}
                  <button
                    onClick={() => setIsIsolationExplorerHidden(!isIsolationExplorerHidden)}
                    className={`p-1.5 px-3 rounded font-mono text-[9px] uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 border ${isIsolationExplorerHidden ? 'bg-amber-950/90 text-amber-300 border-amber-600/50' : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:text-white hover:bg-neutral-850'}`}
                    title={isIsolationExplorerHidden ? 'Show Inner Overlay' : 'Hide Inner Overlay to enable Hide & Seek'}
                  >
                    {isIsolationExplorerHidden ? "HUD Hidden" : "Hide HUD Overlay"}
                  </button>

                  {/* CINEMATIC FULLSCREEN */}
                  <button 
                    onClick={() => setIsFullScreen3D(true)}
                    className="p-1.5 px-3 rounded bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 hover:bg-neutral-800 transition-all cursor-pointer flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-xs"
                    title="Engage Cinematic Screen"
                  >
                    <svg className="w-3 h-3 text-gold-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h6m0 0v6m0-6L14 10M9 21H3m0 0v-6m0 6l7-7" />
                    </svg>
                    Cinematic Fullscreen
                  </button>
                </div>
              </div>

              {/* WebGL Hosting */}
              <div className="w-full relative h-[380px] sm:h-[450px] md:h-[500px] lg:h-[600px] bg-neutral-950">
                {isLoading3D && (
                  <div className="absolute inset-0 z-40 bg-neutral-950 flex flex-col items-center justify-center p-8 text-center overflow-hidden">
                    <style>{`
                      @keyframes progressSweep {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(200%); }
                      }
                    `}</style>
                    {/* Pulsing blueprint grid mockup */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.015)_1px,transparent_1px)] bg-[size:25px_25px] opacity-70 pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col items-center max-w-sm w-full space-y-6">
                      {/* Logo wireframe pulsing skeleton */}
                      <div className="relative">
                        <div className="w-20 h-20 border-t border-b border-l border-r border-gold-400/20 rounded-full flex items-center justify-center animate-ping duration-1000 opacity-20 absolute inset-0" />
                        <div className="w-20 h-20 border border-gold-400/30 rounded-full flex items-center justify-center bg-neutral-900 shadow-[0_0_20px_rgba(212,175,55,0.05)]">
                          <Compass className="text-gold-400 rotate-45 animate-pulse" size={32} />
                        </div>
                      </div>

                      {/* Skeleton Text */}
                      <div className="w-full space-y-3">
                        <div className="h-5 bg-neutral-900 border border-neutral-850 rounded w-3/4 mx-auto animate-pulse flex items-center justify-center">
                          <span className="text-[10px] font-serif text-gold-300 font-semibold tracking-wider uppercase">Loading 3D Engine</span>
                        </div>
                        <div className="h-3 bg-neutral-900 border border-neutral-850 rounded w-5/6 mx-auto animate-pulse" />
                        <div className="h-2.5 bg-neutral-900 border border-neutral-850 rounded w-1/2 mx-auto animate-pulse" />
                      </div>

                      {/* Sophisticated glowing linear progress bar */}
                      <div className="w-full">
                        <div className="h-[2px] w-full bg-neutral-900 border border-neutral-850 rounded-full overflow-hidden relative">
                          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-gold-400 to-transparent w-1/2 h-full rounded-full" style={{ animation: "progressSweep 1.8s ease-in-out infinite" }} />
                        </div>
                        <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500 uppercase tracking-widest mt-2 select-none">
                          <span>WebGL Core</span>
                          <span className="animate-pulse">Active Shader Bindings</span>
                          <span>96.4%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {is3DModelHidden && (
                  <div className="absolute inset-x-4 top-4 z-30 p-4 rounded bg-neutral-950/90 border border-gold-400/20 shadow-2xl backdrop-blur-md max-w-sm duration-300 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold-400/10 flex items-center justify-center border border-gold-400/30 shrink-0 text-gold-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-mono text-[9px] font-bold uppercase tracking-widest text-gold-300">Unobstructed Plot Active</h4>
                        <p className="text-[10px] text-neutral-400 font-light mt-1 leading-normal leading-relaxed">
                          Concealing the tower envelope to expose the full building setback parameters on the 10-Katha landscape plate.
                        </p>
                        
                        {isAutoPlay ? (
                          <div className="mt-3">
                            <div className="flex justify-between items-center text-[8px] font-mono text-neutral-500 uppercase tracking-widest mb-1">
                              <span>Auto-Play Reveal Active</span>
                              <span className="text-gold-400 font-bold">
                                {Math.max(0, ((4000 - (autoShowProgress / 100 * 4000)) / 1000)).toFixed(1)}s
                              </span>
                            </div>
                            <div className="w-full h-0.5 bg-neutral-900 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gold-400 transition-all duration-100 ease-linear" 
                                style={{ width: `${autoShowProgress}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() => setIs3DModelHidden(false)}
                              className="text-[8px] font-mono text-gold-400 hover:text-white uppercase tracking-wider bg-neutral-900 border border-neutral-800 hover:border-gold-400/40 px-2.5 py-1 rounded transition-all cursor-pointer"
                            >
                              Show Tower
                            </button>
                            <button
                              onClick={() => {
                                setIsAutoPlay(true);
                                // Trigger automated cycles
                                setIs3DModelHidden(false);
                                setTimeout(() => {
                                  toggleHideTower();
                                }, 50);
                              }}
                              className="text-[8px] font-mono text-neutral-500 hover:text-neutral-300 uppercase tracking-wider px-1 py-1 transition-all cursor-pointer"
                            >
                              Enable Auto-Play
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <iframe
                  id="abrar-3d-iframe"
                  title="3D Architectural Model"
                  className="w-full h-full border-none bg-neutral-950 block"
                  referrerPolicy="no-referrer"
                  srcDoc={getArchitectural3DHtmlBlock(currentProj, language)}
                  onLoad={(e) => {
                    setIsLoading3D(false);
                    try {
                      const iframe = e.currentTarget;
                      if (iframe.contentWindow) {
                        iframe.contentWindow.dispatchEvent(new Event('resize'));
                        // Sync current state on load
                        iframe.contentWindow.postMessage({ type: 'toggle-tower-visibility', visible: !is3DModelHidden }, '*');
                        iframe.contentWindow.postMessage({ type: 'set-explode-factor', factor: explodeFactor }, '*');
                        iframe.contentWindow.postMessage({ type: 'toggle-wireframe', wireframe: wireframeMode }, '*');
                        iframe.contentWindow.postMessage({ type: 'simulate-lighting', lightMode: lightingMode }, '*');
                      }
                    } catch (err) {
                      console.warn(err);
                    }
                  }}
                />
              </div>
            </div>

            {/* SIDEBAR DESCRIPTION CONTROLS */}
            <div className="lg:col-span-4 bg-neutral-900/30 p-6 rounded-xl border border-neutral-850 self-stretch flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <Sparkles size={11} className="text-gold-400 animate-pulse" />
                  <span className="font-mono text-[9px] text-gold-400 uppercase tracking-widest leading-none">
                    3D SPECIFICATION LOG
                  </span>
                </div>

                {/* Dynamic Content based on selectedThreeStep */}
                {selectedThreeStep === 'all' && (
                  <div className="animate-in fade-in duration-300">
                    <h3 className="font-serif text-xl font-normal text-white mb-3">Full Master Plan Grid</h3>
                    <div className="text-xs text-neutral-400 font-sans leading-relaxed space-y-3 font-light mb-4">
                      <p>
                        {projName} stands as a signature architectural pride, designed meticulously to accommodate luxury family living in Dhaka's premier location.
                      </p>
                      <p>
                        Strategically seated on a premier **{landAreaVal}** real estate base, the structural outline maximizes daylight penetration and natural Dhaka delta ventilation.
                      </p>
                    </div>
                    <div className="p-3 bg-neutral-950/80 rounded border border-neutral-850 text-[11px] font-mono space-y-1.5 text-neutral-400">
                      <div className="flex justify-between">
                        <span>HEIGHT:</span>
                        <span className="text-white font-bold">{heightVal.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>RESIDENCES:</span>
                        <span className="text-white font-bold">{apartmentsVal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>PLOT REGISTRY:</span>
                        <span className="text-white font-bold">{landAreaVal}</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedThreeStep === 'step1' && (
                  <div className="animate-in fade-in duration-300">
                    <h3 className="font-serif text-xl font-normal text-white mb-3">Plot Boundaries & Setbacks</h3>
                    <div className="text-xs text-neutral-400 font-sans leading-relaxed space-y-3 font-light mb-4">
                      <p>
                        Displays the true 10-Katha plot wireframe boundary. Rajuk building compliance mandates a **maximum ground coverage (MGC) of 60%**.
                      </p>
                      <p>
                        An intentional **20% side & rear setback** of 1,440 sq ft acts as a natural wind microclimate, driving cross breezes and securing clear emergency exit passageways.
                      </p>
                    </div>
                    <div className="p-3 bg-neutral-950/80 rounded border border-neutral-850 text-[11px] font-mono space-y-1.5 text-neutral-400">
                      <div className="flex justify-between">
                        <span>MAX COVERAGE (60%):</span>
                        <span className="text-white font-semibold">4,320 SQ FT</span>
                      </div>
                      <div className="flex justify-between">
                        <span>PLOT SETBACKS (20%):</span>
                        <span className="text-emerald-400 font-semibold font-bold">1,440 SQ FT</span>
                      </div>
                      <div className="flex justify-between">
                        <span>COMPLIANCE INDEX:</span>
                        <span className="text-white font-mono">100% RAJUK STANDARD</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedThreeStep === 'step2' && (
                  <div className="animate-in fade-in duration-300">
                    <h3 className="font-serif text-xl font-normal text-white mb-3">Tapering Structure Matrix</h3>
                    <div className="text-xs text-neutral-400 font-sans leading-relaxed space-y-3 font-light mb-4">
                      <p>
                        Witness the core cast-in-situ columns grid. Columns taper inward dynamically from **1.3m on Level 1-3** down to **0.8m limit above Level 7**.
                      </p>
                      <p>
                        This advanced tapering ensures supreme heavy-load seismic dampening on lower layers, while expanding the net habitable room volumes for upper-level buyers.
                      </p>
                    </div>
                    <div className="p-3 bg-neutral-950/80 rounded border border-neutral-850 text-[11px] font-mono space-y-1.5 text-neutral-400">
                      <div className="flex justify-between">
                        <span>LOWER PILLARS (L1-L3):</span>
                        <span className="text-white">1.3m Depth Frame</span>
                      </div>
                      <div className="flex justify-between">
                        <span>UPPER PILLARS (L7+):</span>
                        <span className="text-white">0.8m Light Frame</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SEISMIC LEVEL:</span>
                        <span className="text-gold-400 font-semibold font-bold">BNBC Zone-2 Dhaka</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedThreeStep === 'step3' && (
                  <div className="animate-in fade-in duration-300">
                    <h3 className="font-serif text-xl font-normal text-white mb-3">Concrete Circulation Hub</h3>
                    <div className="text-xs text-neutral-400 font-sans leading-relaxed space-y-3 font-light mb-4">
                      <p>
                        The building's mechanical and central vertical circulation spine, styled here in bright commercial Royal Blue.
                      </p>
                      <p>
                        Guards dual high-speed elevators (Express Lifts), pressurized backup fire escape stairs, and utility riser ducts, providing 40dB acoustic containment.
                      </p>
                    </div>
                    <div className="p-3 bg-neutral-950/80 rounded border border-neutral-850 text-[11px] font-mono space-y-1.5 text-neutral-400">
                      <div className="flex justify-between">
                        <span>ELEVATOR COPIES:</span>
                        <span className="text-white">2 x High-Speed Traction</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ACOUSTIC SHIELD:</span>
                        <span className="text-white">9-inch Concrete Wall</span>
                      </div>
                      <div className="flex justify-between">
                        <span>EMERGENCY ACCESS:</span>
                        <span className="text-gold-400 font-semibold font-bold">Fire-Rated Stairs</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedThreeStep === 'step4' && (
                  <div className="animate-in fade-in duration-300">
                    <h3 className="font-serif text-xl font-normal text-white mb-3">Bespoke Floor Splitting</h3>
                    <div className="text-xs text-neutral-400 font-sans leading-relaxed space-y-3 font-light mb-4">
                      <p>
                        {projName} maintains the absolute limit in privacy by featuring only 4 units per level, with zero shared common suite walls.
                      </p>
                      <div className="space-y-2 pt-2 text-[11px] font-mono border-t border-neutral-800">
                        <div className="flex gap-2 items-center">
                          <span className="w-2.5 h-2.5 rounded bg-[#d4af37] shrink-0" />
                          <span className="text-neutral-300">Units A & B (920 sqft): South Facing</span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <span className="w-2.5 h-2.5 rounded bg-[#a855f7] shrink-0" />
                          <span className="text-neutral-300">Units C & D (880 sqft): Quiet North Corner</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedThreeStep === 'step5' && (
                  <div className="animate-in fade-in duration-300">
                    <h3 className="font-serif text-xl font-normal text-white mb-3">Parking & Utility Bays</h3>
                    <div className="text-xs text-neutral-400 font-sans leading-relaxed space-y-3 font-light mb-4">
                      <p>
                        Designed as a highly secure entrance bay. Features exactly 10 spacious car parking slots, heavy security gated barriers, and a professional reception lobby.
                      </p>
                      <p>
                        Features a dedicated fire substation segment and high-voltage generator zone isolated to the rear plot quadrant.
                      </p>
                    </div>
                    <div className="p-3 bg-neutral-950/80 rounded border border-neutral-850 text-[11px] font-mono space-y-1.5 text-neutral-400">
                      <div className="flex justify-between">
                        <span>COVERED PARKING:</span>
                        <span className="text-white">10 Allowed Bays</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SUBSTATION:</span>
                        <span className="text-white">100 KVA Generator Room</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedThreeStep === 'step6' && (
                  <div className="animate-in fade-in duration-300">
                    <h3 className="font-serif text-xl font-normal text-white mb-3">Roof Green Oasis</h3>
                    <div className="text-xs text-neutral-400 font-sans leading-relaxed space-y-3 font-light mb-4">
                      <p>
                        An exquisite community sky sanctuary designed with dense botanical setups that naturally cool the entire building's structure.
                      </p>
                      <p>
                        Equipped with elegant timber pergolas, beautiful surrounding tempered glass protective panels, and seating spaces for community socials.
                      </p>
                    </div>
                    <div className="p-3 bg-neutral-950/80 rounded border border-neutral-850 text-[11px] font-mono space-y-1.5 text-neutral-400">
                      <div className="flex justify-between">
                        <span>ROOF TURF LAYER:</span>
                        <span className="text-[#10b981] font-bold">Insulated Thermal Lawn</span>
                      </div>
                      <div className="flex justify-between">
                        <span>PROTECTIVE BALUSTRADE:</span>
                        <span className="text-white">Tempered Safety Glass</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3D INTERACTIVE SIMULATION CONTROLS */}
              <div className="mt-6 pt-6 border-t border-neutral-850 space-y-5">
                <h4 className="font-mono text-[9px] text-[#C8A165] uppercase tracking-widest font-black flex items-center gap-1.5">
                  <Settings size={12} className="text-[#C8A165]" />
                  {language === 'bn' ? 'সিমুলেশন কন্ট্রোল প্যানেল' : 'Simulation Control Console'}
                </h4>
                
                {/* Control 1: Floor Explosion */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-neutral-400 uppercase tracking-wider">{language === 'bn' ? 'ফ্লোর বিচ্ছিন্নকরণ' : 'Explode Levels'}</span>
                    <span className="text-gold-300 font-bold">{Math.round(explodeFactor * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={explodeFactor}
                    onChange={(e) => setExplodeFactor(Number(e.target.value))}
                    className="w-full accent-[#C8A165] cursor-pointer bg-neutral-950 h-1.5 rounded-lg appearance-none"
                  />
                  <span className="text-[8px] text-neutral-500 font-light block leading-normal">
                    {language === 'bn' ? 'ভবনের প্রতিটি ফ্লোরকে উলম্বভাবে পৃথক করে দেখতে স্লাইডারটি ব্যবহার করুন।' : 'Expand building vertically to analyze internal structural slab separations.'}
                  </span>
                </div>

                {/* Control 2: Wireframe Mode */}
                <div className="flex items-center justify-between py-2 border-t border-neutral-850/40">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                      {language === 'bn' ? 'ওয়্যারফ্রেম মোড' : 'Wireframe Structure'}
                    </span>
                    <span className="text-[8.5px] text-neutral-500 block">
                      {language === 'bn' ? 'লোহা ও কাঠামোগত জাল দৃশ্যমান করুন' : 'Render underlying structural mesh wireframe'}
                    </span>
                  </div>
                  <button
                    onClick={() => setWireframeMode(!wireframeMode)}
                    className={`px-3 py-1.5 rounded font-mono text-[9px] uppercase tracking-wider transition-all border ${
                      wireframeMode 
                        ? 'bg-gold-400 text-neutral-950 border-gold-400 font-bold shadow-md' 
                        : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                    }`}
                  >
                    {wireframeMode ? (language === 'bn' ? 'সক্রিয়' : 'Active') : (language === 'bn' ? 'নিষ্ক্রিয়' : 'Inactive')}
                  </button>
                </div>

                {/* Control 3: Solar Simulation */}
                <div className="space-y-2 border-t border-neutral-850/40 pt-3">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                    {language === 'bn' ? 'সূর্যপথের আলো অনুকরণ' : 'Solar Light Simulation'}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'noon', label: 'Noon Sun', labelBn: 'মধ্যাহ্ন সূর্য' },
                      { id: 'morning', label: 'Morning Sun', labelBn: 'ভোরবেলা' },
                      { id: 'dusk', label: 'Dusk Ambient', labelBn: 'গোধূলি আলো' },
                      { id: 'midnight', label: 'Midnight Glow', labelBn: 'মধ্যরাত' }
                    ].map((light) => (
                      <button
                        key={light.id}
                        onClick={() => setLightingMode(light.id as any)}
                        className={`py-2 rounded font-mono text-[8px] uppercase tracking-wider transition-all border ${
                          lightingMode === light.id
                            ? 'bg-[#1B4D3E] text-white border-[#C8A165]/50 shadow-md font-bold'
                            : 'bg-neutral-950 text-neutral-400 border-neutral-850 hover:bg-neutral-900 hover:text-white'
                        }`}
                      >
                        {language === 'bn' ? light.labelBn : light.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <a 
                  href="#contact"
                  className="w-full text-center block px-4 py-3 bg-neutral-950 hover:bg-neutral-900 border border-gold-400/20 hover:border-gold-400/50 rounded font-mono text-2xs uppercase tracking-widest text-gold-300 font-semibold transition-all cursor-pointer"
                >
                  Book A Consult Now
                </a>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 1: INTERACTIVE BLUEPRINT PANEL */}
        {layoutViewMode === 'blueprint' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            
            {/* LIFT CONTROL & VERTICAL STACK */}
            {!isMaximizedBlueprint && (
              <div className="xl:col-span-3 bg-neutral-900/30 p-5 rounded-xl border border-neutral-850 flex flex-col gap-6">
              
              <div>
                <span className="font-mono text-[9px] tracking-widest text-[#777] uppercase block mb-3">
                  VERTICAL ELEVATION SHAFT
                </span>
                {/* Virtual Lift HUD */}
                <div className="bg-neutral-950/90 rounded-lg border border-neutral-850 p-4 font-mono text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gold-400/50 animate-pulse" />
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-neutral-400 uppercase">ELEVATOR CAR</span>
                    <span className="text-[10px] text-green-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> SYSTEM READY
                    </span>
                  </div>
                  
                  {/* Virtual elevator motion block */}
                  <div className="my-4 flex items-center justify-center gap-4">
                    <ArrowUp 
                      size={20} 
                      className={`transition-all duration-300 ${
                        liftState.direction === 'up' ? 'text-gold-400 translate-y-[-4px] animate-pulse' : 'text-neutral-800'
                      }`} 
                    />
                    <div className="bg-neutral-900 px-4 py-2 border border-neutral-800 rounded font-serif text-3xl font-extrabold tracking-widest text-white min-w-[70px]">
                      {liftState.isMoving ? (
                        <span className="animate-pulse">{liftState.targetFloor === 0 ? 'GF' : `0${liftState.targetFloor}`}</span>
                      ) : (
                        selectedFloor === 0 ? 'GF' : `0${selectedFloor}`
                      )}
                    </div>
                    <ArrowDown 
                      size={20} 
                      className={`transition-all duration-300 ${
                        liftState.direction === 'down' ? 'text-gold-400 translate-y-[4px] animate-pulse' : 'text-neutral-800'
                      }`} 
                    />
                  </div>

                  <div className="text-[9px] text-neutral-500 uppercase tracking-widest">
                    {liftState.isMoving ? 'Ascending/Descending Shaft...' : 'Locked At Floor Lobby'}
                  </div>
                </div>
              </div>

              {/* Vertical level selector stack */}
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-neutral-850 pb-2">
                  <span className="font-mono text-[9px] tracking-widest text-neutral-500 uppercase">
                    SELECT BUILDING LAYER
                  </span>
                  
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-mono text-neutral-400">JUMP:</span>
                    <select
                      value={selectedFloor}
                      onChange={(e) => setSelectedFloor(Number(e.target.value))}
                      className="bg-neutral-950 border border-neutral-800 rounded px-1.5 py-0.5 text-[10px] font-mono text-gold-300 focus:outline-none focus:border-gold-400 cursor-pointer"
                    >
                      {[9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map((lvl) => (
                        <option key={lvl} value={lvl} className="bg-neutral-900 text-white">
                          {lvl === 0 ? 'Ground' : `Level 0${lvl}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 max-h-[360px] overflow-y-auto pr-1">
                  {[9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map((lvl) => {
                    const isActive = selectedFloor === lvl;
                    return (
                      <button
                        key={lvl}
                        onClick={() => setSelectedFloor(lvl)}
                        className={`w-full py-2 px-3 rounded text-left font-mono text-xs transition-all duration-200 flex items-center justify-between cursor-pointer border ${
                          isActive
                            ? 'bg-gold-400 text-neutral-950 font-semibold border-gold-400 shadow-md'
                            : 'bg-neutral-950/40 text-neutral-400 border-neutral-900 hover:text-white hover:border-neutral-800 hover:bg-neutral-900/40'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Building2 size={12} className={isActive ? 'text-neutral-950' : 'text-neutral-500'} />
                          <span>{lvl === 0 ? 'Ground level (GF)' : `Level 0${lvl}`}</span>
                        </div>
                        <span className={`text-[9px] uppercase font-sans ${isActive ? 'text-neutral-900 font-bold' : 'text-gold-400/80'}`}>
                          {lvl === 0 ? 'Lobby / Park' : '4 Corner Flats'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
            )}

            {/* INTERACTIVE CAD BLUEPRINT CANVAS */}
            <div className={`${isMaximizedBlueprint ? 'xl:col-span-12' : 'xl:col-span-6'} bg-neutral-900/60 p-6 rounded-xl border border-neutral-850 flex flex-col justify-between self-stretch relative transition-all duration-300`}>
              <div>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4 border-b border-neutral-850 pb-4">
                  <div>
                    <h3 className="font-serif text-lg text-white font-medium">
                      {getFloorName(selectedFloor)} Blueprint View
                    </h3>
                    <p className="text-[10px] text-neutral-500 font-mono mt-0.5 uppercase tracking-wider">
                      10 Katha Land Footprint // Rajuk Code Compliant
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] bg-neutral-950 text-neutral-400 px-2.5 py-1 rounded font-mono border border-neutral-850 uppercase tracking-widest">
                      Typical CAD Layout
                    </span>
                    <button
                      onClick={() => setIsMaximizedBlueprint(!isMaximizedBlueprint)}
                      className="p-1 px-2 py-1 rounded bg-neutral-950 hover:bg-neutral-900 text-[#C8A165] hover:text-white border border-neutral-850 transition-all cursor-pointer flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider"
                      title={isMaximizedBlueprint ? "Minimize Blueprint Workspace" : "Maximize Blueprint Workspace"}
                    >
                      {isMaximizedBlueprint ? (
                        <>
                          <Minimize size={10} className="text-gold-400" />
                          <span>Restore</span>
                        </>
                      ) : (
                        <>
                          <Maximize size={10} className="text-gold-400" />
                          <span>Maximize</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* SVG Blueprint Design */}
                <div 
                  onMouseMove={handleMouseMove}
                  className="relative border border-neutral-850 bg-neutral-950 rounded-lg p-6 max-w-[460px] mx-auto overflow-hidden transition-all duration-300"
                >
                  <svg
                    viewBox="0 0 500 500"
                    className="w-full h-auto text-neutral-300 select-none transition-transform duration-500 origin-center"
                    style={{ maxHeight: '100%', maxWidth: '100%' }}
                  >
                    <defs>
                      <pattern id="card-blueprint-grid" width="25" height="25" patternUnits="userSpaceOnUse">
                        <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#161616" strokeWidth="0.8" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#card-blueprint-grid)" />

                    {/* Outer building boundaries */}
                    <rect x="20" y="20" width="460" height="460" fill="none" stroke="#333" strokeWidth="2.5" />

                    {/* Central Lift & Stairs Circulation Hub */}
                    <g id="blueprint-stairs-lift">
                      <rect x="180" y="180" width="140" height="140" fill="#141414" stroke="#444" strokeWidth="1.5" />
                      
                      {/* Double elevator system */}
                      <rect x="190" y="190" width="23" height="50" fill={liftState.isMoving ? '#211d17' : '#181818'} stroke={liftState.isMoving ? '#d4af37' : '#555'} strokeWidth="1" />
                      <line x1="201" y1="190" x2="201" y2="240" stroke="#444" strokeWidth="0.5" />
                      <text x="201" y="220" textAnchor="middle" className="font-mono text-[7px]" fill={liftState.isMoving ? '#d4af37' : '#666'}>L1</text>

                      <rect x="217" y="190" width="23" height="50" fill={liftState.isMoving ? '#211d17' : '#181818'} stroke={liftState.isMoving ? '#d4af37' : '#555'} strokeWidth="1" />
                      <text x="228" y="220" textAnchor="middle" className="font-mono text-[7px]" fill={liftState.isMoving ? '#d4af37' : '#666'}>L2</text>

                      {/* Main Emergency Stairwell */}
                      <rect x="255" y="190" width="55" height="50" fill="#1c1c1c" stroke="#555" strokeWidth="1" />
                      {[196, 203, 210, 217, 224, 231, 238].map((sy) => (
                        <line key={sy} x1="255" y1={sy} x2="310" y2={sy} stroke="#333" strokeWidth="0.8" />
                      ))}
                      <text x="282" y="218" textAnchor="middle" className="font-mono text-[5px]" fill="#666">STAIRWELL</text>

                      {/* Corridor lobby walkway */}
                      <rect x="180" y="280" width="140" height="40" fill="#1b1b1b" stroke="#333" strokeWidth="1" />
                      <text x="250" y="303" textAnchor="middle" className="font-mono text-[8px]" fill="#888">COMMON LOBBY</text>
                    </g>

                    {/* Ground Floor visual details */}
                    {selectedFloor === 0 && (
                      <g id="gf-parking-spots">
                        <rect x="28" y="28" width="130" height="130" fill="rgba(212,175,55,0.02)" stroke="#b8946f" strokeWidth="1" strokeDasharray="3,3" />
                        <text x="93" y="90" textAnchor="middle" className="font-serif text-[10px]" fill="#d4af37">RECEPTION DESK</text>
                        <text x="93" y="105" textAnchor="middle" className="font-mono text-[6px]" fill="#666">Common Entrance Lounge</text>

                        {/* Covered parking spaces representing 10 slots */}
                        <rect x="340" y="28" width="130" height="130" fill="#171717" stroke="#444" strokeWidth="1" />
                        <text x="405" y="93" textAnchor="middle" className="font-serif text-[10px]" fill="#ccc">Substation Hub</text>

                        {/* Left & Right driveways on the 10 Katha layout */}
                        <rect x="28" y="325" width="132" height="132" fill="#111" stroke="#333" strokeWidth="1" />
                        <text x="94" y="390" textAnchor="middle" className="font-mono text-[8px]" fill="#555">PARKING SPOTS P1-P4</text>

                        <rect x="340" y="325" width="132" height="132" fill="#111" stroke="#333" strokeWidth="1" />
                        <text x="406" y="390" textAnchor="middle" className="font-mono text-[8px]" fill="#555">PARKING SPOTS P5-P8</text>
                      </g>
                    )}

                    {/* Residential Levels 1 to 9 (4 corners: A, B, C, D) */}
                    {selectedFloor > 0 && (
                      <g id="residential-apartment-cores">
                        {/* Unit A: South-West Corner (Front) */}
                        <g 
                          onClick={() => handleSelectFlatDetail(selectedFloor, 'A')}
                          onMouseEnter={() => {
                            setHoveredZone('A');
                            setIsHoveringUnit(true);
                            const dat = bespokeUnits.find(u => u.id === 'A')!;
                            setHoveredUnitData(dat);
                            setHoveredStatus(getFlatStatus(selectedFloor, 'A'));
                          }}
                          onMouseLeave={() => {
                            setHoveredZone(null);
                            setIsHoveringUnit(false);
                            setHoveredUnitData(null);
                          }}
                          className="cursor-pointer transition-all duration-300 transform hover:scale-[1.015] origin-bottom-left"
                        >
                          <rect 
                            x="25" 
                            y="320" 
                            width="145" 
                            height="145" 
                            fill={selectedUnitId === 'A' ? 'rgba(212,175,55,0.12)' : hoveredZone === 'A' ? 'rgba(212,175,55,0.04)' : '#161616'} 
                            stroke={selectedUnitId === 'A' ? '#d4af37' : hoveredZone === 'A' ? '#b8946f' : '#2e2e2e'} 
                            strokeWidth="1.5"
                          />
                          {/* CAD Room Partitions for Unit A */}
                          <g stroke={selectedUnitId === 'A' ? 'rgba(212,175,55,0.45)' : '#2d2d2d'} strokeWidth="0.8" fill="none">
                            <line x1="25" y1="390" x2="90" y2="390" />
                            <line x1="90" y1="390" x2="90" y2="465" />
                            <line x1="25" y1="360" x2="65" y2="360" />
                            <line x1="65" y1="360" x2="65" y2="390" />
                            <line x1="90" y1="410" x2="135" y2="410" />
                            <line x1="135" y1="410" x2="135" y2="465" />
                            <line x1="65" y1="320" x2="65" y2="350" />
                            <line x1="25" y1="350" x2="95" y2="350" />
                            <line x1="135" y1="395" x2="170" y2="395" />
                            <line x1="135" y1="320" x2="135" y2="355" />
                          </g>
                          <g fill={selectedUnitId === 'A' ? '#d4af37' : '#777'} fontSize="4.5" fontFamily="monospace" textAnchor="middle" opacity="0.9">
                            <text x="57" y="425" fontWeight="bold">M. BED</text>
                            <text x="45" y="377">TOILET 1</text>
                            <text x="112" y="440">BED 2</text>
                            <text x="152" y="415">KITCHEN</text>
                            <text x="132" y="340" fontSize="5" fontWeight="bold">LIV / DINING</text>
                            <text x="80" y="337">TOILET 2</text>
                            <text x="17" y="425" fontSize="3.5">BALC</text>
                          </g>

                          <text x="97" y="365" textAnchor="middle" className="font-serif text-[9px] font-bold" fill={selectedUnitId === 'A' ? '#d4af37' : '#aaa'}>
                            Flat {selectedFloor}A
                          </text>
                          <text x="97" y="375" textAnchor="middle" className="font-mono text-[5px]" fill="#555">
                            920 SQ FT // 3 Bed 2 Bath
                          </text>

                          {/* Unit status tag visual circle */}
                          <circle cx="45" cy="340" r="3" fill={
                            getFlatStatus(selectedFloor, 'A') === 'Available' ? '#10b981' : 
                            getFlatStatus(selectedFloor, 'A') === 'Reserved' ? '#f59e0b' : '#3f3f46'
                          } />
                          <text x="52" y="342" className="font-mono text-[5.5px]" fill="#777">{getFlatStatus(selectedFloor, 'A')}</text>

                          {/* Interactive Room Hover Zones for Unit A */}
                          <g fill="transparent" stroke="transparent">
                            <rect 
                              x="25" y="390" width="65" height="75" 
                              className="hover:fill-gold-400/15 hover:stroke-gold-400 stroke-[1.5px] transition-all duration-200"
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setHoveredRoom({ name: "Master Bedroom", nameBn: "মাস্টার বেডরুম", sizeSqFt: 185 });
                              }}
                              onMouseLeave={() => setHoveredRoom(null)}
                            />
                            <rect 
                              x="25" y="350" width="40" height="40" 
                              className="hover:fill-gold-400/15 hover:stroke-gold-400 stroke-[1.5px] transition-all duration-200"
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setHoveredRoom({ name: "Master Attached Toilet", nameBn: "মাস্টার অ্যাটাচড বাথরুম", sizeSqFt: 45 });
                              }}
                              onMouseLeave={() => setHoveredRoom(null)}
                            />
                            <rect 
                              x="90" y="390" width="45" height="75" 
                              className="hover:fill-gold-400/15 hover:stroke-gold-400 stroke-[1.5px] transition-all duration-200"
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setHoveredRoom({ name: "Executive Suite Bed-2", nameBn: "এক্সিকিউটিভ স্যুট বেড-২", sizeSqFt: 140 });
                              }}
                              onMouseLeave={() => setHoveredRoom(null)}
                            />
                            <rect 
                              x="135" y="390" width="35" height="75" 
                              className="hover:fill-gold-400/15 hover:stroke-gold-400 stroke-[1.5px] transition-all duration-200"
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setHoveredRoom({ name: "Gourmet Kitchen Segment", nameBn: "প্রিমিয়াম রান্নাঘর", sizeSqFt: 65 });
                              }}
                              onMouseLeave={() => setHoveredRoom(null)}
                            />
                            <rect 
                              x="90" y="320" width="80" height="70" 
                              className="hover:fill-gold-400/15 hover:stroke-gold-400 stroke-[1.5px] transition-all duration-200"
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setHoveredRoom({ name: "Imperial Living & Dining Space", nameBn: "প্রধান ড্রইং ও ডাইনিং স্পেস", sizeSqFt: 380 });
                              }}
                              onMouseLeave={() => setHoveredRoom(null)}
                            />
                            <rect 
                              x="65" y="320" width="25" height="30" 
                              className="hover:fill-gold-400/15 hover:stroke-gold-400 stroke-[1.5px] transition-all duration-200"
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setHoveredRoom({ name: "Common Toilet Segment", nameBn: "সাধারণ বাথরুম", sizeSqFt: 40 });
                              }}
                              onMouseLeave={() => setHoveredRoom(null)}
                            />
                          </g>
                        </g>

                        {/* Unit B: South-East Corner (Front) */}
                        <g 
                          onClick={() => handleSelectFlatDetail(selectedFloor, 'B')}
                          onMouseEnter={() => {
                            setHoveredZone('B');
                            setIsHoveringUnit(true);
                            const dat = bespokeUnits.find(u => u.id === 'B')!;
                            setHoveredUnitData(dat);
                            setHoveredStatus(getFlatStatus(selectedFloor, 'B'));
                          }}
                          onMouseLeave={() => {
                            setHoveredZone(null);
                            setIsHoveringUnit(false);
                            setHoveredUnitData(null);
                          }}
                          className="cursor-pointer transition-all duration-300 transform hover:scale-[1.015] origin-bottom-right"
                        >
                          <rect 
                            x="330" 
                            y="320" 
                            width="145" 
                            height="145" 
                            fill={selectedUnitId === 'B' ? 'rgba(212,175,55,0.12)' : hoveredZone === 'B' ? 'rgba(212,175,55,0.04)' : '#161616'} 
                            stroke={selectedUnitId === 'B' ? '#d4af37' : hoveredZone === 'B' ? '#b8946f' : '#2e2e2e'} 
                            strokeWidth="1.5"
                          />
                          {/* CAD Room Partitions for Unit B */}
                          <g stroke={selectedUnitId === 'B' ? 'rgba(212,175,55,0.45)' : '#2d2d2d'} strokeWidth="0.8" fill="none">
                            <line x1="410" y1="390" x2="475" y2="390" />
                            <line x1="410" y1="390" x2="410" y2="465" />
                            <line x1="435" y1="360" x2="475" y2="360" />
                            <line x1="435" y1="360" x2="435" y2="390" />
                            <line x1="365" y1="410" x2="410" y2="410" />
                            <line x1="365" y1="410" x2="365" y2="465" />
                            <line x1="405" y1="320" x2="405" y2="350" />
                            <line x1="405" y1="350" x2="475" y2="350" />
                            <line x1="330" y1="395" x2="365" y2="395" />
                            <line x1="365" y1="320" x2="365" y2="355" />
                          </g>
                          <g fill={selectedUnitId === 'B' ? '#d4af37' : '#777'} fontSize="4.5" fontFamily="monospace" textAnchor="middle" opacity="0.9">
                            <text x="443" y="425" fontWeight="bold">M. BED</text>
                            <text x="455" y="377">TOILET 1</text>
                            <text x="388" y="440">BED 2</text>
                            <text x="348" y="415">KITCHEN</text>
                            <text x="368" y="340" fontSize="5" fontWeight="bold">LIV / DINING</text>
                            <text x="420" y="337">TOILET 2</text>
                            <text x="482" y="425" fontSize="3.5">BALC</text>
                          </g>

                          <text x="402" y="365" textAnchor="middle" className="font-serif text-[9px] font-bold" fill={selectedUnitId === 'B' ? '#d4af37' : '#aaa'}>
                            Flat {selectedFloor}B
                          </text>
                          <text x="402" y="375" textAnchor="middle" className="font-mono text-[5px]" fill="#555">
                            920 SQ FT // 3 Bed 2 Bath
                          </text>

                          {/* Unit status tag visual circle */}
                          <circle cx="350" cy="340" r="3" fill={
                            getFlatStatus(selectedFloor, 'B') === 'Available' ? '#10b981' : 
                            getFlatStatus(selectedFloor, 'B') === 'Reserved' ? '#f59e0b' : '#3f3f46'
                          } />
                          <text x="357" y="342" className="font-mono text-[5.5px]" fill="#777">{getFlatStatus(selectedFloor, 'B')}</text>

                          {/* Interactive Room Hover Zones for Unit B */}
                          <g fill="transparent" stroke="transparent">
                            <rect 
                              x="410" y="390" width="65" height="75" 
                              className="hover:fill-gold-400/15 hover:stroke-gold-400 stroke-[1.5px] transition-all duration-200"
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setHoveredRoom({ name: "Master Bedroom", nameBn: "মাস্টার বেডরুম", sizeSqFt: 185 });
                              }}
                              onMouseLeave={() => setHoveredRoom(null)}
                            />
                            <rect 
                              x="435" y="350" width="40" height="40" 
                              className="hover:fill-gold-400/15 hover:stroke-gold-400 stroke-[1.5px] transition-all duration-200"
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setHoveredRoom({ name: "Master Attached Toilet", nameBn: "মাস্টার অ্যাটাচড বাথরুম", sizeSqFt: 45 });
                              }}
                              onMouseLeave={() => setHoveredRoom(null)}
                            />
                            <rect 
                              x="365" y="390" width="45" height="75" 
                              className="hover:fill-gold-400/15 hover:stroke-gold-400 stroke-[1.5px] transition-all duration-200"
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setHoveredRoom({ name: "Executive Suite Bed-2", nameBn: "এক্সিকিউটিভ স্যুট বেড-২", sizeSqFt: 140 });
                              }}
                              onMouseLeave={() => setHoveredRoom(null)}
                            />
                            <rect 
                              x="330" y="390" width="35" height="75" 
                              className="hover:fill-gold-400/15 hover:stroke-gold-400 stroke-[1.5px] transition-all duration-200"
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setHoveredRoom({ name: "Gourmet Kitchen Segment", nameBn: "প্রিমিয়াম রান্নাঘর", sizeSqFt: 65 });
                              }}
                              onMouseLeave={() => setHoveredRoom(null)}
                            />
                            <rect 
                              x="330" y="320" width="80" height="70" 
                              className="hover:fill-gold-400/15 hover:stroke-gold-400 stroke-[1.5px] transition-all duration-200"
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setHoveredRoom({ name: "Imperial Living & Dining Space", nameBn: "প্রধান ড্রইং ও ডাইনিং স্পেস", sizeSqFt: 380 });
                              }}
                              onMouseLeave={() => setHoveredRoom(null)}
                            />
                            <rect 
                              x="410" y="320" width="25" height="30" 
                              className="hover:fill-gold-400/15 hover:stroke-gold-400 stroke-[1.5px] transition-all duration-200"
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setHoveredRoom({ name: "Common Toilet Segment", nameBn: "সাধারণ বাথরুম", sizeSqFt: 40 });
                              }}
                              onMouseLeave={() => setHoveredRoom(null)}
                            />
                          </g>
                        </g>

                        {/* Unit C: North-West Corner (Rear) */}
                        <g 
                          onClick={() => handleSelectFlatDetail(selectedFloor, 'C')}
                          onMouseEnter={() => {
                            setHoveredZone('C');
                            setIsHoveringUnit(true);
                            const dat = bespokeUnits.find(u => u.id === 'C')!;
                            setHoveredUnitData(dat);
                            setHoveredStatus(getFlatStatus(selectedFloor, 'C'));
                          }}
                          onMouseLeave={() => {
                            setHoveredZone(null);
                            setIsHoveringUnit(false);
                            setHoveredUnitData(null);
                          }}
                          className="cursor-pointer transition-all duration-300 transform hover:scale-[1.015] origin-top-left"
                        >
                          <rect 
                            x="25" 
                            y="35" 
                            width="145" 
                            height="145" 
                            fill={selectedUnitId === 'C' ? 'rgba(212,175,55,0.12)' : hoveredZone === 'C' ? 'rgba(212,175,55,0.04)' : '#161616'} 
                            stroke={selectedUnitId === 'C' ? '#d4af37' : hoveredZone === 'C' ? '#b8946f' : '#2e2e2e'} 
                            strokeWidth="1.5"
                          />
                          {/* CAD Room Partitions for Unit C */}
                          <g stroke={selectedUnitId === 'C' ? 'rgba(212,175,55,0.45)' : '#2d2d2d'} strokeWidth="0.8" fill="none">
                            <line x1="25" y1="110" x2="90" y2="110" />
                            <line x1="90" y1="35" x2="90" y2="110" />
                            <line x1="25" y1="145" x2="65" y2="145" />
                            <line x1="65" y1="110" x2="65" y2="145" />
                            <line x1="90" y1="90" x2="135" y2="90" />
                            <line x1="135" y1="35" x2="135" y2="90" />
                            <line x1="65" y1="145" x2="65" y2="180" />
                            <line x1="25" y1="145" x2="95" y2="145" />
                            <line x1="135" y1="110" x2="170" y2="110" />
                            <line x1="135" y1="145" x2="135" y2="180" />
                          </g>
                          <g fill={selectedUnitId === 'C' ? '#d4af37' : '#777'} fontSize="4.5" fontFamily="monospace" textAnchor="middle" opacity="0.9">
                            <text x="57" y="70" fontWeight="bold">M. BED</text>
                            <text x="45" y="128">TOILET 1</text>
                            <text x="112" y="62">BED 2</text>
                            <text x="152" y="88">KITCHEN</text>
                            <text x="132" y="160" fontSize="5" fontWeight="bold">LIV / DINING</text>
                            <text x="80" y="162">TOILET 2</text>
                            <text x="17" y="52" fontSize="3.5">BALC</text>
                          </g>

                          <text x="97" y="100" textAnchor="middle" className="font-serif text-[9px] font-bold" fill={selectedUnitId === 'C' ? '#d4af37' : '#aaa'}>
                            Flat {selectedFloor}C
                          </text>
                          <text x="97" y="110" textAnchor="middle" className="font-mono text-[5px]" fill="#555">
                            880 SQ FT // 3 Bed 2 Bath
                          </text>

                          {/* Unit status tag visual circle */}
                          <circle cx="45" cy="55" r="3" fill={
                            getFlatStatus(selectedFloor, 'C') === 'Available' ? '#10b981' : 
                            getFlatStatus(selectedFloor, 'C') === 'Reserved' ? '#f59e0b' : '#3f3f46'
                          } />
                          <text x="52" y="57" className="font-mono text-[5.5px]" fill="#777">{getFlatStatus(selectedFloor, 'C')}</text>

                          {/* Interactive Room Hover Zones for Unit C */}
                          <g fill="transparent" stroke="transparent">
                            <rect 
                              x="25" y="35" width="65" height="75" 
                              className="hover:fill-gold-400/15 hover:stroke-gold-400 stroke-[1.5px] transition-all duration-200"
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setHoveredRoom({ name: "Master Bedroom", nameBn: "মাস্টার বেডরুম", sizeSqFt: 175 });
                              }}
                              onMouseLeave={() => setHoveredRoom(null)}
                            />
                            <rect 
                              x="25" y="110" width="40" height="35" 
                              className="hover:fill-gold-400/15 hover:stroke-gold-400 stroke-[1.5px] transition-all duration-200"
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setHoveredRoom({ name: "Master Attached Toilet", nameBn: "মাস্টার অ্যাটাচড বাথরুম", sizeSqFt: 40 });
                              }}
                              onMouseLeave={() => setHoveredRoom(null)}
                            />
                            <rect 
                              x="90" y="35" width="45" height="55" 
                              className="hover:fill-gold-400/15 hover:stroke-gold-400 stroke-[1.5px] transition-all duration-200"
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setHoveredRoom({ name: "Executive Suite Bed-2", nameBn: "এক্সিকিউটিভ স্যুট বেড-২", sizeSqFt: 135 });
                              }}
                              onMouseLeave={() => setHoveredRoom(null)}
                            />
                            <rect 
                              x="135" y="35" width="35" height="55" 
                              className="hover:fill-gold-400/15 hover:stroke-gold-400 stroke-[1.5px] transition-all duration-200"
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setHoveredRoom({ name: "Gourmet Kitchen Segment", nameBn: "প্রিমিয়াম রান্নাঘর", sizeSqFt: 60 });
                              }}
                              onMouseLeave={() => setHoveredRoom(null)}
                            />
                            <rect 
                              x="90" y="110" width="80" height="70" 
                              className="hover:fill-gold-400/15 hover:stroke-gold-400 stroke-[1.5px] transition-all duration-200"
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setHoveredRoom({ name: "Imperial Living & Dining Space", nameBn: "প্রধান ড্রইং ও ডাইনিং স্পেস", sizeSqFt: 350 });
                              }}
                              onMouseLeave={() => setHoveredRoom(null)}
                            />
                            <rect 
                              x="65" y="145" width="25" height="35" 
                              className="hover:fill-gold-400/15 hover:stroke-gold-400 stroke-[1.5px] transition-all duration-200"
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setHoveredRoom({ name: "Common Toilet Segment", nameBn: "সাধারণ বাথরুম", sizeSqFt: 40 });
                              }}
                              onMouseLeave={() => setHoveredRoom(null)}
                            />
                          </g>
                        </g>

                        {/* Unit D: North-East Corner (Rear) */}
                        <g 
                          onClick={() => handleSelectFlatDetail(selectedFloor, 'D')}
                          onMouseEnter={() => {
                            setHoveredZone('D');
                            setIsHoveringUnit(true);
                            const dat = bespokeUnits.find(u => u.id === 'D')!;
                            setHoveredUnitData(dat);
                            setHoveredStatus(getFlatStatus(selectedFloor, 'D'));
                          }}
                          onMouseLeave={() => {
                            setHoveredZone(null);
                            setIsHoveringUnit(false);
                            setHoveredUnitData(null);
                          }}
                          className="cursor-pointer transition-all duration-300 transform hover:scale-[1.015] origin-top-right"
                        >
                          <rect 
                            x="330" 
                            y="35" 
                            width="145" 
                            height="145" 
                            fill={selectedUnitId === 'D' ? 'rgba(212,175,55,0.12)' : hoveredZone === 'D' ? 'rgba(212,175,55,0.04)' : '#161616'} 
                            stroke={selectedUnitId === 'D' ? '#d4af37' : hoveredZone === 'D' ? '#b8946f' : '#2e2e2e'} 
                            strokeWidth="1.5"
                          />
                          {/* CAD Room Partitions for Unit D */}
                          <g stroke={selectedUnitId === 'D' ? 'rgba(212,175,55,0.45)' : '#2d2d2d'} strokeWidth="0.8" fill="none">
                            <line x1="410" y1="110" x2="475" y2="110" />
                            <line x1="410" y1="35" x2="410" y2="110" />
                            <line x1="435" y1="145" x2="475" y2="145" />
                            <line x1="435" y1="110" x2="435" y2="145" />
                            <line x1="365" y1="90" x2="410" y2="90" />
                            <line x1="365" y1="35" x2="365" y2="90" />
                            <line x1="405" y1="145" x2="405" y2="180" />
                            <line x1="405" y1="145" x2="475" y2="145" />
                            <line x1="330" y1="110" x2="365" y2="110" />
                            <line x1="365" y1="145" x2="365" y2="180" />
                          </g>
                          <g fill={selectedUnitId === 'D' ? '#d4af37' : '#777'} fontSize="4.5" fontFamily="monospace" textAnchor="middle" opacity="0.9">
                            <text x="443" y="70" fontWeight="bold">M. BED</text>
                            <text x="455" y="128">TOILET 1</text>
                            <text x="388" y="62">BED 2</text>
                            <text x="348" y="88">KITCHEN</text>
                            <text x="368" y="160" fontSize="5" fontWeight="bold">LIV / DINING</text>
                            <text x="420" y="162">TOILET 2</text>
                            <text x="482" y="52" fontSize="3.5">BALC</text>
                          </g>

                          <text x="402" y="100" textAnchor="middle" className="font-serif text-[9px] font-bold" fill={selectedUnitId === 'D' ? '#d4af37' : '#aaa'}>
                            Flat {selectedFloor}D
                          </text>
                          <text x="402" y="110" textAnchor="middle" className="font-mono text-[5px]" fill="#555">
                            880 SQ FT // 3 Bed 2 Bath
                          </text>

                          {/* Unit status tag visual circle */}
                          <circle cx="350" cy="55" r="3" fill={
                            getFlatStatus(selectedFloor, 'D') === 'Available' ? '#10b981' : 
                            getFlatStatus(selectedFloor, 'D') === 'Reserved' ? '#f59e0b' : '#3f3f46'
                          } />
                          <text x="357" y="57" className="font-mono text-[5.5px]" fill="#777">{getFlatStatus(selectedFloor, 'D')}</text>

                          {/* Interactive Room Hover Zones for Unit D */}
                          <g fill="transparent" stroke="transparent">
                            <rect 
                              x="410" y="35" width="65" height="75" 
                              className="hover:fill-gold-400/15 hover:stroke-gold-400 stroke-[1.5px] transition-all duration-200"
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setHoveredRoom({ name: "Master Bedroom", nameBn: "মাস্টার বেডরুম", sizeSqFt: 175 });
                              }}
                              onMouseLeave={() => setHoveredRoom(null)}
                            />
                            <rect 
                              x="435" y="110" width="40" height="35" 
                              className="hover:fill-gold-400/15 hover:stroke-gold-400 stroke-[1.5px] transition-all duration-200"
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setHoveredRoom({ name: "Master Attached Toilet", nameBn: "মাস্টার অ্যাটাচড বাথরুম", sizeSqFt: 40 });
                              }}
                               onMouseLeave={() => setHoveredRoom(null)}
                            />
                            <rect 
                              x="365" y="35" width="45" height="55" 
                              className="hover:fill-gold-400/15 hover:stroke-gold-400 stroke-[1.5px] transition-all duration-200"
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setHoveredRoom({ name: "Executive Suite Bed-2", nameBn: "এক্সিকিউটিভ স্যুট বেড-২", sizeSqFt: 135 });
                              }}
                              onMouseLeave={() => setHoveredRoom(null)}
                            />
                            <rect 
                              x="330" y="35" width="35" height="55" 
                              className="hover:fill-gold-400/15 hover:stroke-gold-400 stroke-[1.5px] transition-all duration-200"
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setHoveredRoom({ name: "Gourmet Kitchen Segment", nameBn: "প্রিমিয়াম রান্নাঘর", sizeSqFt: 60 });
                              }}
                              onMouseLeave={() => setHoveredRoom(null)}
                            />
                            <rect 
                              x="330" y="110" width="80" height="70" 
                              className="hover:fill-gold-400/15 hover:stroke-gold-400 stroke-[1.5px] transition-all duration-200"
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setHoveredRoom({ name: "Imperial Living & Dining Space", nameBn: "প্রধান ড্রইং ও ডাইনিং স্পেস", sizeSqFt: 350 });
                              }}
                              onMouseLeave={() => setHoveredRoom(null)}
                            />
                            <rect 
                              x="410" y="145" width="25" height="35" 
                              className="hover:fill-gold-400/15 hover:stroke-gold-400 stroke-[1.5px] transition-all duration-200"
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setHoveredRoom({ name: "Common Toilet Segment", nameBn: "সাধারণ বাথরুম", sizeSqFt: 40 });
                              }}
                              onMouseLeave={() => setHoveredRoom(null)}
                            />
                          </g>
                        </g>

                        {/* Balconies CAD Lines Outlines */}
                        <path d="M 25 35 L 10 35 L 10 65 L 25 65" fill="none" stroke="#555" strokeWidth="0.8" />
                        <path d="M 475 35 L 490 35 L 490 65 L 475 65" fill="none" stroke="#555" strokeWidth="0.8" />
                        <path d="M 25 440 L 10 440 L 10 410 L 25 410" fill="none" stroke="#555" strokeWidth="0.8" />
                        <path d="M 475 440 L 490 440 L 490 410 L 475 410" fill="none" stroke="#555" strokeWidth="0.8" />
                      </g>
                    )}

                    {/* VISUAL DIMENSION LINES (SVG lines) FOR SELECTED UNIT */}
                    {selectedFloor > 0 && selectedUnitId && (
                      <g id="dimension-lines">
                        {/* Render dimension lines based on active selected Unit */}
                        {(() => {
                          let hLine = { x1: 0, y1: 0, x2: 0, y2: 0, extY1: 0, extY2: 0, labelX: 0, labelY: 0, labelText: "" };
                          let vLine = { x1: 0, y1: 0, x2: 0, y2: 0, extX1: 0, extX2: 0, labelX: 0, labelY: 0, labelText: "" };
                          
                          if (selectedUnitId === 'A') {
                            hLine = { x1: 25, y1: 475, x2: 170, y2: 475, extY1: 465, extY2: 479, labelX: 97, labelY: 478, labelText: "29.0 FT WIDTH" };
                            vLine = { x1: 15, y1: 320, x2: 15, y2: 465, extX1: 25, extX2: 11, labelX: 11, labelY: 392, labelText: "29.0 FT DEPTH" };
                          } else if (selectedUnitId === 'B') {
                            hLine = { x1: 330, y1: 475, x2: 475, y2: 475, extY1: 465, extY2: 479, labelX: 402, labelY: 478, labelText: "29.0 FT WIDTH" };
                            vLine = { x1: 485, y1: 320, x2: 485, y2: 465, extX1: 475, extX2: 489, labelX: 489, labelY: 392, labelText: "29.0 FT DEPTH" };
                          } else if (selectedUnitId === 'C') {
                            hLine = { x1: 25, y1: 15, x2: 170, y2: 15, extY1: 35, extY2: 11, labelX: 97, labelY: 12, labelText: "29.0 FT WIDTH" };
                            vLine = { x1: 15, y1: 35, x2: 15, y2: 180, extX1: 25, extX2: 11, labelX: 11, labelY: 107, labelText: "29.0 FT DEPTH" };
                          } else if (selectedUnitId === 'D') {
                            hLine = { x1: 330, y1: 15, x2: 475, y2: 15, extY1: 35, extY2: 11, labelX: 402, labelY: 12, labelText: "29.0 FT WIDTH" };
                            vLine = { x1: 485, y1: 35, x2: 485, y2: 180, extX1: 475, extX2: 489, labelX: 489, labelY: 107, labelText: "29.0 FT DEPTH" };
                          }

                          return (
                            <g className="transition-opacity duration-300">
                              {/* Horizontal Dimension Line */}
                              {/* Extension side lines */}
                              <line x1={hLine.x1} y1={hLine.extY1} x2={hLine.x1} y2={hLine.extY2} stroke="rgba(212,175,55,0.4)" strokeWidth="0.8" strokeDasharray="1,2" />
                              <line x1={hLine.x2} y1={hLine.extY1} x2={hLine.x2} y2={hLine.extY2} stroke="rgba(212,175,55,0.4)" strokeWidth="0.8" strokeDasharray="1,2" />
                              
                              {/* Main Horiz line */}
                              <line x1={hLine.x1} y1={hLine.y1} x2={hLine.x2} y2={hLine.y2} stroke="#d4af37" strokeWidth="1" />
                              
                              {/* Slanted ticks */}
                              <line x1={hLine.x1 - 3} y1={hLine.y1 + 3} x2={hLine.x1 + 3} y2={hLine.y1 - 3} stroke="#d4af37" strokeWidth="1" />
                              <line x1={hLine.x2 - 3} y1={hLine.y2 + 3} x2={hLine.x2 + 3} y2={hLine.y2 - 3} stroke="#d4af37" strokeWidth="1" />
                              
                              {/* Shield Background for label */}
                              <rect x={hLine.labelX - 25} y={hLine.y1 - 4} width="50" height="8" rx="1.5" fill="#090909" stroke="rgba(212,175,55,0.2)" strokeWidth="0.5" />
                              <text x={hLine.labelX} y={hLine.y1 + 2.2} fill="#d4af37" textAnchor="middle" className="font-mono text-[5.5px] font-bold tracking-wider">
                                {hLine.labelText}
                              </text>

                              {/* Vertical Dimension Line */}
                              {/* Extension side lines */}
                              <line x1={vLine.extX1} y1={vLine.y1} x2={vLine.extX2} y2={vLine.y1} stroke="rgba(212,175,55,0.4)" strokeWidth="0.8" strokeDasharray="1,2" />
                              <line x1={vLine.extX1} y1={vLine.y2} x2={vLine.extX2} y2={vLine.y2} stroke="rgba(212,175,55,0.4)" strokeWidth="0.8" strokeDasharray="1,2" />

                              {/* Main Vert line */}
                              <line x1={vLine.x1} y1={vLine.y1} x2={vLine.x2} y2={vLine.y2} stroke="#d4af37" strokeWidth="1" />

                              {/* Slanted ticks */}
                              <line x1={vLine.x1 - 3} y1={vLine.y1 + 3} x2={vLine.x1 + 3} y2={vLine.y1 - 3} stroke="#d4af37" strokeWidth="1" />
                              <line x1={vLine.x2 - 3} y1={vLine.y2 + 3} x2={vLine.x2 + 3} y2={vLine.y2 - 3} stroke="#d4af37" strokeWidth="1" />

                              {/* Shield Background for vertical label */}
                              <g transform={`translate(${vLine.x1}, ${vLine.labelY}) rotate(-90)`}>
                                <rect x="-25" y="-4" width="50" height="8" rx="1.5" fill="#090909" stroke="rgba(212,175,55,0.2)" strokeWidth="0.5" />
                                <text x="0" y="2.2" fill="#d4af37" textAnchor="middle" className="font-mono text-[5.5px] font-bold tracking-wider">
                                  {vLine.labelText}
                                </text>
                              </g>
                            </g>
                          );
                        })()}
                      </g>
                    )}
                  </svg>

                  {/* Wind / Compass Visualizer badge */}
                  <div className="absolute bottom-3 right-3 bg-neutral-900 border border-neutral-800 px-2 py-1 rounded text-[8px] font-mono text-neutral-400 flex items-center gap-1.5 shadow-md">
                    <Compass size={8} className="text-gold-400 animate-spin" style={{ animationDuration: '8s' }} />
                    <span>TRUE NORTH ALIGNED</span>
                  </div>
                </div>
              </div>

              {/* Cursor hover tooltip card */}
              <AnimatePresence>
                {isHoveringUnit && (hoveredUnitData || hoveredRoom) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    className="absolute pointer-events-none bg-neutral-950/95 border border-gold-400/30 w-52 p-3 rounded shadow-2xl z-50 hidden md:flex flex-col gap-1.5 backdrop-blur-md"
                    style={{
                      left: mousePos.x + 15,
                      top: Math.min(mousePos.y + 15, 390),
                    }}
                  >
                    {hoveredRoom ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="font-serif text-[11px] font-bold text-white uppercase tracking-wider">
                            {isBangla ? hoveredRoom.nameBn : hoveredRoom.name}
                          </span>
                          <span className="text-[7.5px] font-mono px-1.5 py-0.5 rounded border bg-gold-400/10 border-gold-400/20 text-gold-400 uppercase tracking-widest">
                            {isBangla ? "রুম লেআউট" : "ROOM SPEC"}
                          </span>
                        </div>
                        <div className="w-full h-[1px] bg-neutral-900" />
                        <div className="font-mono text-[9px] text-neutral-400 space-y-1">
                          <div className="flex justify-between">
                            <span className="text-neutral-500">{isBangla ? "আয়তন:" : "ROOM SIZE:"}</span>
                            <span className="text-white font-bold">{hoveredRoom.sizeSqFt} sq ft</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500">{isBangla ? "ইউনিট:" : "APARTMENT:"}</span>
                            <span>Flat {selectedFloor === 0 ? 'GF' : selectedFloor}{hoveredZone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500">{isBangla ? "অনুমোদন:" : "COMPLIANCE:"}</span>
                            <span className="text-emerald-400">RAJUK Approved</span>
                          </div>
                        </div>
                      </>
                    ) : hoveredUnitData ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="font-serif text-[11px] font-bold text-white">
                            Flat {selectedFloor === 0 ? 'GF' : selectedFloor}{hoveredUnitData.id}
                          </span>
                          <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border ${
                            hoveredStatus === 'Available'
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                              : hoveredStatus === 'Reserved'
                                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                          }`}>
                            {hoveredStatus}
                          </span>
                        </div>
                        <div className="w-full h-[1px] bg-neutral-900" />
                        <div className="font-mono text-[9px] text-neutral-400 space-y-1">
                          <div className="flex justify-between">
                            <span className="text-neutral-500">BUILD SIZE:</span>
                            <span>{hoveredUnitData.sizeSqFt} sq ft</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500">FACING DIRECTION:</span>
                            <span className="text-neutral-200 truncate max-w-[110px]">{hoveredUnitData.facing}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500">EST. PRICE:</span>
                            <span className="text-gold-300 font-bold">
                              ৳{getFlatPriceNum(selectedFloor === 0 ? 1 : selectedFloor, hoveredUnitData.basePriceNum).toFixed(2)} Lakh
                            </span>
                          </div>
                        </div>
                      </>
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Selection HUD bar */}
              <div className="mt-6 p-4 rounded bg-neutral-950/80 border border-neutral-850 min-h-[50px] flex items-center">
                {hoveredZone ? (
                  <div className="font-sans text-xs">
                    <span className="font-mono text-[9px] text-gold-400 tracking-wider block uppercase mb-0.5">INSIGHT HOVER DETAIL</span>
                    <p className="text-neutral-200">
                      <strong>Flat {selectedFloor}{hoveredZone}:</strong> Sized at {selectedFloor > 0 && bespokeUnits.find(bu=>bu.id===hoveredZone)?.sizeSqFt} sq ft. Enjoying clean structural alignments as 100% Corner layout.
                    </p>
                  </div>
                ) : selectedFloor === 0 ? (
                  <p className="text-neutral-400 text-xs font-sans">
                    <strong>Ground Floor Plan:</strong> Designed to harbor our executive lobby, substation room, and driveways covering 10 Katha land base securely.
                  </p>
                ) : (
                  <p className="text-neutral-400 text-xs font-sans">
                    Click on an apartment unit block in the CAD vector diagram to view its individual layout details and pricing estimates instantly.
                  </p>
                )}
              </div>

            </div>

            {/* DYNAMIC BLUEPRINT DETAILED PROPERTY SHEET */}
            {!isMaximizedBlueprint && (
              <div className="xl:col-span-3 flex flex-col justify-between self-stretch gap-6">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedFloor}-${selectedUnitId}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-neutral-900/40 p-6 rounded-xl border border-neutral-850 flex-grow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <Sparkles size={11} className="text-gold-400" />
                      <span className="font-mono text-[9px] text-gold-400 uppercase tracking-widest leading-none">
                        CONSTRUCT SPECIFICATION SHEET
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-normal text-white mb-2">
                      {selectedFloor === 0 ? 'Ground Floor Amenities' : `Penthouse Suite ${selectedFloor}${selectedUnitId}`}
                    </h3>

                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-gold-300 uppercase bg-neutral-950 px-2.5 py-0.5 rounded border border-gold-400/10">
                        {selectedFloor === 0 ? '10 Katha Plot Base' : `Level 0${selectedFloor} Corner`}
                      </span>
                      {selectedFloor > 0 && (
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase ${
                          getFlatStatus(selectedFloor, selectedUnitId) === 'Available'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : getFlatStatus(selectedFloor, selectedUnitId) === 'Reserved'
                              ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                              : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                        }`}>
                          {getFlatStatus(selectedFloor, selectedUnitId)}
                        </span>
                      )}
                    </div>

                    {selectedFloor === 0 ? (
                      <div className="space-y-4 text-xs font-sans text-neutral-400">
                        <p>
                          Our ground floor represents the security check gate, fire escape assemblies, covered secure car slots, and luxurious entry lounges.
                        </p>
                        <div className="space-y-2 border-t border-neutral-800/80 pt-3 font-mono text-[10px]">
                          <div className="flex justify-between">
                            <span className="text-neutral-500">COVERED PARKING:</span>
                            <span className="text-white font-bold">10 ALLOTTED SLOTS</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500">POWER SUBSTATION:</span>
                            <span className="text-white">100 KVA SILENT GEN</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500">ENTRY ROAD:</span>
                            <span className="text-white">60.0 FT FRONTAGE</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 text-xs font-sans text-neutral-400 animate-fadeIn">
                        <div>
                          <span className="block text-neutral-500 text-[8px] font-mono uppercase mb-0.5">TARGET HOME PROFILE</span>
                          <p className="text-neutral-200 leading-relaxed font-light">{activeUnit.idealFor}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 border-y border-neutral-800 py-3 font-mono text-[10px]">
                          <div>
                            <span className="text-neutral-500 block text-[8px] font-sans">NET USEABLE AREA</span>
                            <span className="text-white font-semibold flex items-center gap-1 mt-0.5">
                              <Square size={10} className="text-gold-400" />
                              {activeUnit.sizeSqFt} SQ FT
                            </span>
                          </div>
                          <div>
                            <span className="text-neutral-500 block text-[8px] font-sans">COMPASS DIRECTION</span>
                            <span className="text-white truncate block mt-0.5" title={activeUnit.facing}>
                              {activeUnit.facing}
                            </span>
                          </div>
                          <div>
                            <span className="text-neutral-500 block text-[8px] font-sans">BED/BATH COMBO</span>
                            <span className="text-neutral-300 font-bold block mt-0.5">{activeUnit.bedrooms} Beds / {activeUnit.bathrooms} Baths</span>
                          </div>
                          <div>
                            <span className="text-neutral-500 block text-[8px] font-sans">TOTAL VERANDAS</span>
                            <span className="text-neutral-300 font-bold block mt-0.5">{activeUnit.verandas} Attached Bays</span>
                          </div>
                        </div>

                        {/* SPECIFIC ROOM FLOORINGS & FINISHES */}
                        <div className="p-3 bg-neutral-950/60 rounded border border-neutral-850/60 space-y-2">
                          <span className="text-neutral-500 block text-[8px] font-mono uppercase tracking-widest">FLOOR SELECTIONS & SPECIFICATIONS</span>
                          <div className="space-y-1 text-[9.5px] font-mono text-neutral-300 border-t border-neutral-900 pt-1.5">
                            <div className="flex justify-between">
                              <span className="text-neutral-500 font-sans">LIV & DINING:</span>
                              <span className="text-neutral-200 text-right">Greek Pentelikon Marble slab</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-500 font-sans">MASTER M.BED:</span>
                              <span className="text-neutral-200 text-right">Italian Statuario White Marble</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-500 font-sans">SECONDARY BED:</span>
                              <span className="text-neutral-200 text-right">RAK Vitrified 800x800mm Slabs</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-500 font-sans">KITCHEN CENTRE:</span>
                              <span className="text-gold-300 text-right">Galaxy Black Granite finish</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-500 font-sans">BATH TOILETS:</span>
                              <span className="text-neutral-200 text-right">Anti-skid Matte Basalt tile</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-500 font-sans">ATTACHED BALC:</span>
                              <span className="text-neutral-200 text-right">Brazilian Teak Wood Decking</span>
                            </div>
                          </div>
                        </div>

                        {/* DYNAMIC LAND PLOT OPTIMIZATION & MAX BUILDING EXPANSION */}
                        <div className="p-3 bg-neutral-900/30 rounded border border-neutral-850/40 space-y-1.5">
                          <span className="text-neutral-500 block text-[8px] font-mono uppercase tracking-widest">{parsedKatha} KATHA SPACE MAXIMIZATION</span>
                          <p className="text-[10px] text-neutral-400 font-light leading-relaxed font-sans">
                            The net building footprint is fully expanded to **60% Maximum Ground Coverage (MGC)** of the **{totalSqFt.toLocaleString()} sq ft ({parsedKatha} Katha)** land plot. This results in an optimized floor plate built of **{(totalSqFt * 0.60).toLocaleString(undefined, { maximumFractionDigits: 0 })} sq ft** per level, maximizing saleable carpet area in complete compliance with Dhaka RAJUK building code.
                          </p>
                        </div>

                        <div className="p-3 bg-neutral-950/90 rounded border border-neutral-850">
                          <span className="text-neutral-500 block text-[8px] font-mono uppercase tracking-widest mb-1">TOTAL VALUATION</span>
                          <div className="flex justify-between items-baseline">
                            <span className="font-serif text-lg text-gold-300 font-semibold">
                              ৳{activeFlatPrice.toFixed(2)} Lakh
                            </span>
                            <span className="text-[8px] text-neutral-500 font-mono">BDT Estimate</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 space-y-2">
                    {selectedFloor > 0 && (
                      <button
                        onClick={() => handleSelectFlatDetail(selectedFloor, selectedUnitId)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gold-400 hover:bg-gold-350 text-neutral-950 rounded font-mono text-[9px] uppercase tracking-widest font-bold transition-all cursor-pointer"
                      >
                        <Sparkles size={11} className="text-neutral-950 animate-pulse" />
                        View Full Specifications
                      </button>
                    )}
                    {selectedFloor > 0 && (
                      <button
                        onClick={handleDownloadPDF}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900/50 hover:bg-neutral-900/90 border border-neutral-800 hover:border-gold-400/40 rounded font-mono text-[9px] uppercase tracking-widest text-neutral-300 hover:text-gold-300 font-bold transition-all cursor-pointer"
                      >
                        <FileDown size={11} className="text-gold-400" />
                        Download PDF Brochure
                      </button>
                    )}
                    <a 
                      href="#contact"
                      className="w-full text-center block px-4 py-3 bg-neutral-950 hover:bg-neutral-900 border border-gold-400/20 hover:border-gold-400/50 rounded font-mono text-2xs uppercase tracking-widest text-gold-300 font-semibold transition-all cursor-pointer"
                    >
                      Reserve {selectedFloor === 0 ? 'GF Slot' : `Suite ${selectedFloor}${selectedUnitId}`}
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Safety notification card */}
              <div className="p-4 rounded-lg bg-neutral-900/20 border border-neutral-850/80 text-[10px] text-neutral-400 flex items-start gap-2.5">
                <ShieldCheck size={14} className="text-gold-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-neutral-300 font-mono block mb-0.5">100% RAJUK Code Security</strong>
                  Double staircases with fire door gaskets prevent smoke. Cast-in-situ pillars carry heavy seismic buffer capability.
                </div>
              </div>

            </div>
            )}

          </div>
        )}

        {/* VIEW 2: INTERACTIVE ANALYTICS & GRAPH PANEL */}
        {layoutViewMode === 'analytics' && (
          <div className="space-y-12">
            
            {/* TWO GRAPHS ROW representing full 36 flats & 10 katha plot footprint */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* GRAPH A: Land Footprint Space Allocation Donut Block */}
              <div className="bg-neutral-900/40 p-6 rounded-xl border border-neutral-850 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="font-mono text-[9px] text-gold-400 tracking-wider block mb-1">SPACE GRAPH A</span>
                      <h4 className="font-serif text-lg text-white font-normal">{parsedKatha} Katha Land plot Distribution</h4>
                    </div>
                    <span className="font-mono text-[10px] bg-neutral-950 text-neutral-400 px-2 py-0.5 rounded border border-neutral-850">
                      {totalSqFt.toLocaleString()} SQ FT Total
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-sans leading-relaxed mb-6 font-light">
                    How the {parsedKatha} Katha ({totalSqFt.toLocaleString()} sq ft) plot is leveraged. Hover over the quadrants of the interactive graph below to inspect the architectural and green setbacks.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    
                    {/* SVG Circular Donut Chart */}
                    <div className="md:col-span-6 flex justify-center relative">
                      <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
                        {/* Segment 1: Building Footprint 60% */}
                        <circle
                          cx="100"
                          cy="100"
                          r="70"
                          fill="transparent"
                          stroke={activeLandSegment === 1 ? '#e8c962' : '#d4af37'}
                          strokeWidth={activeLandSegment === 1 ? '22' : '16'}
                          strokeDasharray="263.89 439.82" // 60% of 439.82 circumference
                          strokeDashoffset="0"
                          className="cursor-pointer transition-all duration-300"
                          onMouseEnter={() => setActiveLandSegment(1)}
                          onMouseLeave={() => setActiveLandSegment(null)}
                        />
                        {/* Segment 2: Side & Rear Setbacks 20% */}
                        <circle
                          cx="100"
                          cy="100"
                          r="70"
                          fill="transparent"
                          stroke={activeLandSegment === 2 ? '#22c55e' : '#16a34a'}
                          strokeWidth={activeLandSegment === 2 ? '22' : '16'}
                          strokeDasharray="87.96 439.82" // 20%
                          strokeDashoffset="-263.89"
                          className="cursor-pointer transition-all duration-300"
                          onMouseEnter={() => setActiveLandSegment(2)}
                          onMouseLeave={() => setActiveLandSegment(null)}
                        />
                        {/* Segment 3: Gated Driveway 10% */}
                        <circle
                          cx="100"
                          cy="100"
                          r="70"
                          fill="transparent"
                          stroke={activeLandSegment === 3 ? '#3b82f6' : '#2563eb'}
                          strokeWidth={activeLandSegment === 3 ? '22' : '16'}
                          strokeDasharray="43.98 439.82" // 10%
                          strokeDashoffset="-351.85"
                          className="cursor-pointer transition-all duration-300"
                          onMouseEnter={() => setActiveLandSegment(3)}
                          onMouseLeave={() => setActiveLandSegment(null)}
                        />
                        {/* Segment 4: Green buffer 10% */}
                        <circle
                          cx="100"
                          cy="100"
                          r="70"
                          fill="transparent"
                          stroke={activeLandSegment === 4 ? '#facc15' : '#eab308'}
                          strokeWidth={activeLandSegment === 4 ? '22' : '16'}
                          strokeDasharray="43.98 439.82" // 10%
                          strokeDashoffset="-395.83"
                          className="cursor-pointer transition-all duration-300"
                          onMouseEnter={() => setActiveLandSegment(4)}
                          onMouseLeave={() => setActiveLandSegment(null)}
                        />
                      </svg>
                      
                      {/* Central Legend display info */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                        <span className="font-serif text-3xl font-bold text-white leading-none">60%</span>
                        <span className="text-[7.5px] font-mono text-neutral-500 uppercase tracking-widest block mt-0.5">Built Max</span>
                      </div>
                    </div>

                    {/* Right column detailed legend listings */}
                    <div className="md:col-span-6 flex flex-col gap-2.5">
                      {landAllocation.map((item) => {
                        const isHovered = activeLandSegment === item.id;
                        return (
                          <div
                            key={item.id}
                            onMouseEnter={() => setActiveLandSegment(item.id)}
                            onMouseLeave={() => setActiveLandSegment(null)}
                            className={`p-2 rounded border transition-all duration-200 cursor-pointer ${
                              isHovered 
                                ? 'bg-neutral-900 border-neutral-750 scale-[1.012]' 
                                : 'bg-neutral-950/40 border-neutral-900'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                              <span className="font-mono text-[9px] text-neutral-300 font-bold uppercase">{item.percentage}% // {item.label.split(' ')[1]}</span>
                            </div>
                            <div className="flex justify-between font-mono text-[10px] text-neutral-400 pl-3.5 mt-0.5">
                              <span>ALLOCATED SIZ:</span>
                              <span className="text-white font-bold">{item.size}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                </div>

                {/* Legend details card block */}
                <div className="mt-4 p-3 rounded bg-neutral-950/90 border border-neutral-850 font-sans text-xs text-neutral-400">
                  <span className="text-2xs text-[#777] font-mono uppercase tracking-widest block mb-1">SELECTED COMPARTMENT FUNCTION</span>
                  <p className="leading-relaxed">
                    {activeLandSegment 
                      ? landAllocation.find(la => la.id === activeLandSegment)?.desc 
                      : `Hover over individual pie blocks or metrics above to study the ${parsedKatha} Katha land conservation setup details.`
                    }
                  </p>
                </div>
              </div>

              {/* GRAPH B: Heights Pricing Multiplier Cascade Bar Chart */}
              <div className="bg-neutral-900/40 p-6 rounded-xl border border-neutral-850 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="font-mono text-[9px] text-gold-400 tracking-wider block mb-1">VALUATION GRAPH B</span>
                      <h4 className="font-serif text-lg text-white font-normal">Height-Based Price Escalation</h4>
                    </div>
                    <span className="font-mono text-[10px] bg-neutral-950 text-[#10b981] px-2.5 py-0.5 rounded border border-neutral-850">
                      ৳79L - ৳93.10L
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-sans leading-relaxed mb-6 font-light">
                    Value trends across Levels 1 to 9. Higher levels claim scenic vistas, cooler ambient winds, and high clearance noise isolating safety, raising core square feet value.
                  </p>

                  {/* Manual Interactive Column Chart */}
                  <div className="pt-6 pb-2 px-2 flex justify-between items-end gap-2.5 h-[170px] border-b border-neutral-850/60 relative">
                    
                    {/* Horizontal marking bars */}
                    <div className="absolute left-0 right-0 top-[20%] border-t border-neutral-900 pointer-events-none" />
                    <div className="absolute left-0 right-0 top-[50%] border-t border-neutral-900 pointer-events-none" />
                    <div className="absolute left-0 right-0 top-[80%] border-t border-neutral-900 pointer-events-none" />

                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => {
                      const lvlPriceAvg = getFlatPriceNum(lvl, 82); // average representing Unit A/B price on lvl
                      // scale height from 79L to 93L
                      const pctHeight = ((lvlPriceAvg - 70) / (95 - 70)) * 100;
                      const isHovered = activePriceBar === lvl;
                      const isSelected = selectedFloor === lvl;

                      return (
                        <div key={lvl} className="flex-1 flex flex-col items-center group relative cursor-pointer">
                          
                          {/* Tooltip on individual bar hover */}
                          {isHovered && (
                            <div className="absolute bottom-[108%] bg-neutral-950 border border-gold-400/30 px-2 py-1.5 rounded text-center z-50 font-mono text-[9px] shadow-2xl min-w-[100px]">
                              <span className="text-neutral-500 block">LEVEL 0{lvl} AVE</span>
                              <span className="text-gold-300 font-bold block">৳{lvlPriceAvg.toFixed(2)} Lakh</span>
                            </div>
                          )}

                          <div
                            onMouseEnter={() => setActivePriceBar(lvl)}
                            onMouseLeave={() => setActivePriceBar(null)}
                            onClick={() => setSelectedFloor(lvl)}
                            className="w-full rounded-t transition-all duration-300 relative"
                            style={{
                              height: `${pctHeight}%`,
                              backgroundColor: isSelected ? '#d4af37' : isHovered ? '#b8946f' : 'rgba(212,175,55,0.25)',
                              borderLeft: isSelected || isHovered ? '1px solid rgba(255,255,255,0.1)' : 'none',
                              borderRight: isSelected || isHovered ? '1px solid rgba(255,255,255,0.1)' : 'none',
                            }}
                          >
                            {isSelected && (
                              <div className="absolute top-0 left-0 right-0 h-1 bg-white rounded-full animate-pulse" />
                            )}
                          </div>
                          
                          <span className={`text-[8px] font-mono mt-2 transition-colors duration-300 ${isSelected ? 'text-gold-400 font-bold' : 'text-neutral-500'}`}>
                            L0{lvl}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Chart B details explanation */}
                <div className="mt-4 p-3 rounded bg-neutral-950/90 border border-neutral-850 font-sans text-xs text-neutral-400">
                  <span className="text-2xs text-[#777] font-mono uppercase tracking-widest block mb-1">FLOOR LEVEL IMPACT RANGE</span>
                  <p className="leading-relaxed">
                    Our pricing incorporates Level Premium calculations. Select an elevation level bar to dynamically update your primary explorer view and activate the high-speed traction elevator simulator.
                  </p>
                </div>
              </div>

            </div>

            {/* HIGH-LUXURY 36 APARTMENT DATABASE MASTER LIST */}
            <div className="bg-neutral-900/40 rounded-xl border border-neutral-850 p-6">
              
              {/* Table search and filters */}
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
                <div>
                  <h4 className="font-serif text-lg text-white font-normal">{totalFlatsCount}-Flat Complete Inventory Matrix</h4>
                  <p className="text-[10px] text-neutral-500 font-mono tracking-wider mt-0.5">
                    EXCEL INTEGRITY SHEET // EAST FAYDABAD RESIDENCES
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
                  {/* Text search query */}
                  <div className="relative flex-grow md:flex-grow-0">
                    <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="Search Flat #, facing..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-neutral-950/80 border border-neutral-850 rounded px-2.5 py-1.5 pl-8 text-xs font-mono text-white focus:outline-none focus:border-gold-450 placeholder-neutral-600 min-w-[200px]"
                    />
                  </div>

                  {/* Booking status select dropdown */}
                  <div className="flex items-center gap-1.5 bg-neutral-950 border border-neutral-850 px-2 py-1.5 rounded">
                    <Filter size={10} className="text-neutral-500" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="bg-transparent border-none text-xs font-mono text-neutral-300 focus:outline-none cursor-pointer"
                    >
                      <option value="All" className="bg-neutral-900 text-white">Status: All</option>
                      <option value="Available" className="bg-neutral-900 text-emerald-400">Status: Available</option>
                      <option value="Reserved" className="bg-neutral-900 text-amber-400">Status: Reserved</option>
                      <option value="Sold" className="bg-neutral-900 text-neutral-500">Status: Sold</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Dynamic spreadsheet matrix of all 36 flats */}
              <div className="hidden lg:block overflow-x-auto border border-neutral-850 rounded-lg">
                <table className="w-full text-left font-sans text-xs text-neutral-300 border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-neutral-950 border-b border-neutral-850 font-mono text-[9px] text-neutral-400 uppercase tracking-widest">
                      <th className="p-3">FLAT INDX</th>
                      <th className="p-3">ELEVATION</th>
                      <th className="p-3">UNIT TYPE</th>
                      <th className="p-3">NET CARPET</th>
                      <th className="p-3">ORIENTATION & COMPASS</th>
                      <th className="p-3">BED/BATHS</th>
                      <th className="p-3">VALUATION RANGE</th>
                      <th className="p-3">BOOKING STATUS</th>
                      <th className="p-3 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900 bg-[#121212]/30">
                    {filteredFlats.length > 0 ? (
                      filteredFlats.map((flat) => {
                        const isHovered = hoveredFlatId === flat.id;
                        const isSelected = selectedFloor === flat.floor && selectedUnitId === flat.unitCode;
                        
                        return (
                          <tr
                            key={flat.id}
                            onMouseEnter={() => setHoveredFlatId(flat.id)}
                            onMouseLeave={() => setHoveredFlatId(null)}
                            onClick={() => handleSelectFlatDetail(flat.floor, flat.unitCode)}
                            className={`transition-colors duration-150 cursor-pointer ${
                              isSelected 
                                ? 'bg-gold-500/5 text-white border-y border-gold-400/20' 
                                : isHovered 
                                  ? 'bg-neutral-900/60' 
                                  : 'hover:bg-neutral-900/35'
                            }`}
                          >
                            <td className="p-3 font-mono font-bold text-white">#{flat.id}</td>
                            <td className="p-3 font-mono text-neutral-400">Level 0{flat.floor}</td>
                            <td className="p-3 font-mono text-gold-400">Corner Suite {flat.unitCode}</td>
                            <td className="p-3 font-mono">{flat.sizeSqFt} SQ FT</td>
                            <td className="p-3 font-sans text-neutral-400">{flat.facing}</td>
                            <td className="p-3 font-mono text-[10px]">{flat.bedrooms} Beds / {flat.bathrooms} Baths</td>
                            <td className="p-3 font-serif font-bold text-gold-300">{flat.priceBDT}</td>
                            <td className="p-3">
                              <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                                flat.status === 'Available'
                                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                  : flat.status === 'Reserved'
                                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                    : 'bg-neutral-800 border-neutral-750 text-neutral-500'
                              }`}>
                                {flat.status}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex gap-1.5 justify-end" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => handleSelectFlatDetail(flat.floor, flat.unitCode)}
                                  className="px-2 py-1 rounded bg-gold-400 hover:bg-gold-300 text-[9px] font-mono uppercase text-neutral-950 font-bold tracking-wider transition-colors cursor-pointer"
                                >
                                  VIEW SPECS
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedFloor(flat.floor);
                                    setSelectedUnitId(flat.unitCode);
                                    setLayoutViewMode('blueprint');
                                    // Smooth scroll to top of floorplan section container
                                    const container = document.getElementById('floorplan');
                                    if (container) {
                                      window.scrollTo({
                                        top: container.offsetTop - 80,
                                        behavior: 'smooth'
                                      });
                                    }
                                  }}
                                  className="px-2.5 py-1 rounded bg-neutral-950 hover:bg-neutral-950 border border-neutral-850 text-[9px] font-mono uppercase text-neutral-300 hover:text-white hover:border-gold-400/40 tracking-wider transition-colors cursor-pointer"
                                >
                                  LOAD CAD
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-neutral-500 font-sans">
                          No flats matching your current search parameters. Clear query or status selectors and retry.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile and Tablet bento cards list of flats */}
              <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFlats.length > 0 ? (
                  filteredFlats.map((flat) => {
                    const isSelected = selectedFloor === flat.floor && selectedUnitId === flat.unitCode;
                    return (
                      <div
                        key={`bento-${flat.id}`}
                        onClick={() => handleSelectFlatDetail(flat.floor, flat.unitCode)}
                        className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-3 ${
                          isSelected 
                            ? 'bg-gold-500/5 border-gold-400/50 shadow-[0_0_15px_rgba(212,175,55,0.05)] scale-[1.012]' 
                            : 'bg-neutral-950/40 border-neutral-850 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <span className="font-mono text-[9px] text-gold-400 uppercase tracking-widest block mb-0.5">#{flat.id} // LEVEL 0{flat.floor}</span>
                            <h5 className="font-serif text-sm font-normal text-white truncate">Corner Suite {flat.unitCode}</h5>
                          </div>
                          <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${
                            flat.status === 'Available'
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                              : flat.status === 'Reserved'
                                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                : 'bg-neutral-800 border-neutral-750 text-neutral-500'
                          }`}>
                            {flat.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-neutral-400 border-t border-neutral-900 pt-2.5">
                          <div>
                            <span className="text-neutral-500 text-[8px] block uppercase">Net Carpet</span>
                            <span className="text-neutral-200">{flat.sizeSqFt} SQ FT</span>
                          </div>
                          <div>
                            <span className="text-neutral-500 text-[8px] block uppercase">Beds/Baths</span>
                            <span className="text-neutral-200">{flat.bedrooms} Bed / {flat.bathrooms} Bath</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-neutral-500 text-[8px] block uppercase">Orientation</span>
                            <span className="text-neutral-300 truncate block">{flat.facing}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center border-t border-neutral-900 pt-2.5">
                          <span className="font-serif text-xs font-bold text-gold-300">{flat.priceBDT}</span>
                          
                          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleSelectFlatDetail(flat.floor, flat.unitCode)}
                              className="px-2 py-1 rounded bg-gold-400 hover:bg-gold-300 text-[9px] font-mono uppercase text-neutral-950 font-bold tracking-wider transition-colors cursor-pointer"
                            >
                              SPECS
                            </button>
                            <button
                              onClick={() => {
                                setSelectedFloor(flat.floor);
                                setSelectedUnitId(flat.unitCode);
                                setLayoutViewMode('blueprint');
                                const container = document.getElementById('floorplan');
                                if (container) {
                                  window.scrollTo({
                                    top: container.offsetTop - 80,
                                    behavior: 'smooth'
                                  });
                                }
                              }}
                              className="px-2 py-1 rounded bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 text-[9px] font-mono uppercase text-neutral-300 hover:text-white tracking-wider transition-colors cursor-pointer"
                            >
                              CAD
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-neutral-500 border border-neutral-850 rounded-xl bg-neutral-950/40 w-full col-span-full font-sans text-xs">
                    No flats matching your current search parameters. Clear query or status selectors and retry.
                  </div>
                )}
              </div>

              {/* Data disclaimer note */}
              <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[10px] text-neutral-500 font-mono">
                <span>* Values represent updated Q2 2026 pre-registration launch quotes.</span>
                <span>DATA INTEGRITY SECURED • DHAKA REGISTRY</span>
              </div>

            </div>

          </div>
        )}

        {/* DETAILED FLAT SPECIFICATIONS MODAL OVERLAY */}
        <AnimatePresence>
          {isDetailModalOpen && selectedFlatForDetail && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="relative w-full max-w-4xl bg-neutral-900 border border-gold-400/25 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row text-white my-8 bg-neutral-900"
              >
                {/* Close Button */}
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-neutral-950/80 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-gold-400/50 transition-all cursor-pointer text-lg font-mono"
                >
                  &times;
                </button>

                {/* Left Side Panel */}
                <div className="md:w-2/5 bg-neutral-950 p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-850">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <Sparkles size={11} className="text-gold-400 animate-pulse" />
                      <span className="font-mono text-[9px] text-gold-400 uppercase tracking-widest leading-none">
                        PREMIUM RESIDENCE CARD
                      </span>
                    </div>
                    
                    <h3 className="font-serif text-3xl font-light text-white leading-tight mb-2">
                      Suite #{selectedFlatForDetail.id}
                    </h3>
                    
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded bg-neutral-900 text-gold-300 text-[10px] font-mono uppercase tracking-wider border border-gold-400/10">
                      Level 0{selectedFlatForDetail.floor} Elevation
                    </span>

                    {/* Compass Visualizer */}
                    <div className="flex flex-col items-center justify-center bg-neutral-900/40 p-4 rounded-xl border border-neutral-800/60 my-6">
                      <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest block mb-3">
                        CORNER POSITION MAP
                      </span>
                      <svg viewBox="0 0 100 100" className="w-24 h-24 text-neutral-700">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#222" strokeWidth="1" strokeDasharray="2,2" />
                        <line x1="50" y1="5" x2="50" y2="95" stroke="#222" strokeWidth="0.5" />
                        <line x1="5" y1="50" x2="95" y2="50" stroke="#222" strokeWidth="0.5" />
                        
                        <text x="50" y="12" textAnchor="middle" className="font-mono text-[7px]" fill="#555">N</text>
                        <text x="50" y="93" textAnchor="middle" className="font-mono text-[7px]" fill="#555">S</text>
                        <text x="92" y="52" textAnchor="middle" className="font-mono text-[7px]" fill="#555">E</text>
                        <text x="8" y="52" textAnchor="middle" className="font-mono text-[7px]" fill="#555">W</text>
                        
                        {/* A (SW Corner) */}
                        <rect x="20" y="55" width="25" height="25" rx="2" 
                          fill={selectedFlatForDetail.unitCode === 'A' ? 'rgba(212,175,55,0.2)' : '#121212'} 
                          stroke={selectedFlatForDetail.unitCode === 'A' ? '#d4af37' : '#333'} 
                          strokeWidth="1" 
                        />
                        <text x="32.5" y="70" textAnchor="middle" className="font-mono text-[8px]" fill={selectedFlatForDetail.unitCode === 'A' ? '#d4af37' : '#555'}>A</text>

                        {/* B (SE Corner) */}
                        <rect x="55" y="55" width="25" height="25" rx="2" 
                          fill={selectedFlatForDetail.unitCode === 'B' ? 'rgba(212,175,55,0.2)' : '#121212'} 
                          stroke={selectedFlatForDetail.unitCode === 'B' ? '#d4af37' : '#333'} 
                          strokeWidth="1" 
                        />
                        <text x="67.5" y="70" textAnchor="middle" className="font-mono text-[8px]" fill={selectedFlatForDetail.unitCode === 'B' ? '#d4af37' : '#555'}>B</text>

                        {/* C (NW Corner) */}
                        <rect x="20" y="20" width="25" height="25" rx="2" 
                          fill={selectedFlatForDetail.unitCode === 'C' ? 'rgba(212,175,55,0.2)' : '#121212'} 
                          stroke={selectedFlatForDetail.unitCode === 'C' ? '#d4af37' : '#333'} 
                          strokeWidth="1" 
                        />
                        <text x="32.5" y="35" textAnchor="middle" className="font-mono text-[8px]" fill={selectedFlatForDetail.unitCode === 'C' ? '#d4af37' : '#555'}>C</text>

                        {/* D (NE Corner) */}
                        <rect x="55" y="20" width="25" height="25" rx="2" 
                          fill={selectedFlatForDetail.unitCode === 'D' ? 'rgba(212,175,55,0.2)' : '#121212'} 
                          stroke={selectedFlatForDetail.unitCode === 'D' ? '#d4af37' : '#333'} 
                          strokeWidth="1" 
                        />
                        <text x="67.5" y="35" textAnchor="middle" className="font-mono text-[8px]" fill={selectedFlatForDetail.unitCode === 'D' ? '#d4af37' : '#555'}>D</text>
                      </svg>
                      <span className="font-mono text-[9px] text-gold-300 font-semibold block mt-3 uppercase tracking-wider text-center px-1">
                        {selectedFlatForDetail.facing}
                      </span>
                    </div>
                    
                    <div className="space-y-3 font-sans text-xs text-neutral-400 font-light leading-relaxed">
                      <p>
                        As a premium <strong>100% Corner Layout</strong>, Suite #{selectedFlatForDetail.id} maximizes daytime penetration and privacy.
                      </p>
                      <p>
                        Sited on Level 0{selectedFlatForDetail.floor}, this elevation claims a distinct scenic wind draft of the Dhaka delta.
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-neutral-850 mt-6 md:mt-0">
                    <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest block mb-1">BUILD ENVELOPE</span>
                    <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono">
                      <ShieldCheck size={12} className="text-gold-400" />
                      <span>RAJUK CODE COMPLIANT</span>
                    </div>
                  </div>
                </div>

                {/* Right Side Panel */}
                <div className="md:w-3/5 p-6 sm:p-8 flex flex-col justify-between bg-neutral-900">
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-4 border-b border-neutral-800 pb-4">
                      <div>
                        <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest block mb-0.5">NET TOTAL CARPET AREA</span>
                        <span className="font-mono text-2xl font-bold text-white flex items-center gap-1.5 leading-none">
                          <Square size={16} className="text-gold-400" />
                          {selectedFlatForDetail.sizeSqFt} SQ FT
                        </span>
                      </div>

                      <span className={`text-[9.5px] font-mono font-bold px-3 py-1 rounded border uppercase tracking-wider ${
                        selectedFlatForDetail.status === 'Available'
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          : selectedFlatForDetail.status === 'Reserved'
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                            : 'bg-neutral-800 border-neutral-750 text-neutral-400'
                      }`}>
                        {selectedFlatForDetail.status}
                      </span>
                    </div>

                    <div className="space-y-4 font-sans text-xs">
                      <div>
                        <span className="text-[8.5px] font-mono text-neutral-500 uppercase tracking-widest block mb-1">IDEAL RESIDENT PROFILE</span>
                        <p className="text-neutral-300 font-light leading-relaxed">{selectedFlatForDetail.idealFor}</p>
                      </div>

                      {/* Layout metrics */}
                      <div className="grid grid-cols-3 gap-3 border-y border-neutral-800 py-3 font-mono text-[10px] my-4 text-center">
                        <div className="p-2 bg-neutral-950/20 rounded">
                          <span className="text-neutral-500 block text-[8px] font-sans">BEDROOM FAMILY</span>
                          <span className="text-white font-bold block mt-0.5">{selectedFlatForDetail.bedrooms} Beds</span>
                        </div>
                        <div className="p-2 bg-neutral-950/20 rounded">
                          <span className="text-neutral-500 block text-[8px] font-sans">BATH TOILETS</span>
                          <span className="text-white font-bold block mt-0.5">{selectedFlatForDetail.bathrooms} Baths</span>
                        </div>
                        <div className="p-2 bg-neutral-950/20 rounded">
                          <span className="text-neutral-500 block text-[8px] font-sans">VERANDA DECKS</span>
                          <span className="text-white font-bold block mt-0.5">{selectedFlatForDetail.verandas} Attached</span>
                        </div>
                      </div>

                      {/* Materials specifications */}
                      <div className="p-3.5 bg-neutral-950/50 rounded-lg border border-neutral-850/60 space-y-2">
                        <span className="text-neutral-500 block text-[8px] font-mono uppercase tracking-widest">INTERIOR PREMIUM SPECIFICATIONS</span>
                        <div className="space-y-1 text-[9.5px] font-mono text-neutral-300 border-t border-neutral-900 pt-1.5">
                          <div className="flex justify-between">
                            <span className="text-neutral-500 font-sans">Living & Reception Salon:</span>
                            <span className="text-neutral-200 text-right">Greek Pentelikon Premium Marble block</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500 font-sans">Master Suite Bed:</span>
                            <span className="text-neutral-200 text-right">Italian Statuario White Marble slab</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500 font-sans">Private Detached Balconies:</span>
                            <span className="text-gold-300 text-right">Premium Brazilian Teak Timber decking</span>
                          </div>
                        </div>
                      </div>

                      {/* Valuation estimates */}
                      <div className="p-3.5 bg-neutral-950/90 rounded-lg border border-neutral-850 flex items-center justify-between">
                        <div>
                          <span className="text-neutral-500 block text-[8px] font-mono uppercase tracking-widest mb-0.5">ESTIMATED VALUATION</span>
                          <span className="font-serif text-xl sm:text-2xl text-gold-300 font-medium leading-none block">
                            {selectedFlatForDetail.priceBDT}
                          </span>
                        </div>
                        <div className="text-right font-mono text-[9px] text-neutral-500 space-y-0.5">
                          <span>Down Payment: ৳15.00 Lakh</span>
                          <span className="block">Installments: 36 Months</span>
                        </div>
                      </div>

                      {/* Status timeline context */}
                      {selectedFlatForDetail.status === 'Available' ? (
                        <div className="p-3 bg-emerald-500/5 rounded border border-emerald-500/10 text-emerald-400/80 font-mono text-[10px] flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Currently open for immediate priority reservation and pre-launch booking.</span>
                        </div>
                      ) : selectedFlatForDetail.status === 'Reserved' ? (
                        <div className="p-3 bg-amber-500/5 rounded border border-amber-500/10 text-amber-400 font-mono text-[10px] space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar size={12} className="text-amber-400" />
                            <strong>Reserved Pre-Registration Windows:</strong>
                          </div>
                          <div className="text-[9.5px] text-neutral-400 pl-4 space-y-0.5">
                            {selectedFlatForDetail.ReservedDates?.map((d, i) => (
                              <div key={`reserved-date-${i}-${d}`} className="flex justify-between max-w-[200px]">
                                <span>• Locked Slot {i+1}:</span>
                                <span className="text-neutral-200">{d}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-neutral-900/60 rounded border border-neutral-850 text-neutral-400 font-mono text-[10px] flex items-center gap-2">
                          <Lock size={12} className="text-neutral-500" />
                          <span>Sold Out. Deed registered & archived in Dhaka Lands Records.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        setSelectedFloor(selectedFlatForDetail.floor);
                        setSelectedUnitId(selectedFlatForDetail.unitCode);
                        handleDownloadPDF();
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-gold-400/40 rounded font-mono text-[0.62rem] uppercase tracking-widest text-neutral-300 hover:text-gold-300 font-bold transition-all cursor-pointer"
                    >
                      <FileDown size={12} className="text-gold-400" />
                      Download Brochure
                    </button>

                    <a
                      href="#contact"
                      onClick={() => setIsDetailModalOpen(false)}
                      className="flex-1 text-center block px-4 py-3 bg-gold-400 hover:bg-gold-350 text-neutral-950 border border-gold-400 rounded font-mono text-[0.62rem] uppercase tracking-widest font-bold text-neutral-950 transition-all cursor-pointer"
                    >
                      {selectedFlatForDetail.status === 'Available' ? 'Reserve Suite Now' : 'Inquire For Transfer'}
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </motion.div>
    </section>
  );
}
