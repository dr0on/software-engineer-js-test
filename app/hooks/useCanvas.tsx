import { useState, useEffect, useRef } from 'react';

export const enum ImageAction {
  Top,
  Down,
  Left,
  Right,
  ZoomIn,
  ZoomOut,
}

const MOVE_STEP = 10;

const useCanvas = () => {
  const [image, setImage] = useState<HTMLImageElement>(new Image());
  const [options, setOptions] = useState({ x: 0, y: 0, scale: 1 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const canvasHeight = canvasRef.current?.height || 0;
  const canvasWidth = canvasRef.current?.width || 0;

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
    const scaledHeight = image.height * options.scale;
    return options.y + scaledHeight - MOVE_STEP < canvasHeight;
  };

  const isLeftLimit = () => {
    const scaledWidth = image.width * options.scale;
    return options.x + scaledWidth - MOVE_STEP < canvasWidth;
  };

  const isTopLimit = () => options.y + MOVE_STEP > 0;

  const isRightLimit = () => options.x + MOVE_STEP > 0;

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
    const y = isTopLimit() ? 0 : options.y + MOVE_STEP;
    setOptions({ x: options.x, y, scale: options.scale });
  };

  const setMoveBottom = () => {
    let y = isBottomLimit() ? canvasHeight - image.height * options.scale : options.y - MOVE_STEP;
    setOptions({ x: options.x, y, scale: options.scale });
  };

  const setMoveRight = () => {
    const x = isRightLimit() ? 0 : options.x + MOVE_STEP;
    setOptions({ x, y: options.y, scale: options.scale });
  };

  const setMoveLeft = () => {
    let x = isLeftLimit() ? canvasWidth - image.width * options.scale : options.x - MOVE_STEP;
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
