# Stemmer

A beautiful desktop application for separating audio tracks into individual stems using AI-powered source separation.

![Stemmer Logo](./public/stemmer_logo.svg)

## Features

- 🎵 AI-powered stem separation (vocals, drums, bass, etc.)
- 🎨 Retro cassette player interface
- 🎚️ Interactive stem mixer with volume controls
- 📊 Waveform visualization
- 📁 Recent files support
- ⚙️ Customizable settings

## Screenshots & Demo

Stemmer features a **retro cassette-inspired UI**, with multiple color themes inspired by classic synthwave and analog aesthetics.

### 🎥 Demo Video (Retro Theme)

👉 [Watch the demo video](https://github.com/gentij/stemmer/releases/download/v0.1.1/demo-retro.mp4)

### 🎨 Retro Theme – Color Variants

Each screenshot below showcases the **retro theme** in a different color palette:

- **Purple Dream**
- **Ocean Blue**
- **Sunset Orange**
- **Mint Green**
- **Hot Pink**

| Theme | Preview |
|-----|--------|
| Purple Dream | ![Purple Dream](https://github.com/gentij/stemmer/releases/download/v0.1.1/stemmer_purple_dream.png) |
| Ocean Blue | ![Ocean Blue](https://github.com/gentij/stemmer/releases/download/v0.1.1/stemmer_ocean_blue.png) |
| Sunset Orange | ![Sunset Orange](https://github.com/gentij/stemmer/releases/download/v0.1.1/stemmer_sunset_orange.png) |
| Mint Green | ![Mint Green](https://github.com/gentij/stemmer/releases/download/v0.1.1/stemmer_mint_green.png) |
| Hot Pink | ![Hot Pink](https://github.com/gentij/stemmer/releases/download/v0.1.1/stemmer_hot_pink.png) |

> ℹ️ **Note**: The retro theme is just one of the available visual styles.  
> Stemmer is designed to support additional themes in the future.

## Download

👉 **[Download the latest release](https://github.com/gentij/stemmer/releases/latest)**

## Installation

### Prerequisites

- Node.js 18+ and pnpm
- Rust (latest stable)
- System dependencies for [Tauri](https://tauri.app/v1/guides/getting-started/prerequisites)

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd stemmer

# Install dependencies
pnpm install

# Run in development
pnpm tauri dev

# Build for production
pnpm tauri build
```

## Usage

1. Load an audio file (drag & drop or file picker)
2. Wait for processing to complete
3. Mix stems using the interactive controls
4. Access recent files from the top strip

## Audio Processing

Stemmer uses [stem-splitter-core](https://github.com/gentij/stem-splitter-core) for AI-powered audio source separation.

## License

[Add your license here]

## Credits

**Author**: gentij

---

Made with ❤️ using Tauri + Vue + TypeScript
