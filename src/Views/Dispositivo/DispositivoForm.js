import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function DispositivoForm() {
  const [nome, setName] = useState('');
  const [descricao, setDescricao] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [gateways, setGateways] = useState([]);
  const [selectedGateway, setSelectedGateway] = useState('');
  const navigate = useNavigate();
  const { id } = useParams(); // Pegando o parâmetro da URL

  useEffect(() => {
    const fetchGateways = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token de autenticação não encontrado.');
          return;
        }

        // Buscar os gateways cadastrados
        const response = await axios.get('http://localhost:8080/gateway', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        setGateways(response.data);
      } catch (error) {
        console.error('Erro ao buscar gateways:', error);
      }
    };

    fetchGateways();

    if (id) {
      const fetchDispositivo = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            console.error('Token de autenticação não encontrado.');
            return;
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
          console.error('Erro ao buscar o dispositivo:', error);
        }
      };

      fetchDispositivo();
    }
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!nome || !descricao || !localizacao || !selectedGateway) {
      console.error('Todos os campos são obrigatórios');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token de autenticação não encontrado.');
        navigate('/user-login');
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
      console.error('Erro ao salvar o dispositivo:', error);
    }
  };

  const handleCancel = () => {
    navigate('/dispositivo'); // Navega para a página inicial ou para outra rota ao cancelar
  };

  return (
    <div>
      <h1 className="pagination justify-content-center mt-4">{id ? 'Editar Dispositivo' : 'Cadastrar Dispositivo'}</h1>
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
    </div>
  );
}

export default DispositivoForm;
