import { Project } from "../types";
import { PROJECT_LIST } from "../data";

export const getArchitectural3DHtmlBlock = (selectedProject: Project | null | undefined, language: "en" | "bn") => {
  const currentProj = selectedProject || PROJECT_LIST[0];
  const isBangla = language === 'bn';
  const projName = isBangla ? currentProj.nameBn : currentProj.name;
  
  // Extract specs
  const landAreaVal = currentProj.specs?.find(s => s.label === "Land Area")?.value || "10 Katha";
  const heightVal = currentProj.specs?.find(s => s.label === "Building Height")?.value || "G + 9 Floors";
  const parsedKatha = parseInt(landAreaVal.replace(/[^0-9]/g, '')) || 10;
  const parsedStoreys = parseInt(heightVal.replace(/[^0-9]/g, '')) || 10;
  const totalStoreys = heightVal.toLowerCase().includes("g +") ? (parsedStoreys + 1) : parsedStoreys;

  // Custom colors and styling based on project ID - Enhanced Luxury Palette
  let colColor = "0x4b5563"; // Steel grey
  let frontFlatsColor = "0xc8a165"; // Champagne Gold
  let rearFlatsColor = "0x334155"; // Slate Slate
  let glassCurtainColor = "0xbae6fd"; // Crystal Cyan
  let louversColor = "0x475569"; // Bronze Slate
  let oasisTurfColor = "0x059669";
  let slabGroundColor = "0x0f172a"; // Dark slate
  let slabExecutiveColor = "0x1e293b"; // Obsidian
  let slabPanoramicColor = "0x2e3b4e"; // Panoramic deep blue
  let slabPenthouseColor = "0x451a03"; // Rooftop deck bronze/brown
  
  if (currentProj.id === "mollik-tower") {
    colColor = "0x4b5563";
    frontFlatsColor = "0xc8a165"; // Beautiful bronze-champagne
    rearFlatsColor = "0x2d3748"; // Obsidian graphite
    glassCurtainColor = "0xa5f3fc"; // Soft translucent cyan
    louversColor = "0x475569";
    slabGroundColor = "0x0f172a";
    slabExecutiveColor = "0x1e293b";
    slabPanoramicColor = "0x232d3d";
    slabPenthouseColor = "0x3d2a1b";
  } else if (currentProj.id === "mollik-heights") {
    colColor = "0x1e293b";
    frontFlatsColor = "0x3b82f6";
    rearFlatsColor = "0x64748b";
    glassCurtainColor = "0xbae6fd";
  } else if (currentProj.id === "mollik-garden") {
    colColor = "0x0f172a";
    frontFlatsColor = "0x10b981";
    rearFlatsColor = "0x059669";
    glassCurtainColor = "0xbae6fd";
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
      touch-action: none;
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

  <!-- Floating Dashboard Toggle for Mobile/Tablet/Desktop Screens -->
  <button id="ui-toggle-btn" style="position: absolute; top: 15px; right: 15px; z-index: 101; background: rgba(8, 11, 22, 0.95); border: 1px solid rgba(212, 175, 55, 0.4); border-radius: 6px; padding: 8px 12px; color: #d4af37; font-family: monospace; font-size: 9px; font-weight: bold; cursor: pointer; backdrop-filter: blur(5px); box-shadow: 0 4px 15px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 6px; transition: all 0.2s;" onclick="toggleUIOverlaySelf()">
    <span>🛠️</span> <span id="toggle-text">COLLAPSE CONTROLS</span>
  </button>

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
    
    // Core Mobile and Tablet device profile inspection for smooth execution
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 1024;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05070f);
    // Disable fog entirely to maintain beautiful, accurate, and pin-sharp graphics even at extreme zoom ranges
    scene.fog = null; 

    const initialWidth = container ? (container.clientWidth || window.innerWidth || 800) : 800;
    const initialHeight = container ? (container.clientHeight || window.innerHeight || 600) : 600;
    const camera = new THREE.PerspectiveCamera(45, initialWidth / initialHeight, 1, 1500);
    camera.position.set(55, 50, 75);

    // Disable antialiasing on low-end mobile architectures to increase throughput by 40%
    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: false, powerPreference: "high-performance", preserveDrawingBuffer: true });
    
    // Set device pixel factor ceiling to avoid sub-pixel layout performance degradation on mobile Retina displays
    renderer.setPixelRatio(isMobile ? Math.min(window.devicePixelRatio || 1, 1.2) : Math.min(window.devicePixelRatio || 1, 2)); 
    
    // Fully bypass dynamic shadow rendering calculations on mobile/tablet to ensure locked 60 FPS
    renderer.shadowMap.enabled = !isMobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
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
    sunLight.castShadow = !isMobile;
    sunLight.shadow.bias = -0.0003;
    if (!isMobile) {
      sunLight.shadow.mapSize.width = 2048; // Boost shadow resolution for professional desktop sharpness
      sunLight.shadow.mapSize.height = 2048;
    }
    scene.add(sunLight);

    const rimSkyLight = new THREE.DirectionalLight(0x38bdf8, 0.5);
    rimSkyLight.position.set(-45, 30, -35);
    scene.add(rimSkyLight);

    // Upward-pointing soft ground-bounce fill light for rich ambient details (GI simulation)
    const groundBounceLight = new THREE.DirectionalLight(0xffeedd, 0.3);
    groundBounceLight.position.set(0, -50, 0);
    scene.add(groundBounceLight);

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

    // Helper function to build detailed inside rooms (partition walls + basic furniture + room labels)
    function createFlatInteriors(unitX, unitY, unitZ, isFront, floorIndex) {
      const interiorGroup = new THREE.Group();
      interiorGroup.position.set(unitX, unitY, unitZ);

      const wallMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.7, metalness: 0.1 });
      const furMat = new THREE.MeshStandardMaterial({ color: 0xc27a3d, roughness: 0.8, metalness: 0.1 });
      const wallH = floorHeight - 0.2;
      const wallThick = 0.15;

      if (isFront) {
        // Front units: width=12.5, depth=13
        // Wall 1: Left vertical partition at x = -2.0, z from -6.5 to 6.5
        const wall1Geo = new THREE.BoxGeometry(wallThick, wallH, 13);
        const wall1 = new THREE.Mesh(wall1Geo, wallMat);
        wall1.position.set(-2.0, wallH / 2, 0);
        interiorGroup.add(wall1);

        // Wall 2: Right vertical partition at x = 2.0, z from -6.5 to 6.5
        const wall2Geo = new THREE.BoxGeometry(wallThick, wallH, 13);
        const wall2 = new THREE.Mesh(wall2Geo, wallMat);
        wall2.position.set(2.0, wallH / 2, 0);
        interiorGroup.add(wall2);

        // Wall 3: Horizontal mid partition at z = 0, x from -6.25 to 6.25
        const wall3Geo = new THREE.BoxGeometry(12.5, wallH, wallThick);
        const wall3 = new THREE.Mesh(wall3Geo, wallMat);
        wall3.position.set(0, wallH / 2, 0);
        interiorGroup.add(wall3);

        // Wall 4: Bath partition at z = -3.0, x from 2.0 to 6.25
        const wall4Geo = new THREE.BoxGeometry(4.25, wallH, wallThick);
        const wall4 = new THREE.Mesh(wall4Geo, wallMat);
        wall4.position.set(4.125, wallH / 2, -3.0);
        interiorGroup.add(wall4);

        // Furniture Blocks
        // Master Bed double bed
        const bed1 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.5, 2.0), furMat);
        bed1.position.set(-4.2, 0.25, 3.25);
        interiorGroup.add(bed1);

        // Bed 2 double bed
        const bed2 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.5, 2.0), furMat);
        bed2.position.set(4.2, 0.25, 3.25);
        interiorGroup.add(bed2);

        // Sofa in Living Room
        const sofa = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.4, 0.8), furMat);
        sofa.position.set(0, 0.2, 3.25);
        interiorGroup.add(sofa);

        // Dining Table
        const table = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.7, 1.0), furMat);
        table.position.set(0, 0.35, -3.25);
        interiorGroup.add(table);

        // Kitchen Counter
        const counter = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.8, 2.5), furMat);
        counter.position.set(-5.0, 0.4, -3.25);
        interiorGroup.add(counter);

        // Room labels
        const lblMB = createTextSprite("M. BED", "#cbd5e1", "rgba(15, 23, 42, 0.7)");
        lblMB.position.set(-4.2, 1.2, 2.0);
        lblMB.scale.set(3.5, 0.9, 1);

        const lblB2 = createTextSprite("BED 2", "#cbd5e1", "rgba(15, 23, 42, 0.7)");
        lblB2.position.set(4.2, 1.2, 2.0);
        lblB2.scale.set(3.5, 0.9, 1);

        const lblLiv = createTextSprite("LIVING", "#d4af37", "rgba(15, 23, 42, 0.7)");
        lblLiv.position.set(0, 1.2, 1.5);
        lblLiv.scale.set(3.5, 0.9, 1);

        const lblDin = createTextSprite("DINING", "#cbd5e1", "rgba(15, 23, 42, 0.7)");
        lblDin.position.set(0, 1.2, -1.5);
        lblDin.scale.set(3.5, 0.9, 1);

        const lblKit = createTextSprite("KITCHEN", "#cbd5e1", "rgba(15, 23, 42, 0.7)");
        lblKit.position.set(-4.2, 1.2, -1.5);
        lblKit.scale.set(3.5, 0.9, 1);

        interiorGroup.add(lblMB, lblB2, lblLiv, lblDin, lblKit);

      } else {
        // Rear units: width=12.5, depth=11
        // Wall 1: Left vertical partition at x = -2.0, z from -5.5 to 5.5
        const wall1Geo = new THREE.BoxGeometry(wallThick, wallH, 11);
        const wall1 = new THREE.Mesh(wall1Geo, wallMat);
        wall1.position.set(-2.0, wallH / 2, 0);
        interiorGroup.add(wall1);

        // Wall 2: Right vertical partition at x = 2.0, z from -5.5 to 5.5
        const wall2Geo = new THREE.BoxGeometry(wallThick, wallH, 11);
        const wall2 = new THREE.Mesh(wall2Geo, wallMat);
        wall2.position.set(2.0, wallH / 2, 0);
        interiorGroup.add(wall2);

        // Wall 3: Horizontal mid partition at z = 0, x from -6.25 to 6.25
        const wall3Geo = new THREE.BoxGeometry(12.5, wallH, wallThick);
        const wall3 = new THREE.Mesh(wall3Geo, wallMat);
        wall3.position.set(0, wallH / 2, 0);
        interiorGroup.add(wall3);

        // Wall 4: Bath partition at z = -2.5, x from 2.0 to 6.25
        const wall4Geo = new THREE.BoxGeometry(4.25, wallH, wallThick);
        const wall4 = new THREE.Mesh(wall4Geo, wallMat);
        wall4.position.set(4.125, wallH / 2, -2.5);
        interiorGroup.add(wall4);

        // Furniture
        // Master Bed double bed
        const bed1 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.5, 2.0), furMat);
        bed1.position.set(-4.2, 0.25, 2.75);
        interiorGroup.add(bed1);

        // Bed 2 double bed
        const bed2 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.5, 2.0), furMat);
        bed2.position.set(4.2, 0.25, 2.75);
        interiorGroup.add(bed2);

        // Sofa in Living Room
        const sofa = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.4, 0.8), furMat);
        sofa.position.set(0, 0.2, 2.75);
        interiorGroup.add(sofa);

        // Dining Table
        const table = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.7, 0.9), furMat);
        table.position.set(0, 0.35, -2.5);
        interiorGroup.add(table);

        // Kitchen Counter
        const counter = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.8, 2.0), furMat);
        counter.position.set(-5.0, 0.4, -2.75);
        interiorGroup.add(counter);

        // Room labels
        const lblMB = createTextSprite("M. BED", "#cbd5e1", "rgba(15, 23, 42, 0.7)");
        lblMB.position.set(-4.2, 1.2, 1.5);
        lblMB.scale.set(3.5, 0.9, 1);

        const lblB2 = createTextSprite("BED 2", "#cbd5e1", "rgba(15, 23, 42, 0.7)");
        lblB2.position.set(4.2, 1.2, 1.5);
        lblB2.scale.set(3.5, 0.9, 1);

        const lblLiv = createTextSprite("LIVING", "#d4af37", "rgba(15, 23, 42, 0.7)");
        lblLiv.position.set(0, 1.2, 1.25);
        lblLiv.scale.set(3.5, 0.9, 1);

        const lblDin = createTextSprite("DINING", "#cbd5e1", "rgba(15, 23, 42, 0.7)");
        lblDin.position.set(0, 1.2, -1.25);
        lblDin.scale.set(3.5, 0.9, 1);

        const lblKit = createTextSprite("KITCHEN", "#cbd5e1", "rgba(15, 23, 42, 0.7)");
        lblKit.position.set(-4.2, 1.2, -1.25);
        lblKit.scale.set(3.5, 0.9, 1);

        interiorGroup.add(lblMB, lblB2, lblLiv, lblDin, lblKit);
      }

      // Tag all meshes and sprites inside this room block with the correct floorIndex
      interiorGroup.traverse((child) => {
        if (child.isMesh || child.isSprite) {
          child.userData = { floorIndex: floorIndex };
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        }
      });

      return interiorGroup;
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
    const matColumns = new THREE.MeshStandardMaterial({ color: ${colColor}, roughness: 0.25, metalness: 0.8, transparent: true, opacity: 1.0 });
    const matCoreArea = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.7, transparent: true, opacity: 1.0 });
    const matFrontFlats = new THREE.MeshStandardMaterial({ color: ${frontFlatsColor}, transparent: true, opacity: 0.22, roughness: 0.2, metalness: 0.8 }); // Unit A/B Translucent Glass
    const matRearFlats = new THREE.MeshStandardMaterial({ color: ${rearFlatsColor}, transparent: true, opacity: 0.22, roughness: 0.3, metalness: 0.6 }); // Unit C/D Translucent Glass
    const matGlassCurtain = new THREE.MeshStandardMaterial({ color: ${glassCurtainColor}, transparent: true, opacity: 0.55, roughness: 0.05, metalness: 0.95 });
    const matLouvers = new THREE.MeshStandardMaterial({ color: ${louversColor}, roughness: 0.3, metalness: 0.8, transparent: true, opacity: 1.0 });
    const matOasisTurf = new THREE.MeshStandardMaterial({ color: ${oasisTurfColor}, roughness: 0.9, transparent: true, opacity: 1.0 });
    const matSetbackDanger = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.15 });

    // 4 Distinct Slab types/materials to color-code vertical tiers of the G+9 tower (Clearly Visible & Understandable)
    const matSlabGround = new THREE.MeshStandardMaterial({ color: ${slabGroundColor}, roughness: 0.9, metalness: 0.1, transparent: true, opacity: 1.0 }); // Ground Floor Asphalt & Pavers
    const matSlabExecutive = new THREE.MeshStandardMaterial({ color: ${slabExecutiveColor}, roughness: 0.60, metalness: 0.2, transparent: true, opacity: 1.0 }); // Levels 1 to 3 Executive
    const matSlabPanoramic = new THREE.MeshStandardMaterial({ color: ${slabPanoramicColor}, roughness: 0.45, metalness: 0.3, transparent: true, opacity: 1.0 }); // Levels 4 to 7 Panoramic (Crema Beige look)
    const matSlabPenthouse = new THREE.MeshStandardMaterial({ color: ${slabPenthouseColor}, roughness: 0.25, metalness: 0.4, transparent: true, opacity: 1.0 }); // Levels 8 to 9 Penthouse (White & Gold)

    const floorHeight = 3.2; 
    const totalStoreys = ${totalStoreys};
    const roofLevelY = totalStoreys * floorHeight;

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

    const tierMid = Math.floor(totalStoreys * 0.3);
    const tierHigh = Math.floor(totalStoreys * 0.7);

    for (let tier = 0; tier < totalStoreys; tier++) {
      const currentY = tier * floorHeight;

      // Structural Column Tapering logic
      let colWidth = 1.3;
      let colDepth = 0.9;
      if (tier >= tierMid && tier < tierHigh) { colWidth = 1.0; colDepth = 0.7; }
      else if (tier >= tierHigh) { colWidth = 0.8; colDepth = 0.5; }

      columnBaseGrid.forEach((coord, idx) => {
        const colGeo = new THREE.BoxGeometry(colWidth, floorHeight - 0.02, colDepth);
        const colMesh = new THREE.Mesh(colGeo, matColumns);
        colMesh.position.set(coord[0], currentY + floorHeight / 2, coord[1]);
        colMesh.castShadow = true;
        colMesh.receiveShadow = true;
        colMesh.userData = { floorIndex: tier };
        columnsGroup.add(colMesh);

        // High-fidelity column edge outline
        const colEdges = new THREE.EdgesGeometry(colGeo);
        const colLineMat = new THREE.LineBasicMaterial({ 
          color: 0xffffff, 
          transparent: true, 
          opacity: 0.15 
        });
        const colLine = new THREE.LineSegments(colEdges, colLineMat);
        colLine.position.copy(colMesh.position);
        colLine.userData = { floorIndex: tier };
        columnsGroup.add(colLine);

        // Label pillar size dynamically on a few columns in step 2
        if (idx === 7 && (tier === 1 || tier === Math.floor(totalStoreys / 2) || tier === totalStoreys - 2)) {
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

        const foyerEdges = new THREE.EdgesGeometry(foyerGeo);
        const foyerLineMat = new THREE.LineBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.25 });
        const foyerLine = new THREE.LineSegments(foyerEdges, foyerLineMat);
        foyerLine.position.copy(foyerMesh.position);
        foyerLine.userData = { floorIndex: tier };
        columnsGroup.add(foyerLine);

        const mechWingGeo = new THREE.BoxGeometry(32, floorHeight, 6);
        const mechWing = new THREE.Mesh(mechWingGeo, matLouvers);
        mechWing.position.set(0, currentY + floorHeight / 2, -13);
        mechWing.userData = { floorIndex: tier };
        columnsGroup.add(mechWing);

        const mechEdges = new THREE.EdgesGeometry(mechWingGeo);
        const mechLineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 });
        const mechLine = new THREE.LineSegments(mechEdges, mechLineMat);
        mechLine.position.copy(mechWing.position);
        mechLine.userData = { floorIndex: tier };
        columnsGroup.add(mechLine);
      } else {
        // Elevator & Core Shaft blocks (Circulation Core)
        const coreBoxGeo = new THREE.BoxGeometry(7, floorHeight - 0.02, 10);
        const coreBoxMesh = new THREE.Mesh(coreBoxGeo, matCoreArea);
        coreBoxMesh.position.set(0, currentY + floorHeight / 2, 0);
        coreBoxMesh.castShadow = true;
        coreBoxMesh.userData = { floorIndex: tier };
        coreGroup.add(coreBoxMesh);

        const coreEdges = new THREE.EdgesGeometry(coreBoxGeo);
        const coreLineMat = new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.25 });
        const coreLine = new THREE.LineSegments(coreEdges, coreLineMat);
        coreLine.position.copy(coreBoxMesh.position);
        coreLine.userData = { floorIndex: tier };
        coreGroup.add(coreLine);

        // Unit A & B (SW/SE facing - Amber style)
        const unitAGeo = new THREE.BoxGeometry(12.5, floorHeight - 0.1, 13);
        const unitAMesh = new THREE.Mesh(unitAGeo, matFrontFlats);
        unitAMesh.position.set(-10.2, currentY + floorHeight / 2, 9.5);
        unitAMesh.castShadow = true;
        unitAMesh.userData = { floorIndex: tier };
        flatsGroup.add(unitAMesh);

        const unitAEdges = new THREE.EdgesGeometry(unitAGeo);
        const unitALineMat = new THREE.LineBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.25 });
        const unitALine = new THREE.LineSegments(unitAEdges, unitALineMat);
        unitALine.position.copy(unitAMesh.position);
        unitALine.userData = { floorIndex: tier };
        flatsGroup.add(unitALine);

        const unitBMesh = unitAMesh.clone();
        unitBMesh.position.x = 10.2;
        unitBMesh.userData = { floorIndex: tier };
        flatsGroup.add(unitBMesh);

        const unitBLine = new THREE.LineSegments(unitAEdges, unitALineMat);
        unitBLine.position.copy(unitBMesh.position);
        unitBLine.userData = { floorIndex: tier };
        flatsGroup.add(unitBLine);

        // balconies & louvers representation
        const frontRailGeo = new THREE.BoxGeometry(32.8, floorHeight - 0.8, 0.1);
        const frontRail = new THREE.Mesh(frontRailGeo, matGlassCurtain);
        frontRail.position.set(0, currentY + floorHeight / 2, 15.5);
        frontRail.userData = { floorIndex: tier };
        flatsGroup.add(frontRail);

        // Unit C & D (NW/NE facing - Orchid style)
        const unitCGeo = new THREE.BoxGeometry(12.5, floorHeight - 0.1, 11);
        const unitCMesh = new THREE.Mesh(unitCGeo, matRearFlats);
        unitCMesh.position.set(-10.2, currentY + floorHeight / 2, -10.5);
        unitCMesh.castShadow = true;
        unitCMesh.userData = { floorIndex: tier };
        flatsGroup.add(unitCMesh);

        const unitCEdges = new THREE.EdgesGeometry(unitCGeo);
        const unitCLineMat = new THREE.LineBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.2 });
        const unitCLine = new THREE.LineSegments(unitCEdges, unitCLineMat);
        unitCLine.position.copy(unitCMesh.position);
        unitCLine.userData = { floorIndex: tier };
        flatsGroup.add(unitCLine);

        const unitDMesh = unitCMesh.clone();
        unitDMesh.position.x = 10.2;
        unitDMesh.userData = { floorIndex: tier };
        flatsGroup.add(unitDMesh);

        const unitDLine = new THREE.LineSegments(unitCEdges, unitCLineMat);
        unitDLine.position.copy(unitDMesh.position);
        unitDLine.userData = { floorIndex: tier };
        flatsGroup.add(unitDLine);

        // Aesthetic Louvers
        const slatGeo = new THREE.BoxGeometry(0.1, floorHeight - 0.1, 5);
        const lLeft = new THREE.Mesh(slatGeo, matLouvers);
        lLeft.position.set(-16.6, currentY + floorHeight / 2, 0);
        lLeft.userData = { floorIndex: tier };
        const lRight = lLeft.clone();
        lRight.position.x = 16.6;
        lRight.userData = { floorIndex: tier };
        flatsGroup.add(lLeft, lRight);

        // Instantiate detailed 3D inside room layouts and furniture
        const intA = createFlatInteriors(-10.2, currentY, 9.5, true, tier);
        const intB = createFlatInteriors(10.2, currentY, 9.5, true, tier);
        const intC = createFlatInteriors(-10.2, currentY, -10.5, false, tier);
        const intD = createFlatInteriors(10.2, currentY, -10.5, false, tier);
        flatsGroup.add(intA, intB, intC, intD);
      }

      // 4-Layers Color-coded vertical tiers of floor slabs
      let slabMat = matSlabExecutive;
      if (tier === 0) slabMat = matSlabGround;
      else if (tier >= 1 && tier < tierMid) slabMat = matSlabExecutive;
      else if (tier >= tierMid && tier < tierHigh) slabMat = matSlabPanoramic;
      else slabMat = matSlabPenthouse;

      const floorSlabGeo = new THREE.BoxGeometry(33.8, 0.12, 31.8);
      const slabMesh = new THREE.Mesh(floorSlabGeo, slabMat);
      slabMesh.position.set(0, currentY + floorHeight, 0);
      slabMesh.receiveShadow = true;
      slabMesh.userData = { floorIndex: tier };
      completeBuildingGroup.add(slabMesh);

      // High-fidelity slab edge outline
      const slabEdges = new THREE.EdgesGeometry(floorSlabGeo);
      const slabLineMat = new THREE.LineBasicMaterial({ 
        color: 0xd4af37, 
        transparent: true, 
        opacity: 0.2 
      });
      const slabLine = new THREE.LineSegments(slabEdges, slabLineMat);
      slabLine.position.copy(slabMesh.position);
      slabLine.userData = { floorIndex: tier };
      completeBuildingGroup.add(slabLine);
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
    coreMetricsSprite.position.set(0, roofLevelY + 4, 6);
    coreGroup.add(coreMetricsSprite);

    // Dimensions lines inside Central core
    const liftCoreArrow = createDimensionLine(new THREE.Vector3(-3.5, roofLevelY + 1, 5), new THREE.Vector3(3.5, roofLevelY + 1, 5), 0x2563eb);
    coreGroup.add(liftCoreArrow);

    // Tapering Columns grid description labels
    const taperingLabel = createTextSprite("BNBC CODES: COLUMN MATRIX TAPERING (1.3m to 0.8m)", "#38bdf8");
    taperingLabel.position.set(0, roofLevelY + 3, -16);
    columnsGroup.add(taperingLabel);


    // 4. Typical Floor Splits and specifications
    const midBuildingHeightY = (totalStoreys * floorHeight) / 2;
    const splitTagA = createTextSprite("UNIT A (SW): 920 SQ FT | 3 BEDROOMS", "#d4af37");
    splitTagA.position.set(-16, midBuildingHeightY, 17);
    flatsGroup.add(splitTagA);

    const splitTagB = createTextSprite("UNIT B (SE): 920 SQ FT | 3 BEDROOMS", "#d4af37");
    splitTagB.position.set(16, midBuildingHeightY, 17);
    flatsGroup.add(splitTagB);

    const splitTagC = createTextSprite("UNIT C (NW): 880 SQ FT | 3 BEDROOMS", "#a855f7");
    splitTagC.position.set(-16, midBuildingHeightY, -17);
    flatsGroup.add(splitTagC);

    const splitTagD = createTextSprite("UNIT D (NE): 880 SQ FT | 3 BEDROOMS", "#a855f7");
    splitTagD.position.set(16, midBuildingHeightY, -17);
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
    // roofLevelY is declared above
    
    const oasisTurfGeo = new THREE.BoxGeometry(33.2, 0.1, 31.2);
    const oasisTurf = new THREE.Mesh(oasisTurfGeo, matOasisTurf);
    oasisTurf.position.set(0, roofLevelY + 0.05, 0);
    oasisTurf.userData = { floorIndex: totalStoreys };
    roofGroup.add(oasisTurf);

    // High-fidelity outline for oasisTurf
    const turfEdges = new THREE.EdgesGeometry(oasisTurfGeo);
    const turfLineMat = new THREE.LineBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.2 });
    const turfLine = new THREE.LineSegments(turfEdges, turfLineMat);
    turfLine.position.copy(oasisTurf.position);
    turfLine.userData = { floorIndex: totalStoreys };
    roofGroup.add(turfLine);

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
    poolWater.userData = { floorIndex: totalStoreys };
    roofGroup.add(poolWater);
    
    // Pool stone border
    const poolBorderGeo = new THREE.BoxGeometry(10.8, 0.18, 8.3);
    const poolBorderMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.85 });
    const poolBorder = new THREE.Mesh(poolBorderGeo, poolBorderMat);
    poolBorder.position.set(-9.5, roofLevelY + 0.09, 5.5);
    poolBorder.userData = { floorIndex: totalStoreys };
    roofGroup.add(poolBorder);
    
    const poolLabel = createTextSprite("ROOFTOP POOL & INFINITY DECK", "#38bdf8", "rgba(8, 11, 22, 0.9)");
    poolLabel.position.set(-9.5, roofLevelY + 2.0, 5.5);
    poolLabel.scale.set(6, 1.4, 1);
    poolLabel.userData = { floorIndex: totalStoreys };
    roofGroup.add(poolLabel);

    // Beautiful pergola structure with beams
    const pergolaStructuralGeo = new THREE.BoxGeometry(12, 2.8, 14);
    const pergolaMesh = new THREE.Mesh(pergolaStructuralGeo, matLouvers);
    pergolaMesh.position.set(0, roofLevelY + 1.4, 0);
    pergolaMesh.castShadow = true;
    pergolaMesh.userData = { floorIndex: totalStoreys };
    roofGroup.add(pergolaMesh);

    // Glass Balustrades
    const safetyGlassGeo = new THREE.BoxGeometry(33, 1.2, 31);
    const safetyGlass = new THREE.Mesh(safetyGlassGeo, matGlassCurtain);
    safetyGlass.position.set(0, roofLevelY + 0.6, 0);
    safetyGlass.userData = { floorIndex: totalStoreys };
    roofGroup.add(safetyGlass);

    // Solar panels representations (Active sustainable energy grid)
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x1e1e38, roughness: 0.1, metalness: 0.9 });
    const panelGeo = new THREE.BoxGeometry(4, 0.1, 2.5);
    for (let s = 0; s < 4; s++) {
      const panel = new THREE.Mesh(panelGeo, panelMat);
      panel.position.set(-10 + (s * 6.5), roofLevelY + 0.2, -10);
      panel.rotation.x = -0.3; // Tilt solar panels
      panel.userData = { floorIndex: totalStoreys };
      roofGroup.add(panel);
    }

    const roofSustainSprite = createTextSprite("15KW INTEGRATED SOLAR ARRAY - COMPLIANCE", "#10b981");
    roofSustainSprite.position.set(0, roofLevelY + 3.5, -10);
    roofSustainSprite.userData = { floorIndex: totalStoreys };
    roofGroup.add(roofSustainSprite);

    const roofOasisSprite = createTextSprite("COMMUNITY ROOFTOP GARDEN OASIS", "#34d399");
    roofOasisSprite.position.set(0, roofLevelY + 4, 3);
    roofOasisSprite.userData = { floorIndex: totalStoreys };
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
      } else {
        matFrontFlats.wireframe = false;
        matRearFlats.wireframe = false;
        matFrontFlats.opacity = 0.22;
        matFrontFlats.color.setHex(0xb58e2d);
        matRearFlats.opacity = 0.22;
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
      matFrontFlats.opacity = 0.22;
      matRearFlats.opacity = 0.22;
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

    const baseBuildingHeight = 32.0;
    const actualBuildingHeight = totalStoreys * floorHeight;
    const scaleFactorY = actualBuildingHeight / baseBuildingHeight;

    function smoothCameraTransition(camX, camY, camZ, tarX, tarY, tarZ) {
      // Scale camera Y and target Y dynamically based on actual building height to keep it centered
      const adjustedCamY = camY * scaleFactorY;
      const adjustedTarY = tarY * scaleFactorY;
      camera.position.set(camX, adjustedCamY, camZ);
      controls.target.set(tarX, adjustedTarY, tarZ);
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
        btn.innerHTML = '👑 Toggle VR Stereo View';
        
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
      ctx.fillText('MOLLIK TOWER // FIELD QUALITY VERIFICATION LOG', 16, sourceH + 26);
      
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
      
      liftTime += 0.015;
      
      if (autoRotateActive) {
        completeBuildingGroup.rotation.y += 0.0012;
      } else {
        completeBuildingGroup.rotation.y = 0; // standard view lock
      }

      // Actively animate elevators dynamically scaled to building height
      const maxLiftHeight = (totalStoreys - 1.5) * floorHeight;
      elevatorCab1.position.y = 1.5 + Math.abs(Math.sin(liftTime)) * maxLiftHeight;
      elevatorCab2.position.y = 1.5 + Math.abs(Math.cos(liftTime + 1.5)) * maxLiftHeight;
      
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

    window.toggleUIOverlaySelf = function() {
      const overlay = document.getElementById('ui-overlay');
      const textSpan = document.getElementById('toggle-text');
      if (overlay) {
        // Simple check of display or opacity
        const isHidden = (overlay.style.display === 'none' || overlay.style.opacity === '0');
        if (isHidden) {
          overlay.style.display = 'block';
          setTimeout(() => { overlay.style.opacity = '1'; }, 10);
          if (textSpan) textSpan.innerText = 'COLLAPSE CONTROLS';
        } else {
          overlay.style.opacity = '0';
          setTimeout(() => { overlay.style.display = 'none'; }, 200);
          if (textSpan) textSpan.innerText = 'EXPAND CONTROLS';
        }
      }
    };

    // Dismiss the internal loader once setup is fully initialized and render is ready
    setTimeout(() => {
      const loaderElement = document.getElementById('three-loader');
      if (loaderElement) {
        loaderElement.style.opacity = '0';
        loaderElement.style.visibility = 'hidden';
      }
      
      // Auto-collapse control panel on narrow mobile/tablet screens to give maximum room for 3D navigation
      if (isMobile) {
        const overlay = document.getElementById('ui-overlay');
        const textSpan = document.getElementById('toggle-text');
        if (overlay) {
          overlay.style.opacity = '0';
          overlay.style.display = 'none';
        }
        if (textSpan) {
          textSpan.innerText = 'EXPAND CONTROLS';
        }
      }
    }, 450);

    animate();
  </script>
</body>
</html>
`;
};
