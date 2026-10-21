import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './lib/queryClient';
import { router } from './router'
import Toaster from './components/common/Toaster'
import './index.css'

async function enableMocking() {
  if (import.meta.env.PROD) {
    try {
      const registrations = await navigator.serviceWorker?.getRegistrations();
      registrations?.forEach((registration) => registration.unregister());
    } catch {
      // 무시
    }
    return;
  }

  const { worker } = await import('./mocks/browser');
  return worker.start({
    onUnhandledRequest: 'bypass',
  })
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </StrictMode>
  )
});
