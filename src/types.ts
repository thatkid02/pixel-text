import { SoundType } from './soundUtils';

export type ColorMode = 'solid' | 'preset' | 'rainbow' | 'wave' | 'random';
export type AnimationMode = 'pixel-by-pixel' | 'all-together';
export type PixelShape = 'square' | 'circle' | 'diamond' | 'triangle';

export type ColorPreset = {
    name: string;
    colors: string[];
};

export const COLOR_PRESETS: ColorPreset[] = [
    {
        name: 'Forest',
        colors: ['#134E5E', '#71B280', '#2C5364']
    },
    {
        name: 'Sunset',
        colors: ['#FF512F', '#F09819', '#FF6B6B']
    },
    {
        name: 'Ocean',
        colors: ['#2193b0', '#6dd5ed', '#4CA1AF']
    },
    {
        name: 'Candy',
        colors: ['#FF69B4', '#FF1493', '#FFB6C1']
    },
    {
        name: 'Neon',
        colors: ['#00FF00', '#FF00FF', '#00FFFF']
    },
    {
        name: 'Retro',
        colors: ['#4B0082', '#9400D3', '#8A2BE2']
    }
];

export interface AnimationOptions {
    mode: AnimationMode;
    speed: number;
    soundType: SoundType;
    soundVolume?: number;
    soundPitch?: number;
}

export interface RenderOptions {
    pixelShape: PixelShape;
    borderRadius?: number; // For rounded corners on squares
    rotation?: number; // For rotating shapes like diamonds
}

export interface ColorOptions {
    mode: ColorMode;
    primaryColor?: string;
    presetName?: string;
    speed?: number;
    backgroundEnabled?: boolean;
    backgroundColor?: string;
}

export interface PatternOptions {
    width: number;
    height: number;
    font: string;
    fontFamily?: string; // Added for multiple font support
    fontWeight?: string | number;
    fontStyle?: 'normal' | 'italic';
    threshold?: number;
    colorOptions?: ColorOptions;
    animationOptions?: AnimationOptions;
    renderOptions?: RenderOptions;
}

export const AVAILABLE_FONTS = [
    { label: 'Monospace', value: 'monospace' },
    { label: 'Arial', value: 'Arial' },
    { label: 'Times New Roman', value: 'Times New Roman' },
    { label: 'Courier New', value: 'Courier New' },
    { label: 'Georgia', value: 'Georgia' },
    { label: 'Verdana', value: 'Verdana' },
    { label: 'Impact', value: 'Impact' }
];

export const DEFAULT_PATTERN_OPTIONS: PatternOptions = {
    width: Math.max(5, 10),
    height: Math.max(5, 16),
    font: '12px monospace',
    fontFamily: 'monospace',
    threshold: 128,
    colorOptions: {
        mode: 'solid',
        primaryColor: '#000000',
        backgroundEnabled: false,
        backgroundColor: '#ffffff'
    },
    animationOptions: {
        mode: 'all-together',
        speed: 50,
        soundType: 'pop',
        soundVolume: 0.1,
        soundPitch: 800
    },
    renderOptions: {
        pixelShape: 'square',
        borderRadius: 0,
        rotation: 0
    }
};

export const PIXEL_SHAPES: { label: string; value: PixelShape }[] = [
    { label: 'Square', value: 'square' },
    { label: 'Circle', value: 'circle' },
    { label: 'Diamond', value: 'diamond' },
    { label: 'Triangle', value: 'triangle' }
];

export const COLOR_MODES: { label: string; value: ColorMode }[] = [
    { label: 'Solid', value: 'solid' },
    { label: 'Preset', value: 'preset' },
    { label: 'Rainbow', value: 'rainbow' },
    { label: 'Wave', value: 'wave' },
    { label: 'Random', value: 'random' }
];

export const ANIMATION_MODES: { label: string; value: AnimationMode }[] = [
    { label: 'All Together', value: 'all-together' },
    { label: 'Pixel by Pixel', value: 'pixel-by-pixel' }
];

export const SOUND_TYPES: { label: string; value: SoundType }[] = [
    { label: 'None', value: 'none' },
    { label: 'Beep', value: 'beep' },
    { label: 'Click', value: 'click' },
    { label: 'Pop', value: 'pop' }
]; 