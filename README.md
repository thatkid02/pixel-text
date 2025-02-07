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

Want to see it in action? Try these commands:

```bash
# Run the interactive example
npx @thatkid02/pixel-text run example

# Clean up example files when done
npx @thatkid02/pixel-text clean example
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
    threshold: 128
};

const customPatterns = generateTextPatterns('HELLO', options);
```

## Advanced Features

### Color Management

```typescript
import { 
    getPresetColor, 
    getRainbowColor, 
    getWaveColor, 
    getIntensityColor,
    getRandomColor
} from '@thatkid02/pixel-text';

// Use preset colors
const color = getPresetColor('blue');

// Generate rainbow colors
const rainbowColor = getRainbowColor(index, totalPixels);

// Create wave effect colors
const waveColor = getWaveColor(x, y, time);

// Intensity-based coloring
const intensityColor = getIntensityColor(value);

// Random colors
const randomColor = getRandomColor();
```

### Animation

```typescript
import { AnimationManager } from '@thatkid02/pixel-text';

const animation = new AnimationManager({
    mode: 'fade', // 'fade' | 'slide' | 'bounce' | 'flash'
    duration: 1000,
    easing: 'easeInOut'
});

animation.start();
animation.pause();
animation.resume();
animation.stop();
```

### Sound Effects

```typescript
import { soundManager } from '@thatkid02/pixel-text';

// Play built-in sounds
soundManager.play('click');

// Custom sound options
soundManager.play('beep', {
    volume: 0.5,
    pitch: 1.2
});

// Mute/unmute sounds
soundManager.mute();
soundManager.unmute();
```

### Font Management

```typescript
import { fontManager, BUILT_IN_FONTS, DOWNLOADABLE_FONTS } from '@thatkid02/pixel-text';

// Use built-in fonts
fontManager.setFont(BUILT_IN_FONTS.PIXEL);

// Load custom fonts
await fontManager.loadFont('CustomFont', 'path/to/font.ttf');

// Check available fonts
const fonts = fontManager.getAvailableFonts();
```

### Styling

```typescript
import { getPixelStyle } from '@thatkid02/pixel-text';

const style = getPixelStyle({
    shape: 'square', // 'square' | 'circle' | 'diamond'
    size: 10,
    color: '#FF0000',
    opacity: 0.8
});
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

## CLI Commands

The package includes CLI commands to help you explore its features:

### Run Example

Start the interactive React example application:

```bash
npx @thatkid02/pixel-text run example
```

This will:
1. Install necessary dependencies
2. Start a development server
3. Open the example in your browser

### Clean Example

Clean the example project files:

```bash
npx @thatkid02/pixel-text clean example
```

This removes:
- node_modules directory
- dist directory
- package-lock.json

## Examples

The package includes a complete React example demonstrating all features. You can:

1. Run it directly using the CLI:
```bash
npx @thatkid02/pixel-text run example
```

2. Or manually:
```bash
cd examples/react
npm install
npm run dev
```

The example includes:
- Interactive text-to-pixel conversion
- All color modes and presets
- Animation controls
- Sound effects
- Font management
- Pixel shape customization
- And more!

## Browser Support

- Requires a modern browser with Canvas API support
- WebAudio API support needed for sound features
- CSS custom properties for styling options

## License

MIT 