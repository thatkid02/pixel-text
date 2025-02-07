import { generateLetterPattern, generateTextPatterns } from '../letterUtils';
import '../__mocks__/canvasMock';

describe('letterUtils', () => {
    const defaultOptions = {
        width: 10,
        height: 10,
        font: 'default',
        threshold: 0.5
    };

    describe('generateLetterPattern', () => {
        it('should generate pattern with default options', () => {
            const pattern = generateLetterPattern('A', defaultOptions);
            expect(pattern).toBeDefined();
            expect(pattern.length).toBeGreaterThan(0);
        });

        it('should handle custom dimensions', () => {
            const pattern = generateLetterPattern('B', { 
                ...defaultOptions,
                width: 20, 
                height: 20 
            });
            expect(pattern).toBeDefined();
            expect(pattern.length).toBe(20);
            expect(pattern[0].length).toBe(20);
        });

        it('should enforce minimum dimensions', () => {
            const pattern = generateLetterPattern('C', {
                ...defaultOptions,
                width: 1,
                height: 1
            });
            expect(pattern).toBeDefined();
            expect(pattern.length).toBeGreaterThan(1);
            expect(pattern[0].length).toBeGreaterThan(1);
        });

        it('should handle different thresholds', () => {
            const pattern = generateLetterPattern('D', {
                ...defaultOptions,
                threshold: 0.8
            });
            expect(pattern).toBeDefined();
        });
    });

    describe('generateTextPatterns', () => {
        it('should generate patterns for each character', () => {
            const patterns = generateTextPatterns('AB', defaultOptions);
            expect(patterns).toHaveLength(2);
            patterns.forEach(pattern => {
                expect(pattern).toBeDefined();
                expect(pattern.length).toBeGreaterThan(0);
            });
        });

        it('should use provided options', () => {
            const patterns = generateTextPatterns('CD', {
                ...defaultOptions,
                width: 20,
                height: 20
            });
            expect(patterns).toHaveLength(2);
            patterns.forEach(pattern => {
                expect(pattern.length).toBe(20);
                expect(pattern[0].length).toBe(20);
            });
        });
    });
}); 