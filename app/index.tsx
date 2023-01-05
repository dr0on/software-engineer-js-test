import React from 'react';
import ReactDOM from 'react-dom/client';
import { PhotoEditor } from './components/photo-editor';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <PhotoEditor />
  </React.StrictMode>
);
