/**
 * @jest-environment jsdom
 */

import React  from 'react';
import 'jest-canvas-mock';
import { renderHook, act } from '@testing-library/react-hooks';

import useCanvas, { ImageAction } from './useCanvas';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D | null;

describe('useCanvas', () => {
  beforeEach(() => {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 300;

    jest.spyOn(React, 'useRef').mockReturnValue({ current: canvas });
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

  it('should return canvas ref', () => {
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

  it('should zoom out image', () => {
    const { result } = renderHook(() => useCanvas());

    act(() => { result.current.setOptions({ x: -50, y: -50, scale: 1 }) });
    act(() => { result.current.setImage(new Image(700, 700)) });
    act(() => { result.current.setImageAction(ImageAction.ZoomOut) });

    const events = ctx?.__getEvents();

    expect(events).toMatchSnapshot();
    expect(result.current.options).toMatchObject({ x: -15, y: -15, scale: 0.9 });
  });

  it('should zoom in image', () => {
    const { result } = renderHook(() => useCanvas());

    act(() => { result.current.setOptions({ x: -50, y: -50, scale: 1 }) });
    act(() => { result.current.setImage(new Image(700, 700)) });
    act(() => { result.current.setImageAction(ImageAction.ZoomIn) });

    const events = ctx?.__getEvents();

    expect(events).toMatchSnapshot();
    expect(result.current.options).toMatchObject({ x: -85.00000000000006, y: -85.00000000000006, scale: 1.1 });
  });

  it('should move image to top', () => {
    const { result } = renderHook(() => useCanvas());

    act(() => { result.current.setOptions({ x: 0, y: -15, scale: 1 }) });
    act(() => { result.current.setImage(new Image(700, 700)) });
    act(() => { result.current.setImageAction(ImageAction.Top) });

    const events = ctx?.__getEvents();

    expect(events).toMatchSnapshot();
    expect(result.current.options).toMatchObject({ x: 0, y: -5, scale: 1 });
  });

  it('should move image bottom', () => {
    const { result } = renderHook(() => useCanvas());

    act(() => { result.current.setOptions({ x: 0, y: -15, scale: 1 }) });
    act(() => { result.current.setImage(new Image(700, 700)) });
    act(() => { result.current.setImageAction(ImageAction.Down) });

    const events = ctx?.__getEvents();

    expect(events).toMatchSnapshot();
    expect(result.current.options).toMatchObject({ x: 0, y: -25, scale: 1 });
  });

  it('should move image left', () => {
    const { result } = renderHook(() => useCanvas());

    act(() => { result.current.setOptions({ x: 15, y: 0, scale: 1 }) });
    act(() => { result.current.setImage(new Image(700, 700)) });
    act(() => { result.current.setImageAction(ImageAction.Left) });

    const events = ctx?.__getEvents();

    expect(events).toMatchSnapshot();
    expect(result.current.options).toMatchObject({ x: 5, y: 0, scale: 1 });
  });

  it('should move image right', () => {
    const { result } = renderHook(() => useCanvas());

    act(() => { result.current.setOptions({ x: -15, y: 0, scale: 1 }) });
    act(() => { result.current.setImage(new Image(700, 700)) });
    act(() => { result.current.setImageAction(ImageAction.Right) });

    const events = ctx?.__getEvents();

    expect(events).toMatchSnapshot();
    expect(result.current.options).toMatchObject({ x: -5, y: 0, scale: 1 });
  });
});