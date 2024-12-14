import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ECGChart = ({ ecgData }) => {
  const [data, setData] = useState({
    labels: [], // Tempo em ms
    datasets: [
      {
        label: 'ECG Real',
        data: [], // Amplitude do ECG
        fill: false,
        borderColor: 'red',
        tension: 0.1,
        borderWidth: 2,
        pointRadius: 0,  
      },
    ],
  });

  useEffect(() => {
    if (ecgData && ecgData.length > 0) {
      const newLabels = ecgData.map((entry) => entry.tempo); // Tempo em ms
      const newData = ecgData.map((entry) => entry.valor);   // Valor do ECG (amplitude)

      setData({
        labels: newLabels,
        datasets: [
          {
            ...data.datasets[0],
            data: newData,
          },
        ],
      });
    } else {
      console.error('Dados do ECG não recebidos corretamente');
    }
  }, [ecgData]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `Valor: ${context.raw.toFixed(2)}`, // Exibe o valor com 2 casas decimais
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Tempo (ms)', // Eixo X: Tempo em milissegundos
          color: 'white',
        },
        ticks: {
          color: 'white',
          autoSkip: true, // Para não sobrecarregar o eixo X com muitos valores
          maxTicksLimit: 10, // Limita o número de ticks no eixo X
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Amplitude (ECG)', // Eixo Y: Amplitude do ECG
          color: 'white',
        },
        ticks: {
          color: 'white',
        },
        min: data.datasets[0].data.length > 0
          ? Math.min(...data.datasets[0].data) - 1
          : 0, // Define o mínimo do eixo Y com base nos dados
        max: data.datasets[0].data.length > 0
          ? Math.max(...data.datasets[0].data) + 1
          : 1, // Define o máximo do eixo Y com base nos dados
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
