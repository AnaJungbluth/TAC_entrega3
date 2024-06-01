import { BrowserRouter, useNavigate } from 'react-router-dom';
import './App.css';
import AppRoutes from './AppRoutes';
import Header from './Header';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  return (
    <>
      <hr />
      <main>
        <AppRoutes />
      </main>
      <hr />
      <footer>Feito na UTF-MD</footer>
    </>
  );
}

export default App;
