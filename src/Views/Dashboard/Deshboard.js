import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeScale
} from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, TimeScale);

const Dashboard = ({ sensorid }) => {
  const [chartData, setChartData] = useState({ datasets: [] });
  const [sensorName, setSensorName] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/user-login');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/sensor/${sensorid}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Nenhum gráfico a ser mostrado');
        }
        const data = await response.json();
        if (!data || !data.leituras) {
          throw new Error('Invalid JSON response');
        }

        const labels = data.leituras.map(leitura => leitura.dataHora);
        const valores = data.leituras.map(leitura => leitura.valor);

        setSensorName(data.nome); // Define o nome do sensor

        setChartData({
          labels: labels,
          datasets: [
            {
              label: `Leitura ${data.nome}`, // Usa o nome do sensor no label do gráfico
              data: valores,
              borderColor: 'rgba(255, 165, 0, 1)',
              borderWidth: 1,
              pointBackgroundColor: 'rgba(255, 165, 0, 1)'
            }
          ]
        });
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [sensorid, navigate]);

  return (
    <div className="container mt-3">
      <div className="card shadow-sm">
      <div className="card-header bg-primary text-white">
          <h2 className=" my-2" style={{ fontSize: '1.5rem', fontWeight: '400' }}>
            Sensor {sensorName}
          </h2> {/* Usa o nome do sensor no título */}
        </div>
        <div className="card-body">
          {error ? (
            <div className="alert alert-danger" role="alert">
              Error: {error}
            </div>
          ) : (
            <div className="chart-container" style={{ position: 'relative', height: '50vh' }}>
              <Line
                data={chartData}
                options={{
                  scales: {
                    x: {
                      type: 'time',
                      time: {
                        unit: 'day'
                      }
                    },
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;