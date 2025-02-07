import { ColorOptions, COLOR_PRESETS } from './types';

export function hslToHex(h: number, s: number, l: number): string {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

export function getIntensityColor(alpha: number, primaryColor: string = '#000000'): string {
    const intensity = alpha / 255;
    if (!primaryColor.startsWith('#')) return primaryColor;
    
    const r = parseInt(primaryColor.slice(1, 3), 16);
    const g = parseInt(primaryColor.slice(3, 5), 16);
    const b = parseInt(primaryColor.slice(5, 7), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${intensity})`;
}

export function getRainbowColor(index: number, total: number): string {
    const hue = (index / total) * 360;
    return hslToHex(hue, 100, 50);
}

export function getWaveColor(index: number, total: number, time: number): string {
    const hue = ((index / total) * 360 + time) % 360;
    return hslToHex(hue, 100, 50);
}

export function getGradientColor(index: number, total: number, stops: string[]): string {
    const position = index / (total - 1);
    const stopIndex = position * (stops.length - 1);
    const start = Math.floor(stopIndex);
    const end = Math.min(start + 1, stops.length - 1);
    const progress = stopIndex - start;

    if (start === end) return stops[start];

    const startColor = stops[start];
    const endColor = stops[end];

    // Linear interpolation between colors
    const r1 = parseInt(startColor.slice(1, 3), 16);
    const g1 = parseInt(startColor.slice(3, 5), 16);
    const b1 = parseInt(startColor.slice(5, 7), 16);
    
    const r2 = parseInt(endColor.slice(1, 3), 16);
    const g2 = parseInt(endColor.slice(3, 5), 16);
    const b2 = parseInt(endColor.slice(5, 7), 16);

    const r = Math.round(r1 + (r2 - r1) * progress);
    const g = Math.round(g1 + (g2 - g1) * progress);
    const b = Math.round(b1 + (b2 - b1) * progress);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function getRandomColor(): string {
    return `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
}

export function getPresetColor(index: number, total: number, presetName: string): string {
    // Find the preset by name, fallback to first preset if not found
    const preset = COLOR_PRESETS.find(p => p.name === presetName);
    if (!preset || !preset.colors || preset.colors.length === 0) {
        return '#000000'; // Default color if preset is invalid
    }

    // Calculate color indices and progress
    const position = (index / total) * preset.colors.length;
    const colorIndex = Math.floor(position) % preset.colors.length;
    const nextColorIndex = (colorIndex + 1) % preset.colors.length;
    const progress = position - Math.floor(position);

    const color1 = preset.colors[colorIndex];
    const color2 = preset.colors[nextColorIndex];

    // Validate hex colors
    if (!color1?.startsWith('#') || !color2?.startsWith('#') || 
        color1.length !== 7 || color2.length !== 7) {
        return '#000000'; // Default color if colors are invalid
    }

    // Linear interpolation between colors
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);
    
    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);

    const r = Math.round(r1 + (r2 - r1) * progress);
    const g = Math.round(g1 + (g2 - g1) * progress);
    const b = Math.round(b1 + (b2 - b1) * progress);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function getPixelColor(
    cell: boolean,
    index: number,
    total: number,
    colorOptions: ColorOptions,
    time: number = 0
): string {
    if (!cell && !colorOptions.backgroundEnabled) return 'transparent';
    if (!cell) return colorOptions.backgroundColor || 'transparent';

    switch (colorOptions.mode) {
        case 'preset':
            if (!colorOptions.presetName) {
                // If no preset name is provided, use the first preset
                return getPresetColor(index, total, COLOR_PRESETS[0].name);
            }
            return getPresetColor(index, total, colorOptions.presetName);
        case 'rainbow':
            return getRainbowColor(index, total);
        case 'wave':
            return getWaveColor(index, total, time);
        case 'random':
            return getRandomColor();
        case 'solid':
        default:
            return colorOptions.primaryColor || '#000000';
    }
} 