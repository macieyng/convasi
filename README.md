# Image Converter for Windows

A simple Windows desktop application for batch converting images to JPG format with optional resizing capabilities.

## Features

- Batch convert multiple images to JPG format
- Support for various input formats (PNG, GIF, BMP, WebP, TIFF, HEIC/HEIF)
- Handles iPhone/Apple HEIC photos
- Optional resizing by width or height while maintaining aspect ratio
- Simple and intuitive Windows GUI
- Fast processing using Sharp image library

## Installation

### Download Pre-built Installer

1. Go to the [Releases](../../releases) page
2. Download the latest `.exe` installer for Windows x86
3. Run the installer and follow the setup wizard

### Build from Source

```bash
# Clone the repository
git clone <your-repo-url>
cd convasi

# Install dependencies
npm install

# Run in development
npm start

# Build installer
npm run dist
```

## Usage

1. **Select Images**: Click "Select Folder" to choose a directory containing images
2. **Configure Resize** (Optional): 
   - Choose to keep original size
   - Resize by width (maintains aspect ratio)
   - Resize by height (maintains aspect ratio)
3. **Select Output**: Choose where to save the converted images
4. **Convert**: Click "Convert Images" to start the batch conversion

## GitHub Actions

The project includes a GitHub Action that automatically builds the Windows installer on every push to main/master branch. You can download the installer artifact from:

- **Actions tab**: Go to Actions → Select the latest workflow run → Download the `windows-installer-x86` artifact
- **Releases**: Automatic releases are created for pushes to main/master

## Technologies Used

- Electron - Cross-platform desktop app framework
- Sharp - High-performance image processing
- Electron Builder - Packaging and distribution

## License

MIT