import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registra os componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HeartbeatChart = ({ sensorData }) => {
  const [data, setData] = useState({
    labels: [], // Armazenará os timestamps (tempo)
    datasets: [
      {
        label: 'Batimentos Cardíacos (Digital)',
        data: [], // Armazenará os valores digitais (0 ou 1)
        fill: false,
        backgroundColor: '#FF6384', // Cor do ponto
        borderColor: '#FF6384', // Cor da linha
        tension: 0, // Linha reta (sem suavização)
        borderWidth: 2, // Largura da linha
      },
    ],
  });

  useEffect(() => {
    // Atualiza os dados do gráfico quando sensorData muda
    if (sensorData !== undefined) {
      setData((prevData) => {
        const newTime = new Date().toLocaleTimeString(); // Gera o timestamp atual
        const newLabels = [...prevData.labels, newTime];
        const newData = [...prevData.datasets[0].data, sensorData === 1 ? 1 : 0]; // Garante valores 0 ou 1

        // Limita o gráfico a 20 pontos (remove os mais antigos)
        if (newData.length > 20) {
          newLabels.shift();
          newData.shift();
        }

        return {
          labels: newLabels,
          datasets: [
            {
              ...prevData.datasets[0],
              data: newData,
            },
          ],
        };
      });
    }
  }, [sensorData]); // O efeito dispara quando sensorData muda

  // Configurações do gráfico
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff', // Cor da legenda
        },
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `Estado: ${context.raw === 1 ? 'Batimento Detectado' : 'Sem Batimento'}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Tempo',
          color: '#fff', // Cor do título do eixo X
        },
        ticks: {
          color: '#fff', // Cor dos ticks do eixo X
        },
      },
      y: {
        title: {
          display: true,
          text: 'Estado',
          color: '#fff', // Cor do título do eixo Y
        },
        ticks: {
          color: '#fff', // Cor dos ticks do eixo Y
          stepSize: 1, // Apenas valores 0 e 1
        },
        min: 0, // Valor mínimo
        max: 1, // Valor máximo
      },
    },
  };

  return (
    <div style={{ width: '400px', height: '200px' }}>
      <Line data={data} options={chartOptions} />
    </div>
  );
};

export default HeartbeatChart;
