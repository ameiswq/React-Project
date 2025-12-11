export function validateImageFile(file) {
  if (!file) return false;
  const isValid = /^image\/(png|jpe?g)$/i.test(file.type);
  if (!isValid) alert("Please upload .jpg or .png image");
  return isValid;
}

export function fileToArrayBuffer(file) {
  return file.arrayBuffer();
}

export function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Failed to convert blob to data URL"));
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function compressImageWithWorker(worker, file, options = {}) {
  return new Promise(async (resolve, reject) => {
    if (!worker) return reject(new Error("Worker is not available"));

    const fileBuffer = await fileToArrayBuffer(file);

    worker.postMessage({
      fileBuffer,
      type: file.type === "image/png" ? "image/png" : "image/jpeg",
      maxWidth: options.maxWidth || 512,
      maxHeight: options.maxHeight || 512,
      quality: options.quality || 0.7,
    });

    worker.onmessage = async (event) => {
      if (event.data.error) reject(event.data.error);
      else resolve(event.data);
    };
  });
}
