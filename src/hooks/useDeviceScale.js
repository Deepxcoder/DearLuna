import { useEffect } from 'react';

/**
 * useDeviceScale
 *
 * Detects the real device viewport size and aspect ratio, classifies it into
 * a scale tier, then injects CSS custom properties into :root so that all
 * pages can consume fluid, device-appropriate sizing without any hard-coded
 * breakpoint rewrites.
 *
 * Exposed globally as window.__deviceInfo for debugging.
 */

// ─── Tier Definitions ───────────────────────────────────────────────────────
const TIERS = {
  xs: {
    // Very small phones (< 380px wide)
    fontXs: '8px',   fontSm: '10px',  fontBase: '12px',
    fontLg: '14px',  fontXl: '16px',  font2xl: '20px',  font3xl: '24px',
    space1: '3px',   space2: '6px',   space4: '10px',
    space6: '14px',  space8: '20px',
    radius: '20px',  cardPad: '12px', iconSize: '14px',
    cycleDial: '160px', scale: '0.75',
  },
  sm: {
    // Standard phones portrait (380–640px)
    fontXs: '9px',   fontSm: '11px',  fontBase: '13px',
    fontLg: '15px',  fontXl: '18px',  font2xl: '22px',  font3xl: '28px',
    space1: '4px',   space2: '8px',   space4: '12px',
    space6: '16px',  space8: '24px',
    radius: '24px',  cardPad: '14px', iconSize: '16px',
    cycleDial: '180px', scale: '0.82',
  },
  md: {
    // Tablets / phones landscape (640–1024px)
    fontXs: '9px',   fontSm: '11px',  fontBase: '14px',
    fontLg: '16px',  fontXl: '20px',  font2xl: '26px',  font3xl: '32px',
    space1: '4px',   space2: '8px',   space4: '14px',
    space6: '20px',  space8: '28px',
    radius: '28px',  cardPad: '18px', iconSize: '18px',
    cycleDial: '200px', scale: '0.90',
  },
  lg: {
    // Standard laptops (1024–1400px)
    fontXs: '10px',  fontSm: '12px',  fontBase: '14px',
    fontLg: '18px',  fontXl: '22px',  font2xl: '28px',  font3xl: '36px',
    space1: '4px',   space2: '8px',   space4: '16px',
    space6: '24px',  space8: '32px',
    radius: '32px',  cardPad: '22px', iconSize: '20px',
    cycleDial: '220px', scale: '1.00',
  },
  xl: {
    // Large desktops / 4K (> 1400px)
    fontXs: '10px',  fontSm: '12px',  fontBase: '15px',
    fontLg: '20px',  fontXl: '24px',  font2xl: '32px',  font3xl: '42px',
    space1: '5px',   space2: '10px',  space4: '18px',
    space6: '28px',  space8: '40px',
    radius: '40px',  cardPad: '28px', iconSize: '22px',
    cycleDial: '260px', scale: '1.10',
  },
};

// ─── Tier Picker ─────────────────────────────────────────────────────────────
function pickTier(vw, vh) {
  const ratio = vw / vh;

  // Ultrawide: scale up slightly but constrain card inner padding
  if (ratio > 2.1 && vw >= 1400) return 'xl';

  if (vw < 380)  return 'xs';
  if (vw < 640)  return 'sm';
  if (vw < 1024) return 'md';
  if (vw < 1400) return 'lg';
  return 'xl';
}

// ─── CSS Variable Injector ────────────────────────────────────────────────────
function applyTier(tierName, vw, vh) {
  const t = TIERS[tierName];
  const ratio = (vw / vh).toFixed(4);
  const ar    = (() => {
    function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
    const d = gcd(vw, vh);
    return `${vw / d}:${vh / d}`;
  })();

  const root = document.documentElement;

  root.style.setProperty('--ui-scale',       t.scale);
  root.style.setProperty('--ui-font-xs',     t.fontXs);
  root.style.setProperty('--ui-font-sm',     t.fontSm);
  root.style.setProperty('--ui-font-base',   t.fontBase);
  root.style.setProperty('--ui-font-lg',     t.fontLg);
  root.style.setProperty('--ui-font-xl',     t.fontXl);
  root.style.setProperty('--ui-font-2xl',    t.font2xl);
  root.style.setProperty('--ui-font-3xl',    t.font3xl);
  root.style.setProperty('--ui-space-1',     t.space1);
  root.style.setProperty('--ui-space-2',     t.space2);
  root.style.setProperty('--ui-space-4',     t.space4);
  root.style.setProperty('--ui-space-6',     t.space6);
  root.style.setProperty('--ui-space-8',     t.space8);
  root.style.setProperty('--ui-radius',      t.radius);
  root.style.setProperty('--ui-card-pad',    t.cardPad);
  root.style.setProperty('--ui-icon-size',   t.iconSize);
  root.style.setProperty('--ui-cycle-dial',  t.cycleDial);

  // Expose debug info globally
  window.__deviceInfo = {
    tier: tierName,
    viewport: { width: vw, height: vh },
    physicalResolution: {
      width:  Math.round(vw  * (window.devicePixelRatio || 1)),
      height: Math.round(vh  * (window.devicePixelRatio || 1)),
    },
    aspectRatio: ar,
    aspectRatioDecimal: ratio,
    devicePixelRatio: window.devicePixelRatio || 1,
    orientation: vw > vh ? 'Landscape' : 'Portrait',
    tokens: t,
  };

  console.debug(
    `%c📐 DearLuna Scale Tier: ${tierName.toUpperCase()}`,
    'color:#D291BC;font-weight:bold;font-size:13px;',
    `| ${vw}×${vh} | AR ${ar} (${ratio}) | DPR ${window.devicePixelRatio || 1}`
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useDeviceScale() {
  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const tier = pickTier(vw, vh);
      applyTier(tier, vw, vh);
    };

    // Run immediately on mount
    update();

    // Re-run on resize (debounced 100ms)
    let timer;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(update, 100);
    };

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(timer);
    };
  }, []);
}
