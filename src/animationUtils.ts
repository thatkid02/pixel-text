import { AnimationOptions } from './types';
import { soundManager } from './soundUtils';

export interface AnimationState {
    visiblePixels: boolean[][];
    isAnimating: boolean;
}

export class AnimationManager {
    private pattern: boolean[][];
    private visiblePixels: boolean[][];
    private intervalId: ReturnType<typeof setInterval> | null = null;
    private frameDelay: number = 50; // Default frame delay

    constructor(pattern: boolean[][]) {
        this.pattern = pattern;
        this.visiblePixels = pattern.map(row => row.map(() => false));
    }

    private cleanup() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    async animate(options: AnimationOptions, onUpdate: (state: AnimationState) => void): Promise<void> {
        this.cleanup();

        if (options.mode === 'all-together') {
            this.visiblePixels = this.pattern.map(row => row.map(cell => cell));
            onUpdate({ 
                visiblePixels: this.visiblePixels,
                isAnimating: false
            });
            return;
        }

        this.visiblePixels = this.pattern.map(row => row.map(() => false));
        onUpdate({ 
            visiblePixels: this.visiblePixels,
            isAnimating: true
        });

        let pixelCount = 0;
        const totalPixels = this.pattern.reduce((acc, row) => acc + row.filter(cell => cell).length, 0);

        return new Promise((resolve) => {
            this.intervalId = setInterval(() => {
                if (pixelCount >= totalPixels) {
                    this.cleanup();
                    onUpdate({ 
                        visiblePixels: this.visiblePixels,
                        isAnimating: false
                    });
                    resolve();
                    return;
                }

                let found = false;
                const newPixels = this.visiblePixels.map(row => [...row]);

                // Find next pixel to reveal
                for (let i = 0; i < this.pattern.length && !found; i++) {
                    for (let j = 0; j < this.pattern[i].length && !found; j++) {
                        if (this.pattern[i][j] && !this.visiblePixels[i][j]) {
                            newPixels[i][j] = true;
                            found = true;

                            // Play sound if enabled
                            if (options.soundType !== 'none') {
                                soundManager.playSound({
                                    type: options.soundType,
                                    volume: options.soundVolume,
                                    pitch: options.soundPitch
                                });
                            }
                        }
                    }
                }

                this.visiblePixels = newPixels;
                onUpdate({ 
                    visiblePixels: this.visiblePixels,
                    isAnimating: true
                });
                pixelCount++;
            }, options.speed);
        });
    }

    start(onUpdate?: (state: AnimationState) => void) {
        if (this.intervalId) return;
        
        this.intervalId = setInterval(() => {
            // animation logic
            if (onUpdate) onUpdate({ 
                visiblePixels: this.visiblePixels,
                isAnimating: true
            });
        }, this.frameDelay);
    }

    cancel(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    isRunning(): boolean {
        return this.intervalId !== null;
    }

    dispose(): void {
        this.cleanup();
    }
} 