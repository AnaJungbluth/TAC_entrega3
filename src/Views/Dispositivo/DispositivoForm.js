import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

function DispositivoForm() {
  const [nome, setName] = useState('');
  const [descricao, setDescricao] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [gateways, setGateways] = useState([]);
  const [selectedGateway, setSelectedGateway] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState('');
  const navigate = useNavigate();
  const { id } = useParams(); // Pegando o parâmetro da URL

  useEffect(() => {
    const fetchGateways = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId')
        if (!token) {
          handleShowErrorModal('Token não encontrado no localStorage');
          setTimeout(() => navigate('/user-login'), 2000);
        }

        // Buscar os gateways cadastrados
        const response = await axios.get(`http://localhost:8080/gateway/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        setGateways(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          handleShowErrorModal('Erro de autenticação');
          setTimeout(() => navigate('/user-login'), 2000);
        } else {
          //console.error('Erro ao buscar gateways:', error);
          setErrorMessage('Erro ao buscar gateways. Tente novamente mais tarde.');
        }
      }
    };

    fetchGateways();

    if (id) {
      const fetchDispositivo = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            handleShowErrorModal('Token não encontrado no localStorage');
            setTimeout(() => navigate('/user-login'), 2000);
          }

          const response = await axios.get(`http://localhost:8080/dispositivo/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          setName(response.data.nome);
          setDescricao(response.data.descricao);
          setLocalizacao(response.data.localizacao);
          setSelectedGateway(response.data.gatewayid);
        } catch (error) {
          if (error.response && error.response.status === 401) {
            handleShowErrorModal('Erro de autenticação');
            setTimeout(() => navigate('/user-login'), 2000);
          } else {
            //console.error('Erro ao buscar o dispositivo:', error);
            setErrorMessage('Erro ao buscar o dispositivo. Tente novamente mais tarde.');
          }
        }
      };

      fetchDispositivo();
    }
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!nome || !descricao || !localizacao || !selectedGateway) {
      setErrorMessage('Todos os campos são obrigatórios');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        handleShowErrorModal('Token não encontrado no localStorage');
        setTimeout(() => navigate('/user-login'), 2000);
      }

      const payload = { nome, descricao, localizacao, gatewayid: selectedGateway };

      let response;
      if (id) {
        // Se houver id, estamos editando um dispositivo existente
        response = await axios.put(`http://localhost:8080/dispositivo/${id}`, payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } else {
        // Caso contrário, estamos criando um novo dispositivo
        response = await axios.post('http://localhost:8080/dispositivo', payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      console.log('Dispositivo salvo com sucesso:', response.data);
      navigate('/dispositivo'); // Navega para a página inicial ou para outra rota após o sucesso
    } catch (error) {
      if (error.response && error.response.status === 401) {
        handleShowErrorModal('Erro de autenticação');
        setTimeout(() => navigate('/user-login'), 2000);
      } else {
        //console.error('Erro ao salvar o dispositivo:', error);
        setErrorMessage('Erro ao salvar o dispositivo. Tente novamente mais tarde.');
      }
    }
  };

  const handleCancel = () => {
    navigate('/dispositivo'); // Navega para a página inicial ou para outra rota ao cancelar
  };

  const handleShowErrorModal = (message) => {
    setErrorModalMessage(message);
    setShowErrorModal(true);
  };

  return (
    <div>
      <h1 className="pagination justify-content-center mt-4">{id ? 'Editar Dispositivo' : 'Cadastrar Dispositivo'}</h1>
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <fieldset className="form-group">
          <label className="form-label" htmlFor="name">Nome:</label>
          <input className="form-control"
            type="text"
            id="name"
            name="name"
            value={nome}
            onChange={(e) => setName(e.target.value)}
          />
        </fieldset>

        <fieldset className="form-group">
          <label className="form-label" htmlFor="descricao">Descrição:</label>
          <input className="form-control"
            type="text"
            id="descricao"
            name="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </fieldset>

        <fieldset className="form-group">
          <label className="form-label" htmlFor="localizacao">Localização:</label>
          <input className="form-control"
            type="text"
            id="localizacao"
            name="localizacao"
            value={localizacao}
            onChange={(e) => setLocalizacao(e.target.value)}
          />
        </fieldset>

        <fieldset className="form-group">
          <label className="form-label" htmlFor="gateway">Gateway:</label>
          <select
            id="gateway"
            name="gateway"
            className="form-control"
            value={selectedGateway}
            onChange={(e) => setSelectedGateway(e.target.value)}
          >
            <option value="">Selecione um Gateway</option>
            {gateways.map(gateway => (
              <option key={gateway.gatewayid} value={gateway.gatewayid}>{gateway.nome}</option>
            ))}
          </select>
        </fieldset>

        <div className="pagination justify-content-center mt-4">
          <button className="btn btn-success me-1" type="submit">{id ? 'Salvar' : 'Enviar'}</button>
          <button className="btn btn-secondary" type="button" onClick={handleCancel}>Cancelar</button>
        </div>
      </form>

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
}

export default DispositivoForm;
