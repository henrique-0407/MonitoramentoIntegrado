import { useEffect, useState } from 'react';
import './index.scss';
import axios from 'axios';
import ECGChart from '../../components/esg';  


export default function App() {

  const [mensagem, setMensagem] = useState({
    temperatura: '',
    ecg: [],
    pressao: ''

  });

  const [temperatura, setTemperatura] = useState('');

  const [erro, setErro] = useState(null);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const response = await axios.get('http://localhost:5050/mensagem/');
        if (response.data) {
          const dados = response.data;
  
          // Verifica se os campos existem e evita erros
          const ecgData = dados.ecg ? dados.ecg.map(item => ({
            valor: item.valor,
            tempo: item.tempo
          })) : [];
  
          setMensagem({
            temperatura: dados.temperatura || '',
            ecg: ecgData,
            pressao: dados.pressao || '',
            bpm: dados.bpm || 0,
            spO2: dados.spO2 || 0
          });
        }
      } catch (error) {
        setErro(`Erro ao buscar dados: ${error.message}`);
      }
    };
  
    buscarDados();
    const intervalo = setInterval(buscarDados, 1000);
  
    return () => clearInterval(intervalo);
  }, []);
  
  return (
    <div className="App">
      <h1>Dados ESP32</h1>
      <div className="dados">
        <div className="presureSD">
          <h3 className="pressao">Pressão diastólica: {mensagem.pressao}</h3>
          <h3 className="pressao">Pressão sistólica: {mensagem.pressao}</h3>
          <h3 className="temperatura">Temperatura: {mensagem.temperatura}</h3>
        </div>
        <div className="grafico">
          <h3 className="eletro">
            Dados Eletrocardiograma:
            <ECGChart ecgData={mensagem.ecg} />
          </h3>
        </div>
      </div>
    </div>
  );
}
