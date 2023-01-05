/**
 * @jest-environment jsdom
 */

import React  from 'react';
import 'jest-canvas-mock';

import useCanvas, { ImageAction } from '../../hooks/useCanvas';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D | null;

describe('PhotoEditor', () => {
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
});