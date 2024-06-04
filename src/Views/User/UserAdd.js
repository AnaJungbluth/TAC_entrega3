import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';


function UserAdd() {
  const [nome, setName] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!nome || !email || !senha) {
      setErrorMessage('Todos os campos são obrigatórios');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/pessoa', {
        nome,
        email,
        senha
      });
      handleShowModal('Usuário salvo com sucesso!');
      // Atraso para mostrar o modal antes de navegar
      setTimeout(() => navigate('/user-login'), 2000);
    } catch (error) {
      //console.error('Erro ao salvar o usuário:', error);
      setErrorMessage('Erro ao salvar o usuário. Por favor, tente novamente.'); // Define a mensagem de erro
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleShowModal = (message) => {
    setSuccessMessage(message);
    setShowModal(true);
  };


  return (
    <div>
      <h1 className="pagination justify-content-center mt-4">Cadastrar Usuário</h1>
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

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sucesso</Modal.Title>
        </Modal.Header>
        <Modal.Body>{successMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserAdd;
