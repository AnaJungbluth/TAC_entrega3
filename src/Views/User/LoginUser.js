import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';


function LoginUser({ setIsAuthenticated }) {
    const [username, setEmail] = useState('');
    const [password, setSenha] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/auth', {
                username,
                password
            });

            console.log('Login bem-sucedido:', response.data);
            // Salvar o token ou indicar o usuário logado
            const { token, userId } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId)
            setIsAuthenticated(true);
            handleShowModal('Login efetuado com sucesso!');
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            //console.error('Erro ao fazer login:', error);
            setErrorMessage('Erro ao fazer login. Por favor, verifique suas credenciais e tente novamente.');
            // Adicionar lógica de tratamento de erro, ex: mostrar mensagem ao usuário
        }
    };

    const handleCancel = () => {
        navigate('/'); // Navega para a página inicial ou para outra rota ao cancelar
    };

    const handleShowModal = (message) => {
        setSuccessMessage(message);
        setShowModal(true);
    };

    return (
        <div>
            <h1 className="pagination justify-content-center mt-4">Login</h1>
            {errorMessage && (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <fieldset className="form-group">
                    <label className="form-label" htmlFor="email">Email:</label>
                    <input className="form-control"
                        type="email"
                        id="email"
                        name="email"
                        value={username}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </fieldset>

                <fieldset className="form-group">
                    <label className="form-label" htmlFor="senha">Senha:</label>
                    <input className="form-control"
                        type="password"
                        id="senha"
                        name="senha"
                        value={password}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                </fieldset>

                <div className="pagination justify-content-center mt-4">
                    <button className="btn btn-success me-1" type="submit">Entrar</button>
                    <button className="btn btn-secondary" type="button" onClick={handleCancel}>Cancelar</button>
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

export default LoginUser;
