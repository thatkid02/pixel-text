import { getPixelStyle } from '../styleUtils';

describe('getPixelStyle', () => {
    const defaultSize = 10;
    const defaultColor = '#000000';

    it('should return square style by default', () => {
        const style = getPixelStyle('square', defaultSize, defaultColor);
        expect(style).toEqual({
            width: '10px',
            height: '10px',
            backgroundColor: '#000000',
            transition: 'background-color 0.2s ease',
            borderRadius: '0'
        });
    });

    it('should handle circle shape', () => {
        const style = getPixelStyle('circle', defaultSize, defaultColor);
        expect(style).toEqual({
            width: '10px',
            height: '10px',
            backgroundColor: '#000000',
            transition: 'background-color 0.2s ease',
            borderRadius: '50%'
        });
    });

    it('should handle diamond shape', () => {
        const style = getPixelStyle('diamond', defaultSize, defaultColor);
        expect(style).toEqual({
            width: '10px',
            height: '10px',
            backgroundColor: '#000000',
            transition: 'background-color 0.2s ease',
            transform: 'rotate(45deg) scale(0.7)'
        });
    });

    it('should handle triangle shape', () => {
        const style = getPixelStyle('triangle', defaultSize, defaultColor);
        expect(style).toEqual({
            width: '0',
            height: '0',
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderBottom: '10px solid #000000',
            backgroundColor: 'transparent',
            transition: 'border-color 0.2s ease'
        });
    });

    it('should handle square with border radius', () => {
        const style = getPixelStyle('square', defaultSize, defaultColor, { borderRadius: 5 });
        expect(style).toEqual({
            width: '10px',
            height: '10px',
            backgroundColor: '#000000',
            transition: 'background-color 0.2s ease',
            borderRadius: '5px'
        });
    });

    it('should handle diamond with custom rotation', () => {
        const style = getPixelStyle('diamond', defaultSize, defaultColor, { rotation: 90 });
        expect(style).toEqual({
            width: '10px',
            height: '10px',
            backgroundColor: '#000000',
            transition: 'background-color 0.2s ease',
            transform: 'rotate(90deg) scale(0.7)'
        });
    });

    it('should handle different sizes', () => {
        const style = getPixelStyle('square', 20, defaultColor);
        expect(style).toEqual({
            width: '20px',
            height: '20px',
            backgroundColor: '#000000',
            transition: 'background-color 0.2s ease',
            borderRadius: '0'
        });
    });

    it('should handle different colors', () => {
        const style = getPixelStyle('square', defaultSize, '#FF0000');
        expect(style).toEqual({
            width: '10px',
            height: '10px',
            backgroundColor: '#FF0000',
            transition: 'background-color 0.2s ease',
            borderRadius: '0'
        });
    });
}); 