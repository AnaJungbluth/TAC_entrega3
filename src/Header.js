import { useNavigate } from 'react-router-dom';
import './App.css';

function Header() {
  const navigate = useNavigate();
  
  return (
    <header className="app-header">
      <div className="header-content">
        <span>Minha App</span>
        <div className="header-buttons">
        <button onClick={() => navigate('/user-add')}>Cadastrar</button>
        <button onClick={() => navigate('/user-login')}>Login</button>
      </div>
      </div>   
    </header>
  );
}

export default Header;
