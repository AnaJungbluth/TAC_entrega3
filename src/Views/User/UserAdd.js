import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserAdd() {
  const [nome, setName] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/pessoa', {
        nome,
        email,
        senha
      });
      console.log('Usuário salvo com sucesso:', response.data);
      navigate('/user-login'); // Navega para a página inicial ou para outra rota após o sucesso
    } catch (error) {
      console.error('Erro ao salvar o usuário:', error);
    }
  };

  const handleCancel = () => {
    navigate('/'); 
  };

  return (
    <div>
      <h1 className="pagination justify-content-center mt-4">Cadastrar Usuário</h1>
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
          <label className="form-label" htmlFor="email">Email:</label>
          <input className="form-control"
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </fieldset>

        <fieldset className="form-group">
          <label className="form-label" htmlFor="senha">Senha:</label>
          <input className="form-control"
            type="password"
            id="senha"
            name="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </fieldset>

        <div className="pagination justify-content-center mt-4">
          <button className="btn btn-success me-1" type="submit">Enviar</button>
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}

export default UserAdd;
