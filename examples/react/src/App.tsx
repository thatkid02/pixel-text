import React, { useState, useEffect, useRef } from 'react';
import { 
    generateTextPatterns, 
    PatternOptions, 
    ColorMode,
    AnimationMode,
    AnimationManager,
    AnimationState,
    ColorOptions, 
    COLOR_PRESETS,
    getPixelColor,
    SoundType,
    PixelShape,
    fontManager,
    Font,
    BUILT_IN_FONTS,
    DOWNLOADABLE_FONTS,
    AnimationOptions
} from 'pixel-text-generator';

interface PixelGridProps {
    pattern: boolean[][];
    pixelSize?: number;
    colorOptions: ColorOptions;
    animationOptions: PatternOptions['animationOptions'];
    patternIndex: number;
    totalPatterns: number;
    renderOptions?: PatternOptions['renderOptions'];
}

const PresetCard: React.FC<{
    preset: typeof COLOR_PRESETS[0];
    selected: boolean;
    onClick: () => void;
}> = ({ preset, selected, onClick }) => (
    <button
        onClick={onClick}
        className={`p-4 rounded-lg transition-all ${
            selected ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-105'
        }`}
    >
        <div className="h-12 rounded-lg mb-2" style={{
            background: `linear-gradient(to right, ${preset.colors.join(', ')})`
        }} />
        <div className="text-sm font-medium text-center">{preset.name}</div>
    </button>
);

const PIXEL_SHAPES: { label: string; value: PixelShape }[] = [
    { label: 'Square', value: 'square' },
    { label: 'Circle', value: 'circle' },
    { label: 'Diamond', value: 'diamond' },
    { label: 'Triangle', value: 'triangle' }
];

