/**
 * deviceInfo.js
 * Utility script to detect screen size, aspect ratio, resolution & device type.
 * Usage: import { getDeviceInfo } from './deviceInfo.js';
 *    or: just include via <script src="deviceInfo.js"></script> and call getDeviceInfo()
 */

function getDeviceInfo() {
  // --- Screen (physical display) ---
  const screenWidth  = window.screen.width;
  const screenHeight = window.screen.height;
  const devicePixelRatio = window.devicePixelRatio || 1;

  // Physical resolution (actual pixels on the display)
  const physicalWidth  = Math.round(screenWidth  * devicePixelRatio);
  const physicalHeight = Math.round(screenHeight * devicePixelRatio);

  // --- Viewport (browser window content area) ---
  const viewportWidth  = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // --- Aspect Ratio ---
  function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
  const divisor = gcd(screenWidth, screenHeight);
  const aspectRatio = `${screenWidth / divisor}:${screenHeight / divisor}`;
  const aspectRatioDecimal = (screenWidth / screenHeight).toFixed(4);

  // --- Device Type Detection ---
  function detectDeviceType() {
    const ua = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(ua)) return 'Tablet';
    if (/mobile|iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua)) return 'Mobile';
    return 'Desktop';
  }

  // --- Orientation ---
  const orientation = screenWidth > screenHeight ? 'Landscape' : 'Portrait';

  const info = {
    screen: {
      width:  screenWidth,
      height: screenHeight,
    },
    viewport: {
      width:  viewportWidth,
      height: viewportHeight,
    },
    physicalResolution: {
      width:  physicalWidth,
      height: physicalHeight,
      label:  `${physicalWidth} x ${physicalHeight} px`,
    },
    aspectRatio:        aspectRatio,
    aspectRatioDecimal: aspectRatioDecimal,
    devicePixelRatio:   devicePixelRatio,
    deviceType:         detectDeviceType(),
    orientation:        orientation,
  };

  return info;
}

// Auto-log to console when script is loaded
(function () {
  const info = getDeviceInfo();

  console.group('%c📱 Device Info', 'color: #a78bfa; font-size: 14px; font-weight: bold;');
  console.log(`Device Type        : ${info.deviceType}`);
  console.log(`Orientation        : ${info.orientation}`);
  console.log(`Screen Size        : ${info.screen.width} x ${info.screen.height} px`);
  console.log(`Viewport Size      : ${info.viewport.width} x ${info.viewport.height} px`);
  console.log(`Physical Resolution: ${info.physicalResolution.label}`);
  console.log(`Aspect Ratio       : ${info.aspectRatio} (${info.aspectRatioDecimal})`);
  console.log(`Device Pixel Ratio : ${info.devicePixelRatio}`);
  console.groupEnd();
})();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getDeviceInfo };
}
