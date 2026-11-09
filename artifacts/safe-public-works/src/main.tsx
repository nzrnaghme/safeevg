import App from "./App";
import { createRoot } from 'react-dom/client';

import { loadContent } from "./lib/site-content";
import { ErrorBoundary } from '@/components/error-boundary';

import './index.css';

async function start() {
  await loadContent();
  createRoot(document.getElementById('root')!, {
    // Keeps caught errors off reportError(), which would raise the dev overlay.
    onCaughtError: (error, errorInfo) => {
      console.error(error, errorInfo.componentStack);
    },
  }).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>,
  );
}
void start();
