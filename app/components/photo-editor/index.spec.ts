/**
 * @jest-environment jsdom
 */

import { toDataURL, saveSettingsFile } from './ImageSettingsUtils';
// import { setupJestCanvasMock } from 'jest-canvas-mock';
import 'jest-canvas-mock';

describe('PhotoEditor', () => {

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should encode Image to base64', () => {
    const image = new Image();
    const encodedImg = toDataURL(image);

    // canvas.toDataURL.mockReturnValueOnce(
    //   'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
    // );

    console.log(encodedImg);
  });
});