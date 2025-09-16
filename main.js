const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');
const heicConvert = require('heic-convert');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    const folderPath = result.filePaths[0];
    const files = await fs.readdir(folderPath);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff', '.heic', '.heif'].includes(ext);
    });
    
    return {
      folderPath,
      images: imageFiles.map(file => ({
        name: file,
        path: path.join(folderPath, file)
      }))
    };
  }
  
  return null;
});

ipcMain.handle('select-output-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  
  return null;
});

ipcMain.handle('convert-images', async (event, options) => {
  const { images, outputFolder, resizeType, resizeValue } = options;
  const results = [];
  
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    try {
      const outputName = path.parse(image.name).name + '.jpg';
      const outputPath = path.join(outputFolder, outputName);
      
      let inputBuffer;
      const ext = path.extname(image.path).toLowerCase();
      
      // Handle HEIC/HEIF files specially
      if (ext === '.heic' || ext === '.heif') {
        const heicBuffer = await fs.readFile(image.path);
        inputBuffer = await heicConvert({
          buffer: heicBuffer,
          format: 'JPEG',
          quality: 1
        });
      } else {
        // For other formats, let Sharp read directly
        inputBuffer = image.path;
      }
      
      let pipeline = sharp(inputBuffer);
      
      if (resizeType && resizeValue > 0) {
        if (resizeType === 'width') {
          pipeline = pipeline.resize(resizeValue, null, {
            withoutEnlargement: true,
            fit: 'inside'
          });
        } else if (resizeType === 'height') {
          pipeline = pipeline.resize(null, resizeValue, {
            withoutEnlargement: true,
            fit: 'inside'
          });
        }
      }
      
      await pipeline
        .jpeg({ quality: 90 })
        .toFile(outputPath);
      
      results.push({
        success: true,
        name: image.name,
        outputPath
      });
      
      event.sender.send('conversion-progress', {
        current: i + 1,
        total: images.length,
        fileName: image.name
      });
    } catch (error) {
      results.push({
        success: false,
        name: image.name,
        error: error.message
      });
    }
  }
  
  return results;
});