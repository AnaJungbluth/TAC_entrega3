import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function DispositivoDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [dispositivo, setDispositivo] = useState(null);
    const [sensores, setSensores] = useState([]);
    const [atuadores, setAtuadores] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/user-login');
            return;
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
                    navigate('/user-login');
                }
                throw new Error('Erro ao buscar dispositivo');
            }
            return response.json();
        })
        .then(data => {
            setDispositivo(data);
            setSensores(data.sensores || []);
            setAtuadores(data.atuadores || []);
            console.log(data)
        })
        .catch(e => console.log(e));
    }, [id, navigate]);

    const handleDeleteDispositivo = async (dispositivoid) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token não encontrado no localStorage');
                navigate('/user-login');
                return
            }

            await axios.delete(`http://localhost:8080/dispositivo/${dispositivoid}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setDispositivo(dispositivo.filter(dispositivo => dispositivo.dispositivoid !== id));
        } catch (error) {
            console.error('Erro ao deletar o dispositivo:', error);
        }
    };

    const handleDeleteSensor = (sensorid) => {
        if (!window.confirm('Tem certeza de que deseja excluir este sensor?')) {
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/user-login');
            return;
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
                    navigate('/user-login');
                }
                throw new Error('Erro ao excluir sensor');
            }
            setSensores(sensores.filter(sensor => sensor.sensorid !== sensorid));
        })
        .catch(e => console.log(e));
    };

    const handleDeleteActuator = (atuadorid) => {
        if (!window.confirm('Tem certeza de que deseja excluir este atuador?')) {
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/user-login');
            return;
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
                    navigate('/user-login');
                }
                throw new Error('Erro ao excluir atuador');
            }
            setAtuadores(atuadores.filter(atuador => atuador.atuadorid !== atuadorid));
        })
        .catch(e => console.log(e));
    };

    if (!dispositivo) {
        return <div>Carregando...</div>;
    }

    const handleAddLeitura = (sensorId) => {
        localStorage.setItem('sensorId', sensorId);
        navigate('/leitura/new');
    };

    return (
        <div className="container mt-4">
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
                                            <button type="button" className="btn btn-secundary" onClick={() => handleAddLeitura(sensor.sensorid)}>Adicionar Leitura</button>
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
        </div>

    );
}

export default DispositivoDetails;
