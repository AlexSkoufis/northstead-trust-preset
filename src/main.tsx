import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { startSmoothScroll } from './motion/smooth';
import './styles/index.css';

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
startSmoothScroll();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
