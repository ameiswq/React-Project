self.onmessage = async (event) => {
  const {fileBuffer, type, maxWidth = 512, maxHeight = 512, quality = 0.7} = event.data;

  try {
    const originalBlob = new Blob([fileBuffer], { type });
    const imageBitmap = await createImageBitmap(originalBlob);
    const ratio = Math.min(maxWidth / imageBitmap.width, maxHeight / imageBitmap.height, 1);
    const targetWidth = Math.round(imageBitmap.width * ratio);
    const targetHeight = Math.round(imageBitmap.height * ratio);
    
    const canvas = new OffscreenCanvas(targetWidth, targetHeight);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);
    const compressedBlob = await canvas.convertToBlob({type, quality});
    const compressedBuffer = await compressedBlob.arrayBuffer();
    self.postMessage({ fileBuffer: compressedBuffer, type });
  } catch (error) {
    console.error("Worker compression error:", error);
    self.postMessage({ error: error.message });
  }
};
