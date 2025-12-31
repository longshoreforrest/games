/**
 * VIUHTIN HOITO - Musiikki
 * Koira-aiheinen taustamusiikki Web Audio API:lla
 */

class GameMusic {
    constructor() {
        this.audioContext = null;
        this.isPlaying = false;
        this.masterGain = null;
        this.melodyTimeout = null;
        this.currentNoteIndex = 0;

        // Iloinen koira-melodia (nuotit Hz:nä)
        this.melody = [
            // Intro - iloinen hyppy
            { note: 523.25, duration: 0.2 },  // C5
            { note: 587.33, duration: 0.2 },  // D5
            { note: 659.25, duration: 0.3 },  // E5
            { note: 523.25, duration: 0.2 },  // C5
            { note: 0, duration: 0.1 },       // tauko

            // Haukkuva rytmi
            { note: 392.00, duration: 0.15 }, // G4
            { note: 440.00, duration: 0.15 }, // A4
            { note: 392.00, duration: 0.15 }, // G4
            { note: 0, duration: 0.2 },       // tauko

            // Leikkisä osa
            { note: 523.25, duration: 0.25 }, // C5
            { note: 587.33, duration: 0.25 }, // D5
            { note: 659.25, duration: 0.25 }, // E5
            { note: 698.46, duration: 0.25 }, // F5
            { note: 659.25, duration: 0.4 },  // E5
            { note: 0, duration: 0.2 },       // tauko

            // Hännänheilutus-osa
            { note: 493.88, duration: 0.15 }, // B4
            { note: 523.25, duration: 0.15 }, // C5
            { note: 493.88, duration: 0.15 }, // B4
            { note: 523.25, duration: 0.15 }, // C5
            { note: 493.88, duration: 0.15 }, // B4
            { note: 523.25, duration: 0.3 },  // C5
            { note: 0, duration: 0.3 },       // tauko

            // Tassuttelua
            { note: 329.63, duration: 0.2 },  // E4
            { note: 349.23, duration: 0.2 },  // F4
            { note: 392.00, duration: 0.2 },  // G4
            { note: 440.00, duration: 0.3 },  // A4
            { note: 392.00, duration: 0.2 },  // G4
            { note: 349.23, duration: 0.2 },  // F4
            { note: 329.63, duration: 0.4 },  // E4
            { note: 0, duration: 0.4 },       // tauko

            // Iloinen lopetus
            { note: 523.25, duration: 0.2 },  // C5
            { note: 659.25, duration: 0.2 },  // E5
            { note: 783.99, duration: 0.4 },  // G5
            { note: 0, duration: 0.5 },       // pidempi tauko
        ];

        // Bassokuvio
        this.bassPattern = [
            { note: 130.81, duration: 0.5 },  // C3
            { note: 164.81, duration: 0.5 },  // E3
            { note: 196.00, duration: 0.5 },  // G3
            { note: 164.81, duration: 0.5 },  // E3
        ];

        this.bassIndex = 0;
    }

    init() {
        if (this.audioContext) return;

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Master volume
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.value = 0.3;
        this.masterGain.connect(this.audioContext.destination);
    }

    createOscillator(frequency, type = 'sine', duration = 0.3) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = type;
        oscillator.frequency.value = frequency;

        // ADSR envelope
        const now = this.audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.02);
        gainNode.gain.linearRampToValueAtTime(0.2, now + duration * 0.3);
        gainNode.gain.linearRampToValueAtTime(0, now + duration);

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        oscillator.start(now);
        oscillator.stop(now + duration);

        return oscillator;
    }

    playNote(noteData) {
        if (!this.isPlaying || !noteData) return;

        if (noteData.note > 0) {
            // Melodia (triangle wave - pehmeämpi ääni)
            this.createOscillator(noteData.note, 'triangle', noteData.duration);
        }
    }

    playBass() {
        if (!this.isPlaying) return;

        const bassNote = this.bassPattern[this.bassIndex];
        this.createOscillator(bassNote.note, 'sine', bassNote.duration * 0.8);

        this.bassIndex = (this.bassIndex + 1) % this.bassPattern.length;
    }

    playMelody() {
        if (!this.isPlaying) return;

        const noteData = this.melody[this.currentNoteIndex];
        this.playNote(noteData);

        // Soita basso joka toisella nuotilla
        if (this.currentNoteIndex % 4 === 0) {
            this.playBass();
        }

        this.currentNoteIndex = (this.currentNoteIndex + 1) % this.melody.length;

        // Seuraava nuotti
        const nextDuration = noteData.duration * 1000;
        this.melodyTimeout = setTimeout(() => this.playMelody(), nextDuration);
    }

    start() {
        if (this.isPlaying) return;

        this.init();
        this.isPlaying = true;
        this.currentNoteIndex = 0;
        this.bassIndex = 0;

        // Resume context if suspended
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        this.playMelody();
    }

    stop() {
        this.isPlaying = false;
        if (this.melodyTimeout) {
            clearTimeout(this.melodyTimeout);
            this.melodyTimeout = null;
        }
    }

    toggle() {
        if (this.isPlaying) {
            this.stop();
        } else {
            this.start();
        }
        return this.isPlaying;
    }

    setVolume(value) {
        if (this.masterGain) {
            this.masterGain.gain.value = Math.max(0, Math.min(1, value));
        }
    }

    // Ääniefektit
    playBark() {
        if (!this.audioContext) this.init();

        // Haukkuääni
        const now = this.audioContext.currentTime;

        // Ensimmäinen hau
        this.createBarkSound(now);
        // Toinen hau
        this.createBarkSound(now + 0.3);
    }

    createBarkSound(startTime) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, startTime);
        osc.frequency.linearRampToValueAtTime(150, startTime + 0.1);

        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.linearRampToValueAtTime(0, startTime + 0.15);

        osc.connect(gain);
        gain.connect(this.masterGain || this.audioContext.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.15);
    }

    playHappy() {
        if (!this.audioContext) this.init();

        // Iloinen ääni
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
        notes.forEach((note, i) => {
            setTimeout(() => {
                this.createOscillator(note, 'sine', 0.15);
            }, i * 100);
        });
    }

    playSad() {
        if (!this.audioContext) this.init();

        // Surullinen ääni
        const notes = [392.00, 349.23, 293.66]; // G4, F4, D4
        notes.forEach((note, i) => {
            setTimeout(() => {
                this.createOscillator(note, 'sine', 0.3);
            }, i * 200);
        });
    }

    playSuccess() {
        if (!this.audioContext) this.init();

        // Onnistumisääni
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((note, i) => {
            setTimeout(() => {
                this.createOscillator(note, 'triangle', 0.2);
            }, i * 80);
        });
    }

    playPoop() {
        if (!this.audioContext) this.init();

        // Hauska "oops" ääni
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, this.audioContext.currentTime);
        osc.frequency.linearRampToValueAtTime(100, this.audioContext.currentTime + 0.3);

        gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(this.masterGain || this.audioContext.destination);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.3);
    }

    playCleanup() {
        if (!this.audioContext) this.init();

        // Siivous/pop ääni
        const notes = [800, 1000, 1200];
        notes.forEach((freq, i) => {
            setTimeout(() => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();

                osc.type = 'sine';
                osc.frequency.value = freq;

                gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.1);

                osc.connect(gain);
                gain.connect(this.masterGain || this.audioContext.destination);

                osc.start();
                osc.stop(this.audioContext.currentTime + 0.1);
            }, i * 50);
        });
    }
}

// Global instance
const gameMusic = new GameMusic();
