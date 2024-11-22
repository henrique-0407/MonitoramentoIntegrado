import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Registrar os componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ECGChart = ({ ecgData }) => {
  const [data, setData] = useState({
    labels: [],  // Armazenar os timestamps (em série)
    datasets: [{
      label: 'ECG Real',
      data: [],  // Aqui ficam os valores do ECG
      fill: false,
      borderColor: 'red',  // Cor da linha para vermelho
      color: 'white',  // Cor dos textos do gráfico (não é necessário aqui, pois usamos `text` em 'scales')
      tension: 0.1,
      borderWidth: 2,  // Largura da linha
    }],
  });

  useEffect(() => {
    if (ecgData !== undefined && ecgData !== null) {
      // Atualiza os dados com os novos valores de ECG
      setData((prevData) => {
        const newTime = new Date().toLocaleTimeString(); // Gera o timestamp atual

        // Adiciona o novo valor de ECG (valor de batimento)
        const newLabels = [...prevData.labels, newTime];
        const newData = [...prevData.datasets[0].data, ecgData];

        // Limita o gráfico a 20 pontos de dados (apaga dados antigos)
        if (newData.length > 20) {
          newLabels.shift();  // Remove o primeiro timestamp (mais antigo)
          newData.shift();    // Remove o primeiro valor de ECG (mais antigo)
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
  }, [ecgData]);  // Atualiza quando o ecgData mudar

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
          label: (context) => `Valor: ${context.raw.toFixed(2)}`,
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
          text: 'Amplitude',
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

export default ECGChart;
