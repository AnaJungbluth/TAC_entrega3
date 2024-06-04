import { BrowserRouter } from 'react-router-dom';
import './App.css';
import AppRoutes from './AppRoutes';
import { useState } from 'react';
import HeaderHome from './Views/HeaderHome';
import Header from './Header';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      {isAuthenticated ? <HeaderHome /> : <Header />}
      <AppContent setIsAuthenticated={setIsAuthenticated} />
    </BrowserRouter>
  );
}

function AppContent({ setIsAuthenticated }) {
  return (
    <>
      <hr />
      <main className="main">
        <AppRoutes setIsAuthenticated={setIsAuthenticated} />
      </main>
      <hr />
      <footer className="pagination justify-content-center mt-2 mb-2">Feito na UTF-MD</footer>
    </>
  );
}

export default App;