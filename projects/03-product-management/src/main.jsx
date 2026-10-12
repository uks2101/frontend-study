import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { router } from './router'
import CartProvider from './store/cart/CartProvider'
import './index.css'

async function enableMocking() {
  const { worker } = await import('./mocks/browser');
  return worker.start({
    onUnhandledRequest: 'bypass',
  })
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </StrictMode>
  )
});
