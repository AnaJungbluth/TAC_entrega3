import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import styles from '../../style/botao.module.css'

function DispositivoList() {
    const [dispositivos, setDispositivo] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorModalMessage, setErrorModalMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDispositivo = async () => {
            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('userId')
                if (!token) {
                    handleShowErrorModal('Token não encontrado no localStorage');
                    setTimeout(() => navigate('/user-login'), 2000);
                }

                //console.log('Token:', token);  // Adiciona um log do token
                const response = await axios.get(`http://localhost:8080/dispositivo/user/${userId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setDispositivo(response.data); // Certifique-se de que isso seja um array de objetos gateway
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    handleShowErrorModal('Erro de autenticação');
                    setTimeout(() => navigate('/user-login'), 2000);
                } else {
                    //console.error('Erro ao buscar os dispositivos:', error);
                    setErrorMessage('Erro ao buscar os dispositivos. Tente novamente mais tarde.');
                }
            }
        };

        fetchDispositivo();
    }, []);

    function handleEdit(id) {
        navigate(`/dispositivo/${id}`);
    }

    function handleDetalhes(id) {
        navigate(`/dispositivo/details/${id}`);
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza de que deseja excluir este dispositivo?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                handleShowErrorModal('Token não encontrado no localStorage');
                setTimeout(() => navigate('/user-login'), 2000);
            }

            await axios.delete(`http://localhost:8080/dispositivo/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setDispositivo(dispositivos.filter(dispositivo => dispositivo.dispositivoid !== id));
        } catch (error) {
            if (error.response && error.response.status === 401) {
                handleShowErrorModal('Erro de autenticação');
                setTimeout(() => navigate('/user-login'), 2000);
            } else {
                //console.error('Erro ao deletar o dispositivo:', error);
                setErrorMessage('Erro ao deletar o dispositivo. Tente novamente mais tarde.');
            }
        }
    };

    const handleShowErrorModal = (message) => {
        setErrorModalMessage(message);
        setShowErrorModal(true);
    };

    return (
        <div>
            <h1 className="pagination justify-content-center mt-4">Lista de Dispositivos</h1>
            {errorMessage && (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            )}
            <button className="btn btn-primary mt-4" onClick={() => navigate('/dispositivo/new')}>Adicionar Dispositivo</button>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Localização</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {dispositivos.map((dispositivo) => (
                        <tr key={dispositivo.dispositivoid}>
                            <td>{dispositivo.nome}</td>
                            <td>{dispositivo.descricao}</td>
                            <td>{dispositivo.localizacao}</td>
                            <td>
                                <button
                                    className= {`btn btn-warning ${styles.btnColor}`}
                                    onClick={() => handleDetalhes(dispositivo.dispositivoid)}
                                >
                                    Detalhes
                                </button>
                                <button
                                    className="btn btn-secondary mx-1"
                                    onClick={() => handleEdit(dispositivo.dispositivoid)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDelete(dispositivo.dispositivoid)}
                                >
                                    Deletar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

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

export default DispositivoList;