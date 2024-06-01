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
      navigate('/'); // Navega para a página inicial ou para outra rota após o sucesso
    } catch (error) {
      console.error('Erro ao salvar o usuário:', error);
    }
  };

  const handleCancel = () => {
    navigate('/'); // Navega para a página inicial ou para outra rota ao cancelar
  };

  return (
    <div>
      <h1>Cadastrar Usuário</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nome:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={nome}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="senha">Senha:</label>
          <input
            type="password"
            id="senha"
            name="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>
        <button type="submit">Enviar</button>
        <button type="button" onClick={handleCancel}>Cancelar</button>
      </form>
    </div>
  );
}

export default UserAdd;
