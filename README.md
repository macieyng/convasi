# Cross-Platform Image Converter

A simple cross-platform desktop application for batch converting images to JPG format with optional resizing capabilities. Available for Windows, macOS, and Linux.

## Features

- Batch convert multiple images to JPG format
- Support for various input formats (PNG, GIF, BMP, WebP, TIFF, HEIC/HEIF)
- Handles iPhone/Apple HEIC photos
- Optional resizing by width or height while maintaining aspect ratio
- Simple and intuitive cross-platform GUI
- Fast processing using Sharp image library

## Installation

### Download Pre-built Installers

1. Go to the [Releases](../../releases) page
2. Download the installer for your platform:
   - **Windows**: `.exe` installer (x64 and x86)
   - **macOS**: `.dmg` installer (Intel and Apple Silicon)
   - **Linux**: `.AppImage`, `.deb`, or `.rpm` package
3. Run the installer and follow the setup instructions

### Build from Source

```bash
# Clone the repository
git clone <your-repo-url>
cd convasi

# Install dependencies
npm install

# Run in development
npm start

# Build installers for your platform
npm run dist

# Or build for specific platforms
npm run dist:win    # Windows
npm run dist:mac    # macOS
npm run dist:linux  # Linux
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

The project includes GitHub Actions that automatically build installers for all platforms on every push to main/master branch. You can download the installer artifacts from:

- **Actions tab**: Go to Actions → Select the latest workflow run → Download artifacts:
  - `windows-installers` - Windows exe installers
  - `macos-installers` - macOS dmg installers
  - `linux-installers` - Linux AppImage, deb, and rpm packages
- **Releases**: Automatic releases are created for pushes to main/master with all platform installers

## Technologies Used

- Electron - Cross-platform desktop app framework
- Sharp - High-performance image processing
- Electron Builder - Packaging and distribution

## License

MIT