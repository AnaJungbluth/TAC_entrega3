import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';


function GatewayList() {
    const [gateways, setGateways] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorModalMessage, setErrorModalMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGateways = async () => {
            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('userId')
                if (!token) {
                    handleShowErrorModal('Token não encontrado no localStorage');
                    setTimeout(() => navigate('/user-login'), 2000);
                }

                const response = await axios.get(`http://localhost:8080/gateway/user/${userId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setGateways(response.data); // Certifique-se de que isso seja um array de objetos gateway
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    handleShowErrorModal('Erro de autenticação');
                    setTimeout(() => navigate('/user-login'), 2000);
                } else {
                    //console.error('Erro ao buscar os gateways:', error);
                    setErrorMessage('Erro ao buscar os gateways. Tente novamente mais tarde.');
                }
            }
        };

        fetchGateways();
    }, []);

    function handleEdit(id) {
        navigate(`/gateway/${id}`);
    }

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                handleShowErrorModal('Token não encontrado no localStorage');
                setTimeout(() => navigate('/user-login'), 2000);
            }

            await axios.delete(`http://localhost:8080/gateway/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setGateways(gateways.filter(gateway => gateway.gatewayid !== id));
        } catch (error) {
            if (error.response && error.response.status === 401) {
                handleShowErrorModal('Erro de autenticação');
                setTimeout(() => navigate('/user-login'), 2000);
            } else {
                //console.error('Erro ao deletar o gateway:', error);
                setErrorMessage('Erro ao deletar o gateway. Tente novamente mais tarde.');
            }
        }
    };

    const handleShowErrorModal = (message) => {
        setErrorModalMessage(message);
        setShowErrorModal(true);
    };

    return (
        <div>
            <h1 className="pagination justify-content-center mt-4">Lista de Gateways</h1>
            {errorMessage && (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            )}
            <button className="btn btn-primary mt-4" onClick={() => navigate('/gateway/new')}>Adicionar Gateway</button>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Dispositivos</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {gateways.map((gateway) => (
                        <tr key={gateway.gatewayid}>
                            <td>{gateway.nome}</td>
                            <td>{gateway.descricao}</td>
                            <td>
                                {gateway.dispositivos && gateway.dispositivos.length > 0 ? (
                                    gateway.dispositivos.map(dispositivo => (
                                        <div key={dispositivo.dispositivoid}>{dispositivo.nome}</div>
                                    ))
                                ) : (
                                    <div>0</div>
                                )}
                            </td>
                            <td>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => handleEdit(gateway.gatewayid)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="btn btn-danger mx-1"
                                    onClick={() => handleDelete(gateway.gatewayid)}
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

export default GatewayList;