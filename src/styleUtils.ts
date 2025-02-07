import { PixelShape } from './types';

export const getPixelStyle = (shape: PixelShape, size: number, color: string, options?: { borderRadius?: number; rotation?: number }) => {
    const baseStyle = {
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        transition: 'background-color 0.2s ease'
    };

    switch (shape) {
        case 'circle':
            return {
                ...baseStyle,
                borderRadius: '50%'
            };
        case 'diamond':
            return {
                ...baseStyle,
                transform: `rotate(45deg) scale(0.7)`,
                ...options?.rotation && { transform: `rotate(${options.rotation}deg) scale(0.7)` }
            };
        case 'triangle':
            return {
                width: '0',
                height: '0',
                borderLeft: `${size/2}px solid transparent`,
                borderRight: `${size/2}px solid transparent`,
                borderBottom: `${size}px solid ${color}`,
                backgroundColor: 'transparent',
                transition: 'border-color 0.2s ease'
            };
        case 'square':
        default:
            return {
                ...baseStyle,
                borderRadius: options?.borderRadius ? `${options.borderRadius}px` : '0'
            };
    }
}; 