// Sons procedurais via Web Audio API — sem arquivos. Import seguro em Node
// (AudioContext criado lazy dentro de resume()).

export function createSound() {
  let ctx = null;
  let master = null;
  let enabled = true;

  function resume() {
    if (typeof window === 'undefined') return; // fora do browser
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
  }

  // envelope simples: ataque rápido + decaimento exponencial
  function env(gain, dur, peak) {
    const t = ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(peak, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  }

  function noise(dur) {
    const n = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    return src;
  }

  // quebrar: rajada de ruído filtrado (crunch)
  function playBreak() {
    if (!ctx || !enabled) return;
    const src = noise(0.18);
    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.value = 1800;
    const g = ctx.createGain();
    env(g, 0.18, 0.5);
    src.connect(filt).connect(g).connect(master);
    src.start();
    src.stop(ctx.currentTime + 0.2);
  }

  // colocar: toque grave curto (tok)
  function playPlace() {
    if (!ctx || !enabled) return;
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    const t = ctx.currentTime;
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.12);
    const g = ctx.createGain();
    env(g, 0.14, 0.4);
    osc.connect(g).connect(master);
    osc.start();
    osc.stop(t + 0.16);
  }

  // passo: toque suave e baixo
  function playStep() {
    if (!ctx || !enabled) return;
    const src = noise(0.08);
    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.value = 500;
    const g = ctx.createGain();
    env(g, 0.08, 0.12);
    src.connect(filt).connect(g).connect(master);
    src.start();
    src.stop(ctx.currentTime + 0.1);
  }

  function toggle() {
    enabled = !enabled;
    return enabled;
  }

  return { resume, playBreak, playPlace, playStep, toggle };
}
