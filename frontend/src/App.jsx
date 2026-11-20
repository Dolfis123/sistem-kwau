import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { LanguageProvider } from './i18n/LanguageContext.jsx';
import AppRouter from './routes/AppRouter.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
