/**
 * @jest-environment jsdom
 */

import { toDataURL } from './settingsUtils';
import 'jest-canvas-mock';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D | null;

describe('PhotoEditor', () => {

  beforeEach(() => {
    // jest.resetAllMocks();
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 300;

    // ctx?.setTransform(1, 2, 3, 4, 5, 6);
  });

  it('should encode Image to base64', () => {
    const image = new Image(400, 300);    
    image.src = 'picture.jpg';

    // ctx?.drawImage(image, 0, 0, 400, 300);
    const encodedImg = toDataURL(image);

    expect(encodedImg).toEqual('data:image/png;base64,00');
    // const events = ctx?.__getEvents();

    // expect(events).toMatchSnapshot();

    // canvas.toDataURL.mockReturnValueOnce(
    //   'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
    // );
  });

  it('should encode Image to base64', () => {
    const image = new Image(400, 300);    
    image.src = 'picture.jpg';

    // ctx?.drawImage(image, 0, 0, 400, 300);
    const encodedImg = toDataURL(image);

    expect(encodedImg).toEqual('data:image/png;base64,00');
    // const events = ctx?.__getEvents();

    // expect(events).toMatchSnapshot();

    // canvas.toDataURL.mockReturnValueOnce(
    //   'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
    // );
  });
});