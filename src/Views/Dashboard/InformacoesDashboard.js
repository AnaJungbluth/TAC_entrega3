import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Deshboard';
import { Modal, Button } from 'react-bootstrap';


const InformacoesDashboard = () => {
  const [dispositivos, setDispositivos] = useState([]);
  const navigate = useNavigate();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const id = localStorage.getItem('userId'); // Obtém o ID do usuário autenticado do armazenamento local

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      handleShowErrorModal('Token não encontrado no localStorage');
      setTimeout(() => navigate('/user-login'), 2000);
    }

    const fetchDispositivo = async () => {
      try {
        const response = await fetch(`http://localhost:8080/dispositivo`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          setErrorMessage('Erro ao buscar dispositivos');
        }
        const data = await response.json();
        setDispositivos(data);
      } catch (error) {
        setErrorMessage('Erro');
      }
    };

    fetchDispositivo();
  }, [id]);

  const handleShowErrorModal = (message) => {
    setErrorModalMessage(message);
    setShowErrorModal(true);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Dashboard dos Dispositivos</h1>
      <div className="row">
        {dispositivos.length === 0 ? (
          <div className="col-12">
            <p className="text-center">Não tem dispositivo para os gateway cadastrados.</p>
          </div>
        ) : (
          dispositivos.map(dispositivo => (
            <div className="col-lg-6 mb-4" key={dispositivo.dispositivoid}>
              <div className="card h-100">
                <div className="card-body">
                  <h2 className="card-title">Dispositivo: {dispositivo.nome}</h2>
                  {dispositivo.sensores && dispositivo.sensores.length > 0 ? (
                    dispositivo.sensores.map(sensor => (
                      <Dashboard key={sensor.sensorid} sensorid={sensor.sensorid} />
                    ))
                  ) : (
                    <p className="card-text">Não tem sensor para esse dispositivo.</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Erro</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorModalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InformacoesDashboard;
