import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LeituraList() {
    const [leituras, setLeituras] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLeituras = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Token não encontrado no localStorage');
                    navigate('/user-login');
                }

                const response = await axios.get('http://localhost:8080/leitura', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setLeituras(response.data); // Certifique-se de que isso seja um array de objetos gateway
            } catch (error) {
                console.error('Erro ao buscar os leituras:', error);
            }
        };

        fetchLeituras();
    }, []);

    function handleEdit(id) {
        navigate(`/leitura/${id}`);
    }

    return (
        <div>
            <h1 className="pagination justify-content-center mt-4">Histórico de Leituras</h1>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Valor</th>
                        <th>Data Hora</th>
                        <th>Sensor</th> 
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {leituras.map((leitura) => (
                        <tr key={leitura.leituraid}>
                            <td>{leitura.valor}</td>
                            <td>{leitura.dataHora}</td>  
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
        </div>
    );
}

export default LeituraList;