let selectedImages = [];
let outputFolder = null;

const selectFolderBtn = document.getElementById('selectFolderBtn');
const selectOutputBtn = document.getElementById('selectOutputBtn');
const convertBtn = document.getElementById('convertBtn');
const selectedFolderDiv = document.getElementById('selectedFolder');
const selectedOutputDiv = document.getElementById('selectedOutput');
const imageListDiv = document.getElementById('imageList');
const resizeRadios = document.querySelectorAll('input[name="resizeType"]');
const resizeValueInput = document.getElementById('resizeValue');
const progressSection = document.getElementById('progressSection');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const resultsSection = document.getElementById('resultsSection');
const resultsList = document.getElementById('resultsList');

resizeRadios.forEach(radio => {
  radio.addEventListener('change', (e) => {
    if (e.target.value === 'width' || e.target.value === 'height') {
      resizeValueInput.disabled = false;
      resizeValueInput.focus();
    } else {
      resizeValueInput.disabled = true;
      resizeValueInput.value = '';
    }
  });
});

selectFolderBtn.addEventListener('click', async () => {
  const result = await window.api.selectFolder();
  
  if (result) {
    selectedImages = result.images;
    selectedFolderDiv.textContent = `Selected: ${result.folderPath}`;
    
    imageListDiv.innerHTML = '';
    if (selectedImages.length > 0) {
      selectedImages.forEach(image => {
        const div = document.createElement('div');
        div.className = 'image-item';
        div.textContent = image.name;
        imageListDiv.appendChild(div);
      });
      
      const countDiv = document.createElement('div');
      countDiv.style.marginTop = '10px';
      countDiv.style.fontWeight = 'bold';
      countDiv.textContent = `Total: ${selectedImages.length} image(s)`;
      imageListDiv.appendChild(countDiv);
    } else {
      imageListDiv.innerHTML = '<div style="color: #999;">No images found in this folder</div>';
    }
    
    checkConvertButton();
  }
});

selectOutputBtn.addEventListener('click', async () => {
  const result = await window.api.selectOutputFolder();
  
  if (result) {
    outputFolder = result;
    selectedOutputDiv.textContent = `Selected: ${outputFolder}`;
    checkConvertButton();
  }
});

function checkConvertButton() {
  convertBtn.disabled = !(selectedImages.length > 0 && outputFolder);
}

convertBtn.addEventListener('click', async () => {
  const resizeType = document.querySelector('input[name="resizeType"]:checked').value;
  const resizeValue = parseInt(resizeValueInput.value) || 0;
  
  if ((resizeType === 'width' || resizeType === 'height') && resizeValue <= 0) {
    alert('Please enter a valid resize value');
    return;
  }
  
  convertBtn.disabled = true;
  progressSection.classList.remove('hidden');
  resultsSection.classList.add('hidden');
  progressFill.style.width = '0%';
  progressText.textContent = 'Starting conversion...';
  
  window.api.onConversionProgress((data) => {
    const percent = (data.current / data.total) * 100;
    progressFill.style.width = `${percent}%`;
    progressText.textContent = `Converting ${data.fileName} (${data.current}/${data.total})`;
  });
  
  const options = {
    images: selectedImages,
    outputFolder: outputFolder,
    resizeType: resizeType === 'none' ? null : resizeType,
    resizeValue: resizeValue
  };
  
  try {
    const results = await window.api.convertImages(options);
    
    progressText.textContent = 'Conversion complete!';
    resultsSection.classList.remove('hidden');
    resultsList.innerHTML = '';
    
    let successCount = 0;
    results.forEach(result => {
      const div = document.createElement('div');
      div.className = `result-item ${result.success ? 'success' : 'error'}`;
      if (result.success) {
        div.textContent = `✓ ${result.name} converted successfully`;
        successCount++;
      } else {
        div.textContent = `✗ ${result.name}: ${result.error}`;
      }
      resultsList.appendChild(div);
    });
    
    const summaryDiv = document.createElement('div');
    summaryDiv.style.marginTop = '15px';
    summaryDiv.style.fontWeight = 'bold';
    summaryDiv.style.textAlign = 'center';
    summaryDiv.textContent = `Converted ${successCount} of ${results.length} images`;
    resultsList.appendChild(summaryDiv);
    
  } catch (error) {
    alert(`Error during conversion: ${error.message}`);
  } finally {
    convertBtn.disabled = false;
    checkConvertButton();
  }
});