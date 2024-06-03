import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';

function SensorForm() {
    const [nome, setName] = useState('');
    const [tipo, setTipo] = useState('');
    const [dispositivos, setDispositivo] = useState([]);
    const [selectedDispositivo, setSelectedDispositivo] = useState('');
    const navigate = useNavigate();
    const { id } = useParams(); // Pegando o parâmetro da URL
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const fetchDispositivos = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Token de autenticação não encontrado.');
                    return;
                }

                // Buscar os dispositivos cadastrados
                const response = await axios.get('http://localhost:8080/dispositivo', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                setDispositivo(response.data);
            } catch (error) {
                console.error('Erro ao buscar dispositivos:', error);
            }
        };

        fetchDispositivos();

        const dispositivoIdFromParams = searchParams.get('dispositivoId');
        if (dispositivoIdFromParams) {
            setSelectedDispositivo(dispositivoIdFromParams);
        }

        if (id) {
            const fetchSensor = async () => {
                try {
                    const token = localStorage.getItem('token');
                    if (!token) {
                        console.error('Token de autenticação não encontrado.');
                        return;
                    }

                    const response = await axios.get(`http://localhost:8080/sensor/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    setName(response.data.nome);
                    setTipo(response.data.tipo);
                    setSelectedDispositivo(response.data.dispositivoid);
                } catch (error) {
                    console.error('Erro ao buscar o sensor:', error);
                }
            };

            fetchSensor();
        }
    }, [id, searchParams]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!nome || !tipo || !selectedDispositivo) {
            console.error('Todos os campos são obrigatórios');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token de autenticação não encontrado.');
                navigate('/user-login');
            }

            const payload = { nome, tipo, dispositivoid: selectedDispositivo };

            let response;
            if (id) {
                // Se houver id, estamos editando um dispositivo existente
                response = await axios.put(`http://localhost:8080/sensor/${id}`, payload, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            } else {
                // Caso contrário, estamos criando um novo sensor
                response = await axios.post('http://localhost:8080/sensor', payload, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            }

            console.log('Sensor salvo com sucesso:', response.data);
            navigate(`/dispositivo/details/${selectedDispositivo}`); // Navega para a página inicial ou para outra rota após o sucesso
        } catch (error) {
            console.error('Erro ao salvar o sensor:', error);
        }
    };

    const handleCancel = () => {
        navigate(`/dispositivo`); // Navega para a página inicial ou para outra rota ao cancelar
    };

    return (
        <div>
            <h1 className="pagination justify-content-center mt-4">{id ? 'Editar Sensor' : 'Cadastrar Sensor'}</h1>
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
                    <label className="form-label" htmlFor="name">Tipo:</label>
                    <input className="form-control"
                        type="text"
                        id="tipo"
                        name="tipo"
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                    />
                </fieldset>

                <fieldset className="form-group">
                    <label className="form-label" htmlFor="gateway">Dispositivo:</label>
                    <select
                        id="dispositivo"
                        name="dispositivo"
                        className="form-control"
                        value={selectedDispositivo}
                        onChange={(e) => setSelectedDispositivo(e.target.value)}
                    >
                        <option value="">Selecione um Dispositivo</option>
                        {dispositivos.map(dispositivo => (
                            <option key={dispositivo.dispositivoid} value={dispositivo.dispositivoid}>{dispositivo.nome}</option>
                        ))}
                    </select>
                </fieldset>

                <div className="pagination justify-content-center mt-4">
                    <button className="btn btn-success me-1" type="submit">{id ? 'Salvar' : 'Enviar'}</button>
                    <button className="btn btn-secondary" type="button" onClick={handleCancel}>Cancelar</button>
                </div>
            </form>
        </div>
    );
}

export default SensorForm;
