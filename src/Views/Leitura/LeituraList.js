import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';


function LeituraList() {
    const [leituras, setLeituras] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorModalMessage, setErrorModalMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLeituras = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    handleShowErrorModal('Token não encontrado no localStorage');
                    setTimeout(() => navigate('/user-login'), 2000);
                }

                const response = await axios.get('http://localhost:8080/leitura', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setLeituras(response.data); // Certifique-se de que isso seja um array de objetos gateway
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    handleShowErrorModal('Erro de autenticação');
                    setTimeout(() => navigate('/user-login'), 2000);
                } else {
                    //console.error('Erro ao buscar os leituras:', error);
                    setErrorMessage('Erro ao buscar leituras. Tente novamente mais tarde.');
                }
            }
        };

        fetchLeituras();
    }, []);

    function handleEdit(id) {
        navigate(`/leitura/${id}`);
    }

    const handleShowErrorModal = (message) => {
        setErrorModalMessage(message);
        setShowErrorModal(true);
    };

    return (
        <div>
            <h1 className="pagination justify-content-center mt-4">Histórico de Leituras</h1>
            {errorMessage && (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            )}
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Valor</th>
                        <th>Data</th>
                        <th>Hora</th>
                        <th>Sensor</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {leituras.map((leitura) => (
                        <tr key={leitura.leituraid}>
                            <td>{leitura.valor}</td>
                            <td>{new Date(leitura.dataHora).toLocaleDateString()}</td>
                            <td>{new Date(leitura.dataHora).toLocaleTimeString()}</td>
                            <td>{leitura.sensor_id}</td>
                            <td>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => handleEdit(leitura.leituraid)}
                                >
                                    Editar
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

export default LeituraList;