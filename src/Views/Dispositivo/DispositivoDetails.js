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

    const handleDeleteDevice = (id) => {
        if (!window.confirm('Tem certeza de que deseja excluir este dispositivo?')) {
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/user-login');
            return;
        }

        fetch(`http://localhost:8080/dispositivo/${id}`, {
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
                throw new Error('Erro ao excluir dispositivo');
            }
            navigate('/dispositivo');
        })
        .catch(e => console.log(e));
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

    return (
        <div>
            <h2>Detalhes do Dispositivo: {dispositivo.nome}</h2>
            <p>Descrição: {dispositivo.descricao}</p>
            <p>Localização: {dispositivo.localizacao}</p>
            <p>Gateway: {dispositivo.gatewayid}</p>
            
            <h3>Sensores</h3>
            {sensores.length > 0 ? (
                <ul>
                    {sensores.map(sensor => (
                        <li key={sensor.sensorid}>
                            {sensor.nome}
                            <button type="button" className="btn btn-success" onClick={() => navigate(`/sensor/${sensor.sensorid}?dispositivoid=${id}`)}>Editar</button>
                            <button type="button" className="btn btn-danger" onClick={() => handleDeleteSensor(sensor.sensorid)}>Excluir</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Nenhum sensor encontrado.</p>
            )}
            <button type="button" className="btn btn-primary" onClick={() => navigate(`/sensor/new?dispositivoid=${id}`)}>Add Sensor</button>

            <h3>Atuadores</h3>
            {atuadores.length > 0 ? (
                <ul>
                    {atuadores.map(atuador => (
                        <li key={atuador.atuadorid}>
                            {atuador.nome}
                            <button type="button" className="btn btn-success" onClick={() => navigate(`/atuador/${atuador.atuadorid}?dispositivoid=${id}`)}>Editar</button>
                            <button type="button" className="btn btn-danger" onClick={() => handleDeleteActuator(atuador.atuadorid)}>Excluir</button>
                        </li>
                    ))}
                </ul>
            ) : (
               <p>Nenhum atuador encontrado.</p>
            )}
            <button type="button" className="btn btn-primary" onClick={() => navigate(`/atuador/new?dispositivoid=${id}`)}>Add Atuador</button>

            <button type="button" className="btn btn-success" onClick={() => navigate(`/dispositivo/${id}`)}>Editar</button>
            <button type="button" className="btn btn-danger" onClick={() => handleDeleteDevice(id)}>Excluir</button>
        </div>
    );
}

export default DispositivoDetails;
