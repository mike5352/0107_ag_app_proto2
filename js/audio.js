class AudioManager {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.enabled = true;
    }

    // Simple Synth for SFX to avoid loading external files for prototype
    playTone(freq, type, duration) {
        if (!this.enabled) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playClick() {
        // High pitch "Pop"
        this.playTone(600, 'sine', 0.1);
    }

    playSuccess() {
        // Major Arpeggio
        this.playTone(400, 'triangle', 0.2);
        setTimeout(() => this.playTone(500, 'triangle', 0.2), 100);
        setTimeout(() => this.playTone(600, 'triangle', 0.4), 200);
    }

    playStart() {
        // Low to High sweep
        this.playTone(200, 'sine', 0.5); // Simple placeholder
    }

    resumeAudioContext() {
        // Browser policy requires user interaction
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }
}

window.audioManager = new AudioManager();
