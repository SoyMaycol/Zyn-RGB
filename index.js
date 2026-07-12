const DEFAULT_NAME = 'rgb';

function clamp(v) {
  return Math.max(0, Math.min(255, Math.round(v)));
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => clamp(x).toString(16).padStart(2, '0')).join('');
}

function hueToHex(h, s = 1, l = 0.5) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let [r1, g1, b1] = [0, 0, 0];

  if (hp >= 0 && hp < 1) [r1, g1, b1] = [c, x, 0];
  else if (hp < 2) [r1, g1, b1] = [x, c, 0];
  else if (hp < 3) [r1, g1, b1] = [0, c, x];
  else if (hp < 4) [r1, g1, b1] = [0, x, c];
  else if (hp < 5) [r1, g1, b1] = [x, 0, c];
  else [r1, g1, b1] = [c, 0, x];

  const m = l - c / 2;
  return rgbToHex((r1 + m) * 255, (g1 + m) * 255, (b1 + m) * 255);
}

function buildRgbTheme(tick = Date.now()) {
  const hue = ((tick / 16) % 360 + 360) % 360;
  const accent = hueToHex(hue, 1, 0.58);
  const accentSoft = hueToHex((hue + 30) % 360, 1, 0.66);
  const accentDim = hueToHex((hue + 330) % 360, 0.95, 0.46);

  return {
    label: 'RGB',
    bg: '#06070a',
    surface: '#0d1016',
    surfaceHi: '#121824',
    text: '#f5f7ff',
    textDim: '#d2d8ff',
    textMuted: '#9ca7d9',
    textGhost: '#6f79a8',
    textInvis: '#434a70',
    accent,
    accentSoft,
    accentDim,
    green: hueToHex((hue + 120) % 360, 1, 0.58),
    greenDim: hueToHex((hue + 120) % 360, 0.9, 0.46),
    red: hueToHex((hue + 330) % 360, 1, 0.58),
    redDim: hueToHex((hue + 330) % 360, 0.85, 0.46),
    amber: hueToHex((hue + 60) % 360, 1, 0.58),
    amberDim: hueToHex((hue + 60) % 360, 0.85, 0.46),
    purple: hueToHex((hue + 270) % 360, 1, 0.58),
    purpleDim: hueToHex((hue + 270) % 360, 0.85, 0.46),
    blue: hueToHex((hue + 210) % 360, 1, 0.58),
    blueDim: hueToHex((hue + 210) % 360, 0.85, 0.46),
    cyan: hueToHex((hue + 180) % 360, 1, 0.58),
    cyanDim: hueToHex((hue + 180) % 360, 0.85, 0.46),
    border: hueToHex((hue + 300) % 360, 0.65, 0.22),
    borderLight: hueToHex((hue + 300) % 360, 0.75, 0.32),
    codeBg: '#090b10',
    spinFrames: ['◐', '◓', '◑', '◒'],
    spinMs: 70,
    borderStyle: 'double',
  };
}

let intervalId = null;
let lastSent = 0;

function register(ctx = {}) {
  global.__zynThemeRegistry = global.__zynThemeRegistry || {};
  global.__zynThemeRegistry[DEFAULT_NAME] = buildRgbTheme();

  const pushTheme = () => {
    global.__zynThemeRegistry[DEFAULT_NAME] = buildRgbTheme();
    const now = Date.now();
    if (global.__zynCurrentThemeName === DEFAULT_NAME && typeof global.__zynApplyTheme === 'function' && now - lastSent >= 100) {
      lastSent = now;
      global.__zynApplyTheme(DEFAULT_NAME);
    }
  };

  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(pushTheme, 120);
  if (intervalId && typeof intervalId.unref === 'function') intervalId.unref();

  if (typeof ctx.registerTool === 'function') {
    ctx.registerTool({
      name: 'rgb_status',
      description: 'Shows the current RGB theme color snapshot.',
      fn: () => {
        const theme = global.__zynThemeRegistry?.[DEFAULT_NAME] || buildRgbTheme();
        return {
          ok: true,
          name: DEFAULT_NAME,
          accent: theme.accent,
          surface: theme.surface,
        };
      },
    });
  }

  return {
    type: 'theme',
    name: 'zyn-theme-rgb',
    themeName: DEFAULT_NAME,
  };
}

module.exports = { register };
