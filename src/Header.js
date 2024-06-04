import { useNavigate } from 'react-router-dom';
import './App.css';

function Header() {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-content d-flex align-items-center justify-content-between">
        <span
          onClick={() => navigate('/')}
          style={{ color: 'black', fontSize: '24px', fontWeight: 'bold', textDecoration: 'none', cursor: 'pointer' }}
        >
          IoT Nexus
        </span>
        <div className="header-buttons">
          <button className="btn btn-success me-1" onClick={() => navigate('/user-add')}>Cadastrar</button>
          <button className="btn btn-secondary" onClick={() => navigate('/user-login')}>Login</button>
        </div>
      </div>
    </header>
  );
}

export default Header;
