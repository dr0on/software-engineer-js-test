import { useState, useEffect, useRef } from 'react';

export const enum ImageAction {
  Top,
  Down,
  Left,
  Right,
  ZoomIn,
  ZoomOut,
}

const useCanvas = () => {
  const [image, setImage] = useState<HTMLImageElement>(new Image());
  const [options, setOptions] = useState({ x: 0, y: 0, scale: 1 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      ctx?.drawImage(
        image,
        options.x,
        options.y,
        image.naturalWidth * options.scale,
        image.naturalHeight * options.scale
      );
    }
  }, [image, options.x, options.y, options.scale]);

  const calculateZoomOptions = (img: any, scale: number) => {
    const currentWidth = img.width * options.scale;
    const currentHeight = img.height * options.scale;

    const newWidth = currentWidth * scale;
    const newHeight = currentHeight * scale;

    const xOffset = (newWidth - currentWidth) / 2;
    const yOffset = (newHeight - currentHeight) / 2;

    return {
      x: options.x - xOffset,
      y: options.y - yOffset,
      scale: options.scale * scale,
    };
  };

  const isBottomLimit = () => {
    const canvasHeight = canvasRef.current?.height || 0;
    const scaledHeight = image.height * options.scale;

    return options.y + scaledHeight - 10 < canvasHeight;
  };

  const isLeftLimit = () => {
    const canvasWidth = canvasRef.current?.width || 0;
    const scaledWidth = image.width * options.scale;

    return options.x + scaledWidth - 10 < canvasWidth;
  };

  const isTopLimit = () => options.y + 10 > 0;

  const isRightLimit = () => options.x + 10 > 0;

  const setZoomIn = () => {
    const { x, y, scale } = calculateZoomOptions(image, 1.1);

    setOptions({ x, y, scale });
  };

  const setZoomOut = () => {
    if (!isTopLimit() && !isBottomLimit() && !isLeftLimit() && !isRightLimit()) {
      const { x, y, scale } = calculateZoomOptions(image, 0.9);

      setOptions({ x, y, scale });
    }
  };

  const setMoveTop = () => {
    const y = isTopLimit() ? 0 : options.y + 10;
    setOptions({ x: options.x, y, scale: options.scale });
  };

  const setMoveBottom = () => {
    const canvasHeight = canvasRef.current?.height || 0;
    let y = isBottomLimit() ? canvasHeight - image.height * options.scale : options.y - 10;

    setOptions({ x: options.x, y, scale: options.scale });
  };

  const setMoveRight = () => {
    const x = isRightLimit() ? 0 : options.x + 10;

    setOptions({ x, y: options.y, scale: options.scale });
  };

  const setMoveLeft = () => {
    const canvasWidth = canvasRef.current?.width || 0;
    let x = isLeftLimit() ? canvasWidth - image.width * options.scale : options.x - 10;

    setOptions({ x, y: options.y, scale: options.scale });
  };

  const setImageAction = (action: ImageAction) => {
    switch (action) {
      case ImageAction.ZoomIn:
        setZoomIn();
        break;
      case ImageAction.ZoomOut:
        setZoomOut();
        break;
      case ImageAction.Top:
        setMoveTop();
        break;
      case ImageAction.Down:
        setMoveBottom();
        break;
      case ImageAction.Right:
        setMoveRight();
        break;
      case ImageAction.Left:
        setMoveLeft();
        break;
    }
  };

  return { canvasRef, image, setImage, options, setOptions, setImageAction };
};

export default useCanvas;