const getPixelStyle = (shape: PixelShape, size: number, color: string, options?: { borderRadius?: number; rotation?: number }) => {
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

const PixelGrid: React.FC<PixelGridProps> = ({ 
    pattern, 
    pixelSize = 6,
    colorOptions,
    animationOptions,
    patternIndex,
    totalPatterns,
    renderOptions
}) => {
    const [time, setTime] = useState(0);
    const [animationState, setAnimationState] = useState<AnimationState>(() => ({
        visiblePixels: pattern.map(row => row.map(cell => animationOptions?.mode === 'all-together' ? cell : false)),
        isAnimating: false
    }));
    const animationManagerRef = useRef<AnimationManager | null>(null);

    useEffect(() => {
        // Create new animation manager if needed
        if (!animationManagerRef.current) {
            animationManagerRef.current = new AnimationManager(pattern);
        }

        const startAnimation = async () => {
            if (!animationManagerRef.current || !animationOptions) return;

            try {
                await animationManagerRef.current.animate({
                    mode: animationOptions.mode || 'all-together',
                    speed: animationOptions.speed || 50,
                    soundType: animationOptions.soundType || 'none',
                    soundVolume: animationOptions.soundVolume,
                    soundPitch: animationOptions.soundPitch
                }, (newState) => {
                    setAnimationState(newState);
                });
            } catch (error) {
                console.error('Animation error:', error);
            }
        };

        startAnimation();

        return () => {
            if (animationManagerRef.current) {
                animationManagerRef.current.dispose();
                animationManagerRef.current = null;
            }
        };
    }, [pattern, animationOptions]);

    // Handle wave animation separately
    useEffect(() => {
        if (colorOptions.mode !== 'wave') return;
        
        const interval = setInterval(() => {
            setTime(t => (t + 5) % 360);
        }, colorOptions.speed || 50);

        return () => clearInterval(interval);
    }, [colorOptions.mode, colorOptions.speed]);

    return (
        <div className="flex items-center justify-center" style={{ margin: '0 -2px' }}>
            <table className="border-collapse">
                <tbody>
                    {pattern.map((row, i) => (
                        <tr key={i}>
                            {row.map((cell, j) => {
                                const index = j + i * row.length + patternIndex * pattern[0].length;
                                const isVisible = cell && (
                                    animationOptions?.mode === 'all-together' || 
                                    animationState.visiblePixels[i]?.[j]
                                );
                                const color = getPixelColor(
                                    isVisible,
                                    index,
                                    pattern[0].length * totalPatterns,
                                    colorOptions,
                                    time
                                );
                                return (
                                    <td
                                        key={j}
                                        style={{
                                            padding: '0',
                                            border: '1px solid #eee'
                                        }}
                                    >
                                        <div style={getPixelStyle(
                                            renderOptions?.pixelShape || 'square',
                                            pixelSize,
                                            color,
                                            {
                                                borderRadius: renderOptions?.borderRadius,
                                                rotation: renderOptions?.rotation
                                            }
                                        )} />
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const COLOR_MODES: { label: string; value: ColorMode }[] = [
    { label: 'Solid', value: 'solid' },
    { label: 'Preset', value: 'preset' },
    { label: 'Rainbow', value: 'rainbow' },
    { label: 'Wave', value: 'wave' },
    { label: 'Random', value: 'random' }
];

const ANIMATION_MODES: { label: string; value: AnimationMode }[] = [
    { label: 'All Together', value: 'all-together' },
    { label: 'Pixel by Pixel', value: 'pixel-by-pixel' }
];

const SOUND_TYPES: { label: string; value: SoundType }[] = [
    { label: 'None', value: 'none' },
    { label: 'Beep', value: 'beep' },
    { label: 'Click', value: 'click' },
    { label: 'Pop', value: 'pop' }
];

const App: React.FC = () => {
    const [text, setText] = useState('THAKID');
    const [options, setOptions] = useState<PatternOptions>({
        width: 20,
        height: 20,
        font: '20px monospace',
        threshold: 128,
        animationOptions: {
            mode: 'all-together',
            speed: 365,
            soundType: 'pop',
            soundVolume: 0.1,
            soundPitch: 800
        },
        renderOptions: {
            pixelShape: 'square',
            borderRadius: 0,
            rotation: 0
        }
    });
    const [pixelSize, setPixelSize] = useState(6);
    const [colorOptions, setColorOptions] = useState<ColorOptions>({
        mode: 'preset',
        presetName: COLOR_PRESETS[0]?.name || 'Sunset',
        primaryColor: '#000000',
        backgroundEnabled: false,
        backgroundColor: '#ffffff',
        speed: 50
    });
    const [patterns, setPatterns] = useState<boolean[][][]>([]);
    const [fonts, setFonts] = useState<Font[]>(BUILT_IN_FONTS);
    const [selectedFont, setSelectedFont] = useState<Font>(BUILT_IN_FONTS[0]);
    const [isLoadingFont, setIsLoadingFont] = useState(false);

    useEffect(() => {
        const newPatterns = generateTextPatterns(text, {
            ...options,
            colorOptions
        });
        setPatterns(newPatterns);
    }, [text, options, colorOptions]);

    const updateAnimationOptions = (updates: Partial<AnimationOptions>) => {
        setOptions(prev => ({
            ...prev,
            animationOptions: {
                mode: 'all-together',
                speed: 50,
                soundType: 'pop',
                soundVolume: 0.1,
                soundPitch: 800,
                ...prev.animationOptions,
                ...updates
            }
        }));
    };

    const updateRenderOptions = (updates: Partial<Required<PatternOptions>['renderOptions']>) => {
        setOptions(prev => ({
            ...prev,
            renderOptions: {
                pixelShape: 'square',
                borderRadius: 0,
                rotation: 0,
                ...prev.renderOptions,
                ...updates
            }
        }));
    };

    // Load downloadable fonts when selected
    const handleFontChange = async (fontValue: string) => {
        const font = [...BUILT_IN_FONTS, ...DOWNLOADABLE_FONTS].find(f => f.value === fontValue);
        if (!font) return;

        setSelectedFont(font);

        if (font.url && !fontManager.isFontLoaded(font.value)) {
            setIsLoadingFont(true);
            try {
                await fontManager.loadFont(font);
                setOptions(prev => ({
                    ...prev,
                    fontFamily: font.value,
                    font: `${parseInt(prev.font || '12px')}px ${font.value}`
                }));
            } catch (error) {
                console.error('Error loading font:', error);
                // Fallback to default font
                setSelectedFont(BUILT_IN_FONTS[0]);
            } finally {
                setIsLoadingFont(false);
            }
        } else {
            setOptions(prev => ({
                ...prev,
                fontFamily: font.value,
                font: `${parseInt(prev.font || '12px')}px ${font.value}`
            }));
        }
    };

    // Handle custom font upload
    const handleCustomFontUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const url = URL.createObjectURL(file);
            const fontName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
            const customFont: Font = {
                label: fontName,
                value: fontName,
                url,
                format: 'truetype' // Assuming .ttf files
            };

            await fontManager.addCustomFont(customFont);
            setFonts(prev => [...prev, customFont]);
            handleFontChange(customFont.value);
        } catch (error) {
            console.error('Error uploading custom font:', error);
            alert('Error uploading font. Please try a different file.');
        }
    };

    // Add this validation function
    const updateGridSize = (dimension: 'width' | 'height', value: number) => {
        const validValue = Math.max(5, Math.min(50, value || 5));
        setOptions(prev => ({ ...prev, [dimension]: validValue }));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto p-4">
                
                <div className="flex gap-6 relative">
                    {/* Preview Panel - Left Side (Fixed) */}
                    <div className="flex-1 sticky top-4 h-[calc(100vh-8rem)]">
                        <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col">
                        <h1 className="text-4xl font-bold mb-8 text-center">Pixel Text Generator</h1>

                            <div className="flex-1 overflow-auto flex items-center justify-center bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAyMCAwIEwgMCAwIDAgMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2U1ZTdlYiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] rounded-lg">
                                <div className="flex flex-wrap gap-4 justify-center p-4">
                                    {patterns.map((pattern, i) => (
                                        <PixelGrid
                                            key={i}
                                            pattern={pattern}
                                            pixelSize={pixelSize}
                                            colorOptions={colorOptions}
                                            animationOptions={options.animationOptions}
                                            renderOptions={options.renderOptions}
                                            patternIndex={i}
                                            totalPatterns={patterns.length}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls Panel - Right Side (Scrollable) */}
                    <div className="w-80 space-y-6">
                        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
                            {/* Text Input */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Text</label>
                                <input
                                    type="text"
                                    value={text}
                                    onChange={e => setText(e.target.value)}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Font Settings */}
                            <div>
                                <h3 className="font-medium mb-4">Font Settings</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Font Family</label>
                                        <select
                                            value={selectedFont.value}
                                            onChange={e => handleFontChange(e.target.value)}
                                            disabled={isLoadingFont}
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <optgroup label="Built-in Fonts">
                                                {BUILT_IN_FONTS.map(font => (
                                                    <option key={font.value} value={font.value}>
                                                        {font.label}
                                                    </option>
                                                ))}
                                            </optgroup>
                                            <optgroup label="Downloadable Fonts">
                                                {DOWNLOADABLE_FONTS.map(font => (
                                                    <option key={font.value} value={font.value}>
                                                        {font.label} {!fontManager.isFontLoaded(font.value) && '(Click to download)'}
                                                    </option>
                                                ))}
                                            </optgroup>
                                            {fontManager.getCustomFonts().length > 0 && (
                                                <optgroup label="Custom Fonts">
                                                    {fontManager.getCustomFonts().map(font => (
                                                        <option key={font.value} value={font.value}>
                                                            {font.label}
                                                        </option>
                                                    ))}
                                                </optgroup>
                                            )}
                                        </select>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <label className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer transition-colors text-center">
                                            Upload Font (.ttf)
                                            <input
                                                type="file"
                                                accept=".ttf"
                                                onChange={handleCustomFontUpload}
                                                className="hidden"
                                            />
                                        </label>
                                        {isLoadingFont && (
                                            <span className="text-sm text-gray-500">Loading...</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Color Settings */}
                            <div>
                                <h3 className="font-medium mb-4">Color Settings</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Color Mode</label>
                                        <select
                                            value={colorOptions.mode}
                                            onChange={e => setColorOptions(prev => ({ ...prev, mode: e.target.value as ColorMode }))}
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {COLOR_MODES.map(mode => (
                                                <option key={mode.value} value={mode.value}>
                                                    {mode.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {colorOptions.mode === 'solid' && (
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Color</label>
                                            <input
                                                type="color"
                                                value={colorOptions.primaryColor}
                                                onChange={e => setColorOptions(prev => ({ ...prev, primaryColor: e.target.value }))}
                                                className="w-full h-12 p-1 border rounded-lg"
                                            />
                                        </div>
                                    )}

                                    {colorOptions.mode === 'preset' && (
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Color Preset</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {COLOR_PRESETS.map(preset => (
                                                    <PresetCard
                                                        key={preset.name}
                                                        preset={preset}
                                                        selected={preset.name === colorOptions.presetName}
                                                        onClick={() => setColorOptions(prev => ({ ...prev, presetName: preset.name }))}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Background</label>
                                        <div className="flex items-center gap-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={colorOptions.backgroundEnabled}
                                                    onChange={e => setColorOptions(prev => ({ ...prev, backgroundEnabled: e.target.checked }))}
                                                    className="mr-2"
                                                />
                                                Enable
                                            </label>
                                            {colorOptions.backgroundEnabled && (
                                                <input
                                                    type="color"
                                                    value={colorOptions.backgroundColor}
                                                    onChange={e => setColorOptions(prev => ({ ...prev, backgroundColor: e.target.value }))}
                                                    className="w-20 h-8 p-1 border rounded"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Animation Settings */}
                            <div>
                                <h3 className="font-medium mb-4">Animation Settings</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Animation Mode</label>
                                        <select
                                            value={options.animationOptions?.mode || 'all-together'}
                                            onChange={e => updateAnimationOptions({ mode: e.target.value as AnimationMode })}
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {ANIMATION_MODES.map(mode => (
                                                <option key={mode.value} value={mode.value}>
                                                    {mode.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {options.animationOptions?.mode === 'pixel-by-pixel' && (
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Animation Speed <span className="text-sm text-gray-500">({options.animationOptions?.speed || 50}ms)</span>
                                            </label>
                                            <input
                                                type="range"
                                                min={10}
                                                max={500}
                                                value={options.animationOptions?.speed || 50}
                                                onChange={e => updateAnimationOptions({ speed: Number(e.target.value) })}
                                                className="w-full"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Sound Effect</label>
                                        <select
                                            value={options.animationOptions?.soundType || 'none'}
                                            onChange={e => updateAnimationOptions({ soundType: e.target.value as SoundType })}
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {SOUND_TYPES.map(type => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {options.animationOptions?.soundType !== 'none' && (
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Sound Volume</label>
                                            <input
                                                type="range"
                                                min={0}
                                                max={100}
                                                value={(options.animationOptions?.soundVolume || 0.1) * 100}
                                                onChange={e => updateAnimationOptions({ 
                                                    soundVolume: Number(e.target.value) / 100 
                                                })}
                                                className="w-full"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Pixel Settings */}
                            <div>
                                <h3 className="font-medium mb-4">Pixel Settings</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Shape</label>
                                        <select
                                            value={options.renderOptions?.pixelShape || 'square'}
                                            onChange={e => updateRenderOptions({ pixelShape: e.target.value as PixelShape })}
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {PIXEL_SHAPES.map(shape => (
                                                <option key={shape.value} value={shape.value}>
                                                    {shape.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {options.renderOptions?.pixelShape === 'square' && (
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Corner Radius</label>
                                            <input
                                                type="range"
                                                min={0}
                                                max={10}
                                                value={options.renderOptions?.borderRadius || 0}
                                                onChange={e => updateRenderOptions({ borderRadius: Number(e.target.value) })}
                                                className="w-full"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Size</label>
                                        <input
                                            type="range"
                                            min={1}
                                            max={20}
                                            value={pixelSize}
                                            onChange={e => setPixelSize(Number(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Grid Size</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                value={options.width}
                                                onChange={e => updateGridSize('width', Number(e.target.value))}
                                                onBlur={e => {
                                                    if (!e.target.value) {
                                                        updateGridSize('width', 5);
                                                    }
                                                }}
                                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                min={5}
                                                max={50}
                                                placeholder="Width"
                                            />
                                            <input
                                                type="number"
                                                value={options.height}
                                                onChange={e => updateGridSize('height', Number(e.target.value))}
                                                onBlur={e => {
                                                    if (!e.target.value) {
                                                        updateGridSize('height', 5);
                                                    }
                                                }}
                                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                min={5}
                                                max={50}
                                                placeholder="Height"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Threshold <span className="text-sm text-gray-500">({options.threshold})</span>
                                        </label>
                                        <input
                                            type="range"
                                            value={options.threshold}
                                            onChange={e => setOptions(prev => ({ ...prev, threshold: Number(e.target.value) }))}
                                            className="w-full"
                                            min={0}
                                            max={255}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App; 