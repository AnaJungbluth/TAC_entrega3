import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';


function LeituraForm() {
  const [valor, setValor] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState('');
  const navigate = useNavigate();
  const { id } = useParams(); // Pegando o parâmetro da URL

  useEffect(() => {
    const fetchSensores = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          handleShowErrorModal('Token não encontrado no localStorage');
          setTimeout(() => navigate('/user-login'), 2000);
        }

        // Buscar os dispositivos cadastrados
        const response = await axios.get('http://localhost:8080/sensor', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        if (error.response && error.response.status === 401) {
          handleShowErrorModal('Erro de autenticação');
          setTimeout(() => navigate('/user-login'), 2000);
        } else {
          //console.error('Erro ao buscar sensores:', error);
          setErrorMessage('Erro ao buscar sensores. Tente novamente mais tarde.');
        }
      }
    };

    fetchSensores();

    if (id) {
      const fetchLeitura = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            handleShowErrorModal('Token não encontrado no localStorage');
            setTimeout(() => navigate('/user-login'), 2000);
          }

          const response = await axios.get(`http://localhost:8080/leitura/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          setValor(response.data.valor);
        } catch (error) {
          if (error.response && error.response.status === 401) {
            handleShowErrorModal('Erro de autenticação');
            setTimeout(() => navigate('/user-login'), 2000);
          } else {
            //console.error('Erro ao buscar o leitura:', error);
            setErrorMessage('Erro ao buscar o leitura. Tente novamente mais tarde.');
          }

        }
      };

      fetchLeitura();
    }
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!valor) {
      setErrorMessage('Todos os campos são obrigatórios');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const idSensor = localStorage.getItem('sensorId');

      if (!token) {
        handleShowErrorModal('Token não encontrado no localStorage');
        setTimeout(() => navigate('/user-login'), 2000);
      }

      const payload = { valor, sensorid: idSensor };

      let response;
      if (id) {
        // Se houver id, estamos editando uma leitura existente
        response = await axios.put(`http://localhost:8080/leitura/${id}`, payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } else {
        // Caso contrário, estamos criando um novo leitura
        response = await axios.post('http://localhost:8080/leitura', payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      //console.log('Leitura salvo com sucesso:', response.data);
      navigate('/leitura'); // Navega para a página inicial ou para outra rota após o sucesso
    } catch (error) {
      if (error.response && error.response.status === 401) {
        handleShowErrorModal('Erro de autenticação');
        setTimeout(() => navigate('/user-login'), 2000);
      } else {
        //console.error('Erro ao salvar o leitura:', error);
        setErrorMessage('Erro ao salvar o leitura. Tente novamente mais tarde.');
      }

    }
  };

  const handleCancel = () => {
    navigate(`/dispositivo`); // Navega para a página inicial ou para outra rota ao cancelar
  };

  const handleShowErrorModal = (message) => {
    setErrorModalMessage(message);
    setShowErrorModal(true);
  };

  return (
    <div>
      <h1 className="pagination justify-content-center mt-4">{id ? 'Editar Leitura' : 'Cadastrar Leitura'}</h1>
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <fieldset className="form-group">
          <label className="form-label" htmlFor="name">Valor:</label>
          <input className="form-control"
            type="text"
            id="valor"
            name="valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
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

export default LeituraForm
