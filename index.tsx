import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import Lucide icons globally if needed, but we import them per file.
// Import Recharts globally? No, handled in components.

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
