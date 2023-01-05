const toDataURL = (img: HTMLImageElement) => {
  let canvas = document.createElement('canvas');
  canvas.height = img.naturalHeight;
  canvas.width = img.naturalWidth;

  let ctx = canvas.getContext('2d');
  ctx?.drawImage(img, 0, 0);

  return canvas.toDataURL();
};

const saveSettingsFile = (settings: string, fileName = 'image-configuration.json') => {
  const element = document.createElement('a');
  const file = new Blob([settings], { type: 'application/json' });
  element.href = URL.createObjectURL(file);
  element.download = fileName;
  element.click();
};

export { saveSettingsFile, toDataURL };
