import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { WalletProvider } from './context/WalletContext.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GOOGLE_CLIENT_ID } from './constants/constants'

const app = (
  <AuthProvider>
    <WalletProvider>
      <App />
    </WalletProvider>
  </AuthProvider>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {GOOGLE_CLIENT_ID ? (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>{app}</GoogleOAuthProvider>
    ) : (
      app
    )}
  </StrictMode>,
)
