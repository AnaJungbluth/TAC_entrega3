import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function LeituraForm() {
  const [valor, setValor] = useState('');
  const navigate = useNavigate();
  const { id } = useParams(); // Pegando o parâmetro da URL

  useEffect(() => {
    const fetchSensores = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token de autenticação não encontrado.');
          return;
        }

        // Buscar os dispositivos cadastrados
        const response = await axios.get('http://localhost:8080/sensor', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Erro ao buscar sensores:', error);
      }
    };

    fetchSensores();

    if (id) {
      const fetchLeitura = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            console.error('Token de autenticação não encontrado.');
            return;
          }

          const response = await axios.get(`http://localhost:8080/leitura/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          setValor(response.data.valor);
        } catch (error) {
          console.error('Erro ao buscar o leitura:', error);
        }
      };

      fetchLeitura();
    }
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!valor) {
      console.error('Todos os campos são obrigatórios');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const idSensor = localStorage.getItem('sensorId');

      if (!token) {
        console.error('Token de autenticação não encontrado.');
        navigate('/user-login');
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

      console.log('Leitura salvo com sucesso:', response.data);
      navigate('/leitura'); // Navega para a página inicial ou para outra rota após o sucesso
    } catch (error) {
      console.error('Erro ao salvar o leitura:', error);
    }
  };

  const handleCancel = () => {
    navigate(`/dispositivo`); // Navega para a página inicial ou para outra rota ao cancelar
  };

  return (
    <div>
      <h1 className="pagination justify-content-center mt-4">{id ? 'Editar Leitura' : 'Cadastrar Leitura'}</h1>
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
    </div>
  );
}

export default LeituraForm
