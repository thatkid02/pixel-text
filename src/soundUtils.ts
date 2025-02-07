export type SoundType = 'beep' | 'click' | 'pop' | 'none';

export interface SoundOptions {
    type: SoundType;
    volume?: number;
    pitch?: number;
}

class SoundManager {
    private audioContext: AudioContext | null = null;

    private getAudioContext(): AudioContext {
        if (!this.audioContext) {
            this.audioContext = new AudioContext();
        }
        return this.audioContext;
    }

    private async createBeepSound(options: SoundOptions): Promise<void> {
        const ctx = this.getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(options.pitch || 800, ctx.currentTime);
        gainNode.gain.setValueAtTime(options.volume || 0.1, ctx.currentTime);

        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.05);
    }

    private async createClickSound(options: SoundOptions): Promise<void> {
        const ctx = this.getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(options.pitch || 1000, ctx.currentTime);
        gainNode.gain.setValueAtTime(options.volume || 0.1, ctx.currentTime);

        // Quick attack and decay for click sound
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.05);
    }

    private async createPopSound(options: SoundOptions): Promise<void> {
        const ctx = this.getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        // Frequency sweep for pop sound
        oscillator.frequency.setValueAtTime(150, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(options.pitch || 40, ctx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(options.volume || 0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.1);
    }

    async playSound(options: SoundOptions): Promise<void> {
        try {
            await this.getAudioContext().resume();

            switch (options.type) {
                case 'beep':
                    await this.createBeepSound(options);
                    break;
                case 'click':
                    await this.createClickSound(options);
                    break;
                case 'pop':
                    await this.createPopSound(options);
                    break;
                case 'none':
                default:
                    break;
            }
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    }

    dispose(): void {
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
    }
}

export const soundManager = new SoundManager(); 