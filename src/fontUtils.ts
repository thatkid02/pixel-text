export interface Font {
    label: string;
    value: string;
    url?: string;  // URL for custom fonts
    format?: 'woff2' | 'woff' | 'truetype' | 'opentype';  // Font format for custom fonts
}

export const BUILT_IN_FONTS: Font[] = [
    { label: 'Monospace', value: 'monospace' },
    { label: 'Arial', value: 'Arial' },
    { label: 'Times New Roman', value: 'Times New Roman' },
    { label: 'Courier New', value: 'Courier New' },
    { label: 'Georgia', value: 'Georgia' },
    { label: 'Verdana', value: 'Verdana' },
    { label: 'Impact', value: 'Impact' }
];

export const DOWNLOADABLE_FONTS: Font[] = [
    {
        label: 'Press Start 2P',
        value: 'Press Start 2P',
        url: 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap',
        format: 'woff2'
    },
    {
        label: 'VT323',
        value: 'VT323',
        url: 'https://fonts.googleapis.com/css2?family=VT323&display=swap',
        format: 'woff2'
    },
    {
        label: 'Pixel',
        value: 'Silkscreen',
        url: 'https://fonts.googleapis.com/css2?family=Silkscreen&display=swap',
        format: 'woff2'
    }
];

class FontManager {
    private loadedFonts: Set<string> = new Set();
    private customFonts: Font[] = [];

    async loadFont(font: Font): Promise<void> {
        if (this.loadedFonts.has(font.value)) {
            return;
        }

        if (font.url) {
            try {
                // Create a new FontFace instance
                const fontFace = new FontFace(font.value, `url(${font.url})`, {
                    style: 'normal',
                    weight: '400'
                });

                // Wait for the font to load
                await fontFace.load();

                // Add the font to the document
                (document.fonts as any).add(fontFace);
                this.loadedFonts.add(font.value);

                console.log(`Font ${font.label} loaded successfully`);
            } catch (error) {
                console.error(`Error loading font ${font.label}:`, error);
                throw error;
            }
        }
    }

    async addCustomFont(font: Font): Promise<void> {
        try {
            await this.loadFont(font);
            this.customFonts.push(font);
        } catch (error) {
            console.error(`Error adding custom font ${font.label}:`, error);
            throw error;
        }
    }

    getAllFonts(): Font[] {
        return [...BUILT_IN_FONTS, ...DOWNLOADABLE_FONTS, ...this.customFonts];
    }

    getBuiltInFonts(): Font[] {
        return BUILT_IN_FONTS;
    }

    getDownloadableFonts(): Font[] {
        return DOWNLOADABLE_FONTS;
    }

    getCustomFonts(): Font[] {
        return this.customFonts;
    }

    isFontLoaded(fontValue: string): boolean {
        return this.loadedFonts.has(fontValue);
    }
}

export const fontManager = new FontManager(); 