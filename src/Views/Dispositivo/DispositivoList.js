import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function DispositivoList() {
    const [dispositivos, setDispositivo] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDispositivo = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Token não encontrado no localStorage');
                    return;
                }

                console.log('Token:', token);  // Adiciona um log do token
                const response = await axios.get('http://localhost:8080/dispositivo', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setDispositivo(response.data); // Certifique-se de que isso seja um array de objetos gateway
            } catch (error) {
                console.error('Erro ao buscar os dispositivos:', error);
                if (error.response) {
                    console.error('Erro status:', error.response.status);
                    console.error('Erro data:', error.response.data);
                }
            }
        };

        fetchDispositivo();
    }, []);

    function handleEdit(id) {
        navigate(`/dispositivo/${id}`);
    }

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token não encontrado no localStorage');
                return;
            }

            await axios.delete(`http://localhost:8080/dispositivo/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setDispositivo(dispositivos.filter(dispositivo => dispositivo.dispositivoid !== id));
        } catch (error) {
            console.error('Erro ao deletar o dispositivo:', error);
            if (error.response) {
                console.error('Erro status:', error.response.status);
                console.error('Erro data:', error.response.data);
            }
        }
    };

    return (
        <div>
            <h1>Lista de Dispositivos</h1>
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
                                    className="btn btn-secondary" 
                                    onClick={() => handleEdit(dispositivo.dispositivoid)}
                                >
                                    Editar
                                </button>
                                <button 
                                    className="btn btn-secondary mx-1" 
                                    onClick={() => handleDelete(dispositivo.dispositivoid)}
                                >
                                    Deletar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={() => navigate('/dispositivo/new')}>Adicionar Dispositivo</button>
        </div>
    );
}

export default DispositivoList;