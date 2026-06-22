// Estado do céu para o ciclo dia/noite — função PURA (sem THREE), testável.

const NIGHT = { r: 0.04, g: 0.06, b: 0.16 }; // céu de noite (azul bem escuro)
const DAY = { r: 0.53, g: 0.72, b: 0.91 }; // céu de dia (0x87b7e8)
const DUSK = { r: 1.0, g: 0.49, b: 0.23 }; // alvorada/entardecer (laranja)

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const smoothstep = (x) => x * x * (3 - 2 * x);
const lerp = (a, b, t) => a + (b - a) * t;

function mix(c1, c2, t) {
  return { r: lerp(c1.r, c2.r, t), g: lerp(c1.g, c2.g, t), b: lerp(c1.b, c2.b, t) };
}

/**
 * @param {number} t fração do dia em [0,1) — meio-dia ≈ 0.25, meia-noite ≈ 0.75
 * @returns {{sunDir:{x,y,z}, sunIntensity:number, ambient:number, hemi:number,
 *            sky:{r,g,b}, fog:{r,g,b}, day:number}}
 */
export function skyState(t) {
  const ang = t * Math.PI * 2;
  const elev = Math.sin(ang); // -1 (meia-noite) .. 1 (meio-dia)

  // 0 (noite) .. 1 (dia), com crepúsculo suave
  const day = smoothstep(clamp01((elev + 0.1) / 0.4));

  // cor do céu: noite→dia, com tinta de horizonte (nascer/pôr do sol)
  let sky = mix(NIGHT, DAY, day);
  const dusk = Math.exp(-(elev * elev) / 0.02); // pico quando o sol está no horizonte
  sky = mix(sky, DUSK, dusk * 0.45);

  // direção do sol (normalizada); leve inclinação no Z
  const cx = Math.cos(ang);
  const sy = Math.sin(ang);
  const cz = 0.35;
  const len = Math.hypot(cx, sy, cz) || 1;

  return {
    sunDir: { x: cx / len, y: sy / len, z: cz / len },
    sunIntensity: lerp(0.06, 1.6, day),
    ambient: lerp(0.08, 0.3, day),
    hemi: lerp(0.18, 0.7, day),
    sky,
    fog: sky,
    day,
  };
}
