import React from 'react';
import useCanvas, { ImageAction } from '../../hooks/useCanvas';
import { toDataURL, saveSettingsFile } from '../../utils';

export const PhotoEditor = () => {
  const { canvasRef, image, setImage, options, setOptions, setImageAction } = useCanvas();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as FileList;
    let file: Blob;
    const reader = new FileReader();

    for (let i = 0; i < files.length; ++i) {
      file = files[i];

      switch (file.type) {
        case 'image/jpeg':
        case 'image/png':
        case 'image/gif':
          reader.onload = () => handleImageLoad(reader.result as string);
          reader.readAsDataURL(file);
          break;
        case 'application/json':
          reader.readAsText(file);
          reader.onload = () => handleFileLoad(reader.result as string);
          break;
      }
      // process just one file
      return;
    }
  };

  const handleImageLoad = (imageData: string) => {
    const img = new Image();
    img.src = imageData;
    img.onload = () => {
      if (canvasRef.current) {
        const editorCanvas = canvasRef.current;
        let scaleFactor = Math.max(editorCanvas?.width / img.width, editorCanvas?.height / img.height);

        // Finding the new width and height based on the scale factor
        let newWidth = img.width * scaleFactor;
        let newHeight = img.height * scaleFactor;

        // get the top left position of the image
        // in order to center the image within the canvas
        let x = editorCanvas.width / 2 - newWidth / 2;
        let y = editorCanvas.height / 2 - newHeight / 2;

        setOptions({ x, y, scale: scaleFactor });
        setImage(img);
      }
    };
  };

  const handleFileLoad = (settings: string) => {
    const {
      canvas: { photo },
    } = JSON.parse(settings);

    const img = new Image();
    img.src = photo.src;
    img.onload = () => {
      if (canvasRef.current) {
        let scaleFactor = Math.max(photo.width / img.width, photo.height / img.height);

        setOptions({
          x: photo.x,
          y: photo.y,
          scale: scaleFactor,
        });
        setImage(img);
      }
    };
  };

  const handleExportClick = () => {
    const width: number = image?.width || 0;
    const height: number = image?.height || 0;
    const encodedImg: string = toDataURL(image as HTMLImageElement) as string;

    const settings = getImageSettings({ encodedImg, width, height, options });

    saveSettingsFile(JSON.stringify(settings));
  };

  const getImageSettings = ({
    encodedImg = '',
    width,
    height,
    options,
  }: {
    encodedImg: string;
    width: number;
    height: number;
    options: any;
  }) => {
    return {
      canvas: {
        width: canvasRef.current?.width,
        height: canvasRef.current?.height,
        photo: {
          id: 'image-configuration.json',
          src: encodedImg,
          width: width * options.scale,
          height: height * options.scale,
          x: options.x,
          y: options.y,
        },
      },
    };
  };

  return (
    <>
      <div className="file-selector">
        <h1>Photo Editor</h1>
        <label htmlFor="fileSelector">Upload Images or Configuration </label>
        <input
          type="file"
          id="fileSelector"
          onChange={handleFileChange}
          onClick={(e: React.MouseEvent<HTMLElement>) => ((e.target as HTMLInputElement).value = '')}
        />
      </div>
      <div className="photo-editor">
        <canvas className="canvas" ref={canvasRef} width={500} height={350} />

        <div className="edit-panel">
          <div className="zoom-controls">
            <button onClick={() => setImageAction(ImageAction.ZoomIn)}>+</button>
            <button onClick={() => setImageAction(ImageAction.ZoomOut)}>-</button>
          </div>
          <div className="move-controls">
            <button className="top" onClick={() => setImageAction(ImageAction.Top)}>
              Top
            </button>
            <button className="bottom" onClick={() => setImageAction(ImageAction.Down)}>
              Bottom
            </button>
            <button className="right" onClick={() => setImageAction(ImageAction.Right)}>
              Right
            </button>
            <button className="left" onClick={() => setImageAction(ImageAction.Left)}>
              Left
            </button>
          </div>
          <div className="export">
            <button onClick={handleExportClick}>Export</button>
          </div>
        </div>
      </div>
    </>
  );
};
