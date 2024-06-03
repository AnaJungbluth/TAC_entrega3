import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function GatewayForm() {
  const [nome, setName] = useState('');
  const [descricao, setDescricao] = useState('');
  const navigate = useNavigate();
  const { id } = useParams(); // Pegando o parâmetro da URL

  useEffect(() => {
    // Se houver um id, buscamos os dados do gateway para preencher o formulário
    if (id) {
      const fetchGateway = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            console.error('Token de autenticação não encontrado.');
            return;
          }

          const response = await axios.get(`http://localhost:8080/gateway/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          setName(response.data.nome);
          setDescricao(response.data.descricao);
        } catch (error) {
          console.error('Erro ao buscar o gateway:', error);
        }
      };

      fetchGateway();
    }
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token de autenticação não encontrado.');
        navigate('/user-login');
      }
      const userId = localStorage.getItem('userId');
      const payload = { nome, descricao, pessoaid: userId };

      let response;
      if (id) {
        // Se houver id, estamos editando um gateway existente
        response = await axios.put(`http://localhost:8080/gateway/${id}`, payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } else {
        // Caso contrário, estamos criando um novo gateway
        response = await axios.post('http://localhost:8080/gateway', payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      console.log('Gateway salvo com sucesso:', response.data);
      navigate('/gateway'); // Navega para a página inicial ou para outra rota após o sucesso
    } catch (error) {
      console.error('Erro ao salvar o gateway:', error);
    }
  };

  const handleCancel = () => {
    navigate('/gateway'); // Navega para a página inicial ou para outra rota ao cancelar
  };

  return (
    <div>
      <h1 className="pagination justify-content-center mt-4">{id ? 'Editar Gateway' : 'Cadastrar Gateway'}</h1>
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

        <div className="pagination justify-content-center mt-4">
          <button className="btn btn-success me-1" type="submit">{id ? 'Salvar' : 'Enviar'}</button>
          <button className="btn btn-secondary" type="button" onClick={handleCancel}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}

export default GatewayForm;
