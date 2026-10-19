import { createPortal } from 'react-dom';
import { dismissToast, useToastStore } from '../../store/toast/toastStore';
import ToastContainer from './ToastContainer';

export default function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  return createPortal(<ToastContainer toasts={toasts} onDismiss={dismissToast} />, document.body);
}