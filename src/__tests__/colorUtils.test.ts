import { 
    hslToHex,
    getIntensityColor,
    getRainbowColor,
    getWaveColor,
    getRandomColor,
    getPresetColor
} from '../colorUtils';
import { COLOR_PRESETS } from '../types';

describe('colorUtils', () => {
    describe('hslToHex', () => {
        it('should convert HSL to hex color', () => {
            expect(hslToHex(0, 100, 50)).toBe('#ff0000');   // Red
            expect(hslToHex(120, 100, 50)).toBe('#00ff00'); // Green
            expect(hslToHex(240, 100, 50)).toBe('#0000ff'); // Blue
        });

        it('should handle edge cases', () => {
            expect(hslToHex(0, 0, 0)).toBe('#000000');    // Black
            expect(hslToHex(0, 0, 100)).toBe('#ffffff');  // White
            expect(hslToHex(0, 0, 50)).toBe('#808080');   // Gray
        });
    });

    describe('getIntensityColor', () => {
        it('should return color with correct alpha', () => {
            expect(getIntensityColor(255, '#000000')).toBe('rgba(0, 0, 0, 1)');
            expect(getIntensityColor(128, '#000000')).toBe('rgba(0, 0, 0, 0.5019607843137255)');
            expect(getIntensityColor(0, '#000000')).toBe('rgba(0, 0, 0, 0)');
        });

        it('should handle different colors', () => {
            expect(getIntensityColor(255, '#ff0000')).toBe('rgba(255, 0, 0, 1)');
            expect(getIntensityColor(128, '#00ff00')).toBe('rgba(0, 255, 0, 0.5019607843137255)');
        });

        it('should return color as is if not hex', () => {
            expect(getIntensityColor(255, 'rgb(0,0,0)')).toBe('rgb(0,0,0)');
        });
    });

    describe('getRainbowColor', () => {
        it('should generate rainbow colors based on index', () => {
            const colors = Array(6).fill(0).map((_, i) => getRainbowColor(i, 6));
            expect(colors).toHaveLength(6);
            expect(colors[0]).toBe('#ff0000'); // Red
            expect(colors[2]).toBe('#00ff00'); // Green
            expect(colors[4]).toBe('#0000ff'); // Blue
        });
    });

    describe('getWaveColor', () => {
        it('should generate wave colors based on index and time', () => {
            const colors = Array(6).fill(0).map((_, i) => getWaveColor(i, 6, 0));
            expect(colors).toHaveLength(6);
            
            const colorsWithTime = Array(6).fill(0).map((_, i) => getWaveColor(i, 6, 180));
            expect(colorsWithTime).toHaveLength(6);
            expect(colorsWithTime[0]).not.toBe(colors[0]); // Colors should shift with time
        });
    });

    describe('getRandomColor', () => {
        it('should generate valid hex colors', () => {
            const color = getRandomColor();
            expect(color).toMatch(/^#[0-9a-f]{6}$/i);
        });

        it('should generate different colors', () => {
            const color1 = getRandomColor();
            const color2 = getRandomColor();
            expect(color1).not.toBe(color2);
        });
    });

    describe('getPresetColor', () => {
        it('should return colors from preset', () => {
            const sunset = COLOR_PRESETS.find(p => p.name === 'Sunset');
            expect(sunset).toBeDefined();
            
            const color = getPresetColor(0, 3, 'Sunset');
            expect(color.toLowerCase()).toBe(sunset?.colors[0].toLowerCase());
        });

        it('should handle invalid preset name', () => {
            expect(getPresetColor(0, 3, 'NonExistent')).toBe('#000000');
        });

        it('should interpolate between colors', () => {
            const color = getPresetColor(1.5, 3, 'Sunset');
            expect(color).not.toBe(COLOR_PRESETS[0].colors[0]);
            expect(color).not.toBe(COLOR_PRESETS[0].colors[1]);
        });
    });
}); 