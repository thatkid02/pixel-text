# Pixel Text

A simple weekend project which I always wanted to make. (built with AI coz my hands were tied.)

## Features

- 🎨 Multiple color modes (rainbow, wave, intensity-based)
- 🎵 Sound effects integration
- ✨ Built-in animations
- 🔤 Custom font support
- 📐 Flexible styling options
- ⚛️ React integration (optional)

## Installation

```bash
npm install @thatkid02/pixel-text
```

## Quick Try

Want to see it in action? Try:

```bash
# Run the interactive example
npx @thatkid02/pixel-text@latest run 

```

## Basic Usage

```typescript
import { generateTextPatterns, PatternOptions } from '@thatkid02/pixel-text';

// Basic usage
const patterns = generateTextPatterns('HELLO');

// Custom options
const options: Partial<PatternOptions> = {
    width: 20,
    height: 20,
    font: '20px monospace',
    threshold: 128,
    colorOptions: {
        mode: 'solid',
        primaryColor: '#000000'
    },
    animationOptions: {
        mode: 'all-together',
        speed: 50,
        soundType: 'pop'
    },
    renderOptions: {
        pixelShape: 'square'
    }
};

const customPatterns = generateTextPatterns('HELLO', options);
```

## Color Management

```typescript
import { 
    getPixelColor,
    getPresetColor,
    getRainbowColor,
    getWaveColor,
    getRandomColor,
    getIntensityColor
} from '@thatkid02/pixel-text';

// Use preset colors
const color = getPresetColor(0, 3, 'Sunset');

// Generate rainbow colors
const rainbowColor = getRainbowColor(index, total);

// Create wave effect colors
const waveColor = getWaveColor(index, total, time);

// Random colors
const randomColor = getRandomColor();

// Intensity-based coloring
const intensityColor = getIntensityColor(alpha, primaryColor);
```

## Animation

```typescript
import { AnimationManager } from '@thatkid02/pixel-text';

const manager = new AnimationManager(pattern);

// Animate with options
await manager.animate({
    mode: 'pixel-by-pixel',
    speed: 50,
    soundType: 'pop',
    soundVolume: 0.5,
    soundPitch: 800
}, (state) => {
    // Update UI with animation state
    console.log(state.visiblePixels, state.isAnimating);
});

// Control animation
manager.start();
manager.cancel();
manager.dispose();
```

## Sound Effects

```typescript
import { soundManager } from '@thatkid02/pixel-text';

// Play sounds with options
await soundManager.playSound({
    type: 'beep',  // 'beep' | 'click' | 'pop' | 'none'
    volume: 0.5,
    pitch: 800
});

// Cleanup
soundManager.dispose();
```

## Font Management

```typescript
import { fontManager, BUILT_IN_FONTS, DOWNLOADABLE_FONTS } from '@thatkid02/pixel-text';

// Use built-in fonts
const systemFonts = fontManager.getBuiltInFonts();

// Load downloadable fonts
const webFont = DOWNLOADABLE_FONTS[0];
await fontManager.loadFont(webFont);

// Add custom font
await fontManager.addCustomFont({
    label: 'Custom Font',
    value: 'CustomFont',
    url: 'path/to/font.woff2',
    format: 'woff2'
});

// Get all available fonts
const allFonts = fontManager.getAllFonts();
```

## Styling

```typescript
import { getPixelStyle } from '@thatkid02/pixel-text';

const style = getPixelStyle('square', 10, '#FF0000', {
    borderRadius: 2,
    rotation: 45  // For diamond shape
});
```

## Types

```typescript
interface PatternOptions {
    width: number;
    height: number;
    font: string;
    fontFamily?: string;
    fontWeight?: string | number;
    fontStyle?: 'normal' | 'italic';
    threshold?: number;
    colorOptions?: ColorOptions;
    animationOptions?: AnimationOptions;
    renderOptions?: RenderOptions;
}

type ColorMode = 'solid' | 'preset' | 'rainbow' | 'wave' | 'random';
type AnimationMode = 'pixel-by-pixel' | 'all-together';
type PixelShape = 'square' | 'circle' | 'diamond' | 'triangle';
type SoundType = 'beep' | 'click' | 'pop' | 'none';
```

## React Integration

```tsx
import { generateTextPatterns, AnimationManager, getWaveColor } from '@thatkid02/pixel-text';

const PixelText = () => {
    const [patterns, setPatterns] = useState([]);
    const animation = useRef(new AnimationManager());

    useEffect(() => {
        const patterns = generateTextPatterns('HELLO');
        setPatterns(patterns);
        
        animation.current.start({
            onFrame: (progress) => {
                // Update colors or position based on animation progress
            }
        });

        return () => animation.current.stop();
    }, []);

    return (
        <div className="pixel-text">
            {/* Render your patterns here */}
        </div>
    );
};
```

## API Reference

### Pattern Generation

```typescript
interface PatternOptions {
    width: number;     // Width of each character pattern
    height: number;    // Height of each character pattern
    font: string;      // CSS font string (e.g., '12px monospace')
    threshold?: number; // Alpha threshold for pixel activation (0-255)
}
```

### Animation Options

```typescript
interface AnimationOptions {
    mode: AnimationMode;
    duration: number;
    easing?: string;
    delay?: number;
}
```

### Color Options

```typescript
interface ColorOptions {
    mode: ColorMode;
    preset?: ColorPreset;
    custom?: string;
    intensity?: number;
}
```

### Sound Options

```typescript
interface SoundOptions {
    volume?: number;
    pitch?: number;
    loop?: boolean;
    delay?: number;
}
```

## License

MIT 