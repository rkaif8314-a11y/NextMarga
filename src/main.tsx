import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerPWA } from './pwa';

registerPWA();

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('NextMarga root element was not found. Check index.html for #root.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
