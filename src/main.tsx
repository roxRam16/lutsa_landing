import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './i18n/LanguageContext';
import './index.css';
import './styles/somos.css';
import './styles/servicios.css';
import './styles/industrias.css';
import './styles/ecosistema.css';
import './styles/cotizacion.css';
import './styles/certificaciones.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
);
