import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function GatewayList() {
    const [gateways, setGateways] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGateways = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Token não encontrado no localStorage');
                    return;
                }

                console.log('Token:', token);  // Adiciona um log do token
                const response = await axios.get('http://localhost:8080/gateway', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setGateways(response.data); // Certifique-se de que isso seja um array de objetos gateway
            } catch (error) {
                console.error('Erro ao buscar os gateways:', error);
                if (error.response) {
                    console.error('Erro status:', error.response.status);
                    console.error('Erro data:', error.response.data);
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
                console.error('Token não encontrado no localStorage');
                return;
            }

            await axios.delete(`http://localhost:8080/gateway/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setGateways(gateways.filter(gateway => gateway.gatewayid !== id));
        } catch (error) {
            console.error('Erro ao deletar o gateway:', error);
            if (error.response) {
                console.error('Erro status:', error.response.status);
                console.error('Erro data:', error.response.data);
            }
        }
    };

    return (
        <div>
            <h1>Lista de Gateways</h1>
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
                                    className="btn btn-secondary mx-1" 
                                    onClick={() => handleDelete(gateway.gatewayid)}
                                >
                                    Deletar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={() => navigate('/gateway/new')}>Adicionar Gateway</button>
        </div>
    );
}

export default GatewayList;