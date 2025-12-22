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

## Screenshots & Demos

_Coming soon - Screenshots and demos will be added here_

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
