import { PatternOptions, DEFAULT_PATTERN_OPTIONS } from './types';

/**
 * Generates a boolean grid pattern for a single letter
 * @param letter - The letter to convert to a pattern
 * @param options - Configuration options for pattern generation
 * @returns A 2D boolean array representing the pixel pattern
 */
export const generateLetterPattern = (
    letter: string,
    options: PatternOptions = DEFAULT_PATTERN_OPTIONS
): boolean[][] => {
    if (typeof window === 'undefined') {
        throw new Error('This function requires a browser environment with Canvas support');
    }

    const width = Math.max(5, options.width);
    const height = Math.max(5, options.height);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Calculate a slightly smaller font size to ensure padding
    const fontSize = parseInt(options.font);
    const adjustedFont = options.font.replace(
        /\d+px/, 
        `${Math.floor(fontSize * 0.8)}px`
    );

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#000';
    ctx.font = adjustedFont;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    
    // Position text in the center with slight vertical adjustment
    const verticalOffset = Math.floor(height * 0.1);
    ctx.fillText(letter, width / 2, height / 2 + verticalOffset);

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const grid: boolean[][] = [];
    const threshold = options.threshold ?? DEFAULT_PATTERN_OPTIONS.threshold ?? 128;

    for (let y = 0; y < height; y++) {
        const row: boolean[] = [];
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const alpha = data[index + 3];
            row.push(alpha > threshold);
        }
        grid.push(row);
    }
    return grid;
};

/**
 * Generates patterns for a string of text
 * @param text - The text to convert to patterns
 * @param options - Configuration options for pattern generation
 * @returns An array of 2D boolean arrays, one for each character
 */
export const generateTextPatterns = (
    text: string,
    options?: Partial<PatternOptions>
): boolean[][][] => {
    const finalOptions = { ...DEFAULT_PATTERN_OPTIONS, ...options };
    return text.split('').map(letter => generateLetterPattern(letter, finalOptions));
}; 