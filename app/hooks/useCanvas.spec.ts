/**
 * @jest-environment jsdom
 */

import React  from 'react';
import 'jest-canvas-mock';

import useCanvas, { ImageAction } from './useCanvas';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D | null;

describe('useCanvas', () => {
  beforeEach(() => {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 300;
  });

  it('should return default options', () => {
    jest.spyOn(React, 'useState')
      .mockImplementationOnce(() => [new Image(), () => null])
      .mockImplementationOnce(() => [{ x: 0, y: 0, scale: 1 }, () => null]);
    jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: canvas });
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());

    const { options } = useCanvas();

    expect(options).toEqual({ x: 0, y: 0, scale: 1 });
  });

  it('should return Ref to canvas', () => {
    jest.spyOn(React, 'useState')
      .mockImplementationOnce(() => [new Image(), () => null])
      .mockImplementationOnce(() => [{ x: 0, y: 0, scale: 1 }, () => null]);
    jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: canvas });
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());

    const { canvasRef } = useCanvas();

    expect(canvasRef.current).toEqual(canvas);
  });

  it('should return image', () => {
    jest.spyOn(React, 'useState')
      .mockImplementationOnce(() => [new Image(200, 100), () => null])
      .mockImplementationOnce(() => [{ x: 0, y: 0, scale: 1 }, () => null]);
    jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: canvas });
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());

    const { image } = useCanvas();

    expect(image.width).toEqual(200);
  });

  it('should zoom in image', () => {
    jest.spyOn(React, 'useState')
      .mockImplementationOnce(() => [new Image(200, 100), () => null])
      .mockImplementationOnce(() => [{ x: 0, y: 0, scale: 1 }, () => null]);
    jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: canvas });
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());

    const { setImageAction } = useCanvas();

    setImageAction(ImageAction.ZoomIn);

    const events = ctx?.__getEvents();

    expect(events).toMatchSnapshot();
  });

  it('should move image to top', () => {
    jest.spyOn(React, 'useState')
      .mockImplementationOnce(() => [new Image(1000, 1000), () => null])
      .mockImplementationOnce(() => [{ x: 0, y: -15, scale: 1 }, () => null]);
    jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: canvas });
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());

    const { setImageAction } = useCanvas();

    setImageAction(ImageAction.Top);

    const events = ctx?.__getEvents();

    expect(events).toMatchSnapshot();
  });
});