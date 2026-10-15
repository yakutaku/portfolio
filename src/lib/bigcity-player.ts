// Plays BigCity renders in sync and crossfades between the two nearest to the knob,
// the way turning City size moves between the plugin's settings.

export class BigCityPlayer {
  private ctx: AudioContext | null = null;
  private gains: GainNode[] = [];
  private analyser: AnalyserNode | null = null;
  private bins = new Uint8Array(0);
  private size = 0.5;
  private loading: Promise<void> | null = null;

  /**
   * Each file holds `pad` seconds of wrapped audio, the loop itself, then `pad` more.
   * Looping only the middle keeps the loop seamless even when a browser's AAC decoder
   * shifts the audio by a few milliseconds of encoder padding.
   */
  constructor(
    private readonly urls: readonly string[],
    private readonly loopSeconds: number,
    private readonly pad: number,
  ) {}

  get playing() {
    return this.ctx?.state === 'running';
  }

  /** Must be called from a tap or click: browsers only allow audio to start from a user gesture. */
  async play(): Promise<void> {
    if (!this.ctx) {
      // On iOS, Web Audio obeys the silent switch unless the session is marked as playback.
      const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
      if (session) session.type = 'playback';
      this.ctx = new AudioContext();
    }
    const resuming = this.ctx.resume(); // called synchronously inside the gesture
    this.loading ??= this.load(this.ctx);
    await Promise.all([resuming, this.loading]);
  }

  async pause(): Promise<void> {
    await this.ctx?.suspend();
  }

  setSize(value: number): void {
    this.size = Math.min(1, Math.max(0, value));
    this.applyGains();
  }

  /** 0–1 loudness of the low end (kick and bass), for driving visuals. */
  energy(): number {
    if (!this.analyser || !this.playing) return 0;
    this.analyser.getByteFrequencyData(this.bins);
    const lowBins = Math.max(1, Math.floor(this.bins.length * 0.08));
    let sum = 0;
    for (let i = 0; i < lowBins; i++) sum += this.bins[i];
    return Math.min(1, Math.max(0, (sum / lowBins / 255 - 0.35) / 0.5));
  }

  dispose(): void {
    void this.ctx?.close();
    this.ctx = null;
  }

  private async load(ctx: AudioContext): Promise<void> {
    const buffers = await Promise.all(
      this.urls.map(async (url) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Couldn't load ${url} (${response.status})`);
        return ctx.decodeAudioData(await response.arrayBuffer());
      }),
    );

    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 512;
    this.analyser.smoothingTimeConstant = 0.6;
    this.bins = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.connect(ctx.destination);

    // Start every loop at the same instant so they stay sample-locked.
    const startAt = ctx.currentTime + 0.05;
    this.gains = buffers.map((buffer) => {
      const gain = ctx.createGain();
      gain.gain.value = 0;
      gain.connect(this.analyser!);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.loopStart = this.pad;
      source.loopEnd = this.pad + this.loopSeconds;
      source.connect(gain);
      source.start(startAt, this.pad);
      return gain;
    });
    this.applyGains(true);
  }

  private applyGains(immediate = false): void {
    if (!this.ctx || this.gains.length === 0) return;
    const last = this.gains.length - 1;
    const position = this.size * last;
    const lower = Math.min(Math.floor(position), last - 1);
    const t = position - Math.max(lower, 0);
    this.gains.forEach((gain, i) => {
      // Equal-power crossfade keeps loudness steady between two renders.
      let target = 0;
      if (last === 0) target = 1;
      else if (i === lower) target = Math.cos((t * Math.PI) / 2);
      else if (i === lower + 1) target = Math.sin((t * Math.PI) / 2);
      if (immediate) gain.gain.value = target;
      else gain.gain.setTargetAtTime(target, this.ctx!.currentTime, 0.03);
    });
  }
}
