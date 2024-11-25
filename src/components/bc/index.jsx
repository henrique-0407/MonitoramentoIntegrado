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

const HeartbeatChart = ({ heartRateData }) => {
  const [data, setData] = useState({
    labels: [],  // Armazenar os timestamps (em série)
    datasets: [{
      label: 'Batimentos Cardíacos',
      data: [],  // Aqui ficam os valores de batimentos cardíacos
      fill: false,
      borderColor: '#FF6384',  // Cor da linha para os batimentos cardíacos
      color: 'white',  // Cor dos textos do gráfico (não é necessário aqui, pois usamos 'scales')
      tension: 0.1,
      borderWidth: 2,  // Largura da linha
    }],
  });

  useEffect(() => {
    if (heartRateData !== undefined && heartRateData !== null) {
      // Atualiza os dados com os novos valores de batimento cardíaco
      setData((prevData) => {
        const newTime = new Date().toLocaleTimeString(); // Gera o timestamp atual

        // Adiciona o novo valor de batimento cardíaco
        const newLabels = [...prevData.labels, newTime];
        const newData = [...prevData.datasets[0].data, heartRateData];

        // Limita o gráfico a 20 pontos de dados (apaga dados antigos)
        if (newData.length > 20) {
          newLabels.shift();  // Remove o primeiro timestamp (mais antigo)
          newData.shift();    // Remove o primeiro valor de batimento cardíaco (mais antigo)
        }

        return {
          labels: newLabels,
          datasets: [{
            ...prevData.datasets[0],
            data: newData,
          }],
        };
      });
    }
  }, [heartRateData]);  // Atualiza quando o heartRateData mudar

  // Opções do gráfico
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',  // Cor das legendas
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `Batimento: ${context.raw.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Tempo',
          color: 'white',  // Cor do título do eixo X
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,  // Limita o número de ticks no eixo X
          color: 'white',  // Cor dos ticks no eixo X
        },
      },
      y: {
        title: {
          display: true,
          text: 'Batimentos',
          color: 'white',  // Cor do título do eixo Y
        },
        ticks: {
          color: 'white',  // Cor dos ticks no eixo Y
        },
        min: Math.min(...data.datasets[0].data) - 1, // Ajusta para a amplitude dos dados recebidos
        max: Math.max(...data.datasets[0].data) + 1, // Ajusta para a amplitude dos dados recebidos
      },
    },
  };

  return (
    <div>
      <Line data={data} options={chartOptions} />
    </div>
  );
};


export default HeartbeatChart;
