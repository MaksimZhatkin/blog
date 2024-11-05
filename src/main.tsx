import React from 'react';
import { createRoot } from 'react-dom/client';

import App from 'app/App';
import './index.css';

const container = document.querySelector('#root') as HTMLElement;
if (!container) {
  throw new Error('Root element not found in the document');
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
