import { useNavigate } from 'react-router-dom';

function HeaderHome() {
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
        <div className="header-links">
          <button className="btn btn-primary me-1" onClick={() => navigate('/dispositivo')}>Dispositivos</button>
          <button className="btn btn-warning me-1" onClick={() => navigate('/gateway')}>Gateways</button>
          <button className="btn btn-info me-1" onClick={() => navigate('/leitura')}>Leituras</button>
        </div>
      </div>
    </header>
  );
}

export default HeaderHome;
