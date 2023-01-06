/**
 * @jest-environment jsdom
 */

import React from 'react';
import 'jest-canvas-mock';
import { act, render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { PhotoEditor } from './PhotoEditor';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D | null;

describe('PhotoEditor', () => {
  beforeEach(() => {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 300;
  });

  test('should upload image', async () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    render(<PhotoEditor />);

    const input = screen.getByLabelText('Upload Images or Configuration');
    await userEvent.click(screen.getByText('Upload Images or Configuration'));

    // const input = screen.getByTestId('file-selector');
    await userEvent.upload(input, file);

    // await act(async () => {
    //   await waitFor(() => {
    //     userEvent.upload(input, file);
    //   });
    // });
  });
});
