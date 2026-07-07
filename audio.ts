// Dynamic Synthesizer using Web Audio API to avoid external asset dependencies.
// Plays drum hits, synth, guitar, and custom sound effects for correct/incorrect actions.

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private sequencerInterval: any = null;
  private currentStep = 0;
  private loopChannels: { [key: string]: boolean } = {
    kick: true,
    hihat: false,
    bass: false,
    synth: false,
    guitar: false,
    snare: false,
    scratch: false,
  };
  private onStepCallback: ((step: number) => void) | null = null;

  constructor() {
    // Audio Context is initialized on first user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMutedState() {
    return this.isMuted;
  }

  private createNoiseBuffer() {
    const ctx = this.initCtx();
    const bufferSize = ctx.sampleRate * 0.4; // 0.4 seconds of noise
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // 1. Kick Drum
  public playKick() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(1.0, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // 2. Snare Drum
  public playSnare() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = this.createNoiseBuffer();

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 1000;

      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = 180;

      const gain = ctx.createGain();
      const oscGain = ctx.createGain();

      noiseNode.connect(filter);
      filter.connect(gain);
      
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0.7, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

      oscGain.gain.setValueAtTime(0.5, ctx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      noiseNode.start(ctx.currentTime);
      osc.start(ctx.currentTime);

      noiseNode.stop(ctx.currentTime + 0.25);
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // 3. Hi-Hat
  public playHihat() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const noise = ctx.createBufferSource();
      noise.buffer = this.createNoiseBuffer();

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 8000;
      filter.Q.value = 3;

      const gain = ctx.createGain();

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      noise.start(ctx.currentTime);
      noise.stop(ctx.currentTime + 0.08);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // 4. Synthesizer Lead Melody
  public playSynth(freq = 440, duration = 0.4, type: OscillatorType = 'triangle') {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Add simple vibrato
      if (duration > 0.2) {
        osc.frequency.linearRampToValueAtTime(freq * 1.01, ctx.currentTime + duration * 0.5);
        osc.frequency.linearRampToValueAtTime(freq * 0.99, ctx.currentTime + duration);
      }

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // 5. Electric Guitar Pluck / Synth
  public playGuitar(freq = 220) {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      // Physical modeling guitar sound approximation (filtered saw + decay)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(freq, ctx.currentTime);
      
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 1.005, ctx.currentTime); // detune slightly

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3000, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.6);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.8);
      osc2.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // 6. Bass Synth Line
  public playBass(freq = 82) { // E2
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.9, ctx.currentTime + 0.4);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 350;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // 7. DJ Scratch Effect
  public playScratch() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.08);
      osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.16);
      osc.frequency.linearRampToValueAtTime(1000, ctx.currentTime + 0.24);

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1500;
      filter.Q.value = 1.0;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // Success UI Sound (High Sweet Chord)
  public playSuccess() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      // Synthesize a cute Spanish-vibe major chord arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        const startTime = now + index * 0.08;
        const duration = 0.4;
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // Fail UI Sound (Low sliding tone)
  public playFail() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // Sequencer beat loop controls
  public setLoopChannel(channel: string, active: boolean) {
    this.loopChannels[channel] = active;
  }

  public getChannelStatus(channel: string) {
    return !!this.loopChannels[channel];
  }

  public startSequencer(onStep: (step: number) => void) {
    this.onStepCallback = onStep;
    if (this.sequencerInterval) return;

    const tempo = 120; // BPM
    const stepDuration = 60 / tempo / 2; // Eighth notes (250ms per step)

    // Trigger step loop
    this.sequencerInterval = setInterval(() => {
      this.currentStep = (this.currentStep + 1) % 8;
      this.playSequencerStep(this.currentStep);
      if (this.onStepCallback) {
        this.onStepCallback(this.currentStep);
      }
    }, stepDuration * 1000);
  }

  public stopSequencer() {
    if (this.sequencerInterval) {
      clearInterval(this.sequencerInterval);
      this.sequencerInterval = null;
    }
  }

  private playSequencerStep(step: number) {
    if (this.isMuted) return;
    // Step is 0 to 7 (8-step loop)
    // 1. Kick on 0 and 4
    if (this.loopChannels.kick && (step === 0 || step === 4)) {
      this.playKick();
    }
    // 2. Snare on 2 and 6
    if (this.loopChannels.snare && (step === 2 || step === 6)) {
      this.playSnare();
    }
    // 3. Hi-hat on every odd step
    if (this.loopChannels.hihat && (step % 2 === 1)) {
      this.playHihat();
    }
    // 4. Bass note pattern on 0, 3, 5
    if (this.loopChannels.bass) {
      if (step === 0) this.playBass(82.41); // E2
      if (step === 3) this.playBass(98.00); // G2
      if (step === 5) this.playBass(110.00); // A2
    }
    // 5. Synth note pattern on 1, 4, 7
    if (this.loopChannels.synth) {
      if (step === 1) this.playSynth(329.63, 0.15, 'sawtooth'); // E4
      if (step === 4) this.playSynth(392.00, 0.15, 'sawtooth'); // G4
      if (step === 7) this.playSynth(440.00, 0.2, 'sawtooth'); // A4
    }
    // 6. Guitar chords on 2 and 6
    if (this.loopChannels.guitar) {
      if (step === 2) this.playGuitar(220.00); // A3
      if (step === 6) this.playGuitar(261.63); // C4
    }
    // 7. Scratch sound on step 7 occasionally
    if (this.loopChannels.scratch && step === 7) {
      this.playScratch();
    }
  }
}

export const djsynth = new AudioEngine();
