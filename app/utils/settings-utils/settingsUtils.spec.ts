/**
 * @jest-environment jsdom
 */

import { toDataURL } from './settingsUtils';
import 'jest-canvas-mock';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D | null;

describe('settingsUtils', () => {
  beforeEach(() => {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 300;
  });

  it('should encode Image to base64', () => {
    const image = new Image(400, 300);    
    image.src = 'picture.jpg';

    const encodedImg = toDataURL(image);

    expect(encodedImg).toEqual('data:image/png;base64,00');
  });
});