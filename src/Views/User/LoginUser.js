import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginUser({ setIsAuthenticated }) {
    const [username, setEmail] = useState('');
    const [password, setSenha] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/auth', {
                username,
                password
            });

            // Supondo que a resposta contenha um token ou indicação de sucesso
            console.log('Login bem-sucedido:', response.data);
            // Salvar o token ou indicar o usuário logado
            const { token, userId } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId)
            setIsAuthenticated(true);
            navigate('/'); // Navega para a página inicial ou para outra rota após o sucesso
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            // Adicionar lógica de tratamento de erro, ex: mostrar mensagem ao usuário
        }
    };

    const handleCancel = () => {
        navigate('/'); // Navega para a página inicial ou para outra rota ao cancelar
    };

    return (
        <div>
            <h1 className="pagination justify-content-center mt-4">Login</h1>
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
        </div>
    );
}

export default LoginUser;
