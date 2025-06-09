import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
// import theme from './theme.js';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from './components/ThemeProvider';
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { Toaster } from 'sonner';
import TagManager from 'react-gtm-module';
import { Analytics } from "@vercel/analytics/react";

// Google Tag Manager ID
const tagManagerArgs = {
  gtmId: 'GTM-KDLPMHHL'
};

TagManager.initialize(tagManagerArgs);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ThemeProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Toaster position="top-center" richColors />
        <App />
        <Analytics />
      </GoogleOAuthProvider>
    </ThemeProvider>
  </Provider>
);
