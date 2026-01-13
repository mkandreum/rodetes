import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'
import { ToastProvider } from './context/ToastContext.tsx'
import ToastContainer from './components/common/ToastContainer.tsx'
import { registerServiceWorker } from './utils/registerSW'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ToastProvider>
                <App />
                <ToastContainer />
            </ToastProvider>
        </QueryClientProvider>
    </React.StrictMode>,
)

// Register Service Worker for PWA functionality
if (import.meta.env.PROD) {
    registerServiceWorker();
}
