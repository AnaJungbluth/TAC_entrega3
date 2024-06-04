import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';


function DispositivoDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [dispositivo, setDispositivo] = useState(null);
    const [sensores, setSensores] = useState([]);
    const [atuadores, setAtuadores] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorModalMessage, setErrorModalMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            handleShowErrorModal('Token não encontrado no localStorage');
            setTimeout(() => navigate('/user-login'), 2000);
        }

        fetch(`http://localhost:8080/dispositivo/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        handleShowErrorModal('Erro de autenticação');
                        setTimeout(() => navigate('/user-login'), 2000);
                    }
                    setErrorMessage('Erro ao buscar dispositivo');
                }
                return response.json();
            })
            .then(data => {
                setDispositivo(data);
                setSensores(data.sensores || []);
                setAtuadores(data.atuadores || []);
                //console.log(data)
            })
            .catch(e => setErrorMessage('Deu erro'));
    }, [id, navigate]);

    const handleShowModal = (message) => {
        setSuccessMessage(message);
        setShowModal(true);
    };

    const handleDeleteDispositivo = async (dispositivoid) => {
        if (!window.confirm('Tem certeza de que deseja excluir este dispositivo?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                handleShowErrorModal('Token não encontrado no localStorage');
                setTimeout(() => navigate('/user-login'), 2000);
            }

            await axios.delete(`http://localhost:8080/dispositivo/${dispositivoid}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setDispositivo(dispositivo.filter(dispositivo => dispositivo.dispositivoid !== id));
            handleShowModal('Dispositivo excluído com sucesso!');
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

    const handleDeleteSensor = (sensorid) => {
        if (!window.confirm('Tem certeza de que deseja excluir este sensor?')) {
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            handleShowErrorModal('Token não encontrado no localStorage');
            setTimeout(() => navigate('/user-login'), 2000);
        }

        fetch(`http://localhost:8080/sensor/${sensorid}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        handleShowErrorModal('Erro de autenticação');
                        setTimeout(() => navigate('/user-login'), 2000);
                    }
                    setErrorMessage('Erro ao excluir sensor');
                }
                setSensores(sensores.filter(sensor => sensor.sensorid !== sensorid));
                handleShowModal('Sensor excluído com sucesso!');
            })
            .catch(e => setErrorMessage('Deu erro'));
    };

    const handleDeleteActuator = (atuadorid) => {
        if (!window.confirm('Tem certeza de que deseja excluir este atuador?')) {
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            handleShowErrorModal('Token não encontrado no localStorage');
            setTimeout(() => navigate('/user-login'), 2000);
        }

        fetch(`http://localhost:8080/atuador/${atuadorid}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        handleShowErrorModal('Erro de autenticação');
                        setTimeout(() => navigate('/user-login'), 2000);
                    }
                    setErrorMessage('Erro ao excluir atuador');
                }
                setAtuadores(atuadores.filter(atuador => atuador.atuadorid !== atuadorid));
                handleShowModal('Atuador excluído com sucesso!');
            })
            .catch(e => setErrorMessage('Deu erro'));
    };

    if (!dispositivo) {
        return <div>Carregando dispositivo...</div>;
    }

    const handleAddLeitura = (sensorId) => {
        localStorage.setItem('sensorId', sensorId);
        navigate('/leitura/new');
    };

    const handleShowErrorModal = (message) => {
        setErrorModalMessage(message);
        setShowErrorModal(true);
    };

    return (

        <div className="container mt-4">
            {errorMessage && (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            )}
            <div className="card">
                <div className="card-header">
                    <h2>Detalhes do Dispositivo: {dispositivo.nome}</h2>
                </div>
                <div className="card-body">
                    <p><strong>Descrição:</strong> {dispositivo.descricao}</p>
                    <p><strong>Localização:</strong> {dispositivo.localizacao}</p>
                    <p><strong>Gateway:</strong> {dispositivo.gateway_id}</p>

                    <div className="mt-4">
                        <h3>Sensores</h3>
                        {sensores.length > 0 ? (
                            <ul className="list-group">
                                {sensores.map(sensor => (
                                    <li key={sensor.sensorid} className="list-group-item d-flex justify-content-between align-items-center">
                                        {sensor.nome}
                                        <div className="btn-group">
                                            <button type="button" className="btn btn-primary" onClick={() => handleAddLeitura(sensor.sensorid)}>Adicionar Leitura</button>
                                            <button type="button" className="btn btn-success mx-1" onClick={() => navigate(`/sensor/${sensor.sensorid}?dispositivoid=${id}`)}>Editar</button>
                                            <button type="button" className="btn btn-danger" onClick={() => handleDeleteSensor(sensor.sensorid)}>Excluir</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted">Nenhum sensor encontrado.</p>
                        )}
                        <button type="button" className="btn btn-primary mt-2" onClick={() => navigate(`/sensor/new?dispositivoId=${id}`)}>Adicionar Sensor</button>
                    </div>

                    <div className="mt-4">
                        <h3>Atuadores</h3>
                        {atuadores.length > 0 ? (
                            <ul className="list-group">
                                {atuadores.map(atuador => (
                                    <li key={atuador.atuadorid} className="list-group-item d-flex justify-content-between align-items-center">
                                        {atuador.nome}
                                        <div className="btn-group">
                                            <button type="button" className="btn btn-success mx-1" onClick={() => navigate(`/atuador/${atuador.atuadorid}?dispositivoid=${id}`)}>Editar</button>
                                            <button type="button" className="btn btn-danger" onClick={() => handleDeleteActuator(atuador.atuadorid)}>Excluir</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted">Nenhum atuador encontrado.</p>
                        )}
                        <button type="button" className="btn btn-primary mt-2" onClick={() => navigate(`/atuador/new?dispositivoId=${id}`)}>Adicionar Atuador</button>
                    </div>
                </div>
                <div className="card-footer d-flex justify-content-end">
                    <button type="button" className="btn btn-success mx-2" onClick={() => navigate(`/dispositivo/${id}`)}>Editar</button>
                    <button type="button" className="btn btn-danger" onClick={() => handleDeleteDispositivo(dispositivo.dispositivoid)}>Excluir</button>
                    <button type="button" className="btn btn-secondary mx-2" onClick={() => navigate(`/dispositivo`)}>Cancelar</button>
                </div>
            </div>

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

export default DispositivoDetails;
