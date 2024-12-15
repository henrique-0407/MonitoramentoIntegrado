import { useEffect, useState } from 'react';
import './index.scss';
import axios from 'axios';
import ECGChart from '../../components/esg';  

export default function App() {
  const [mensagem, setMensagem] = useState({
    ecg: []
  });
  const [temp, setTemp] = useState(''); // Alterei para armazenar apenas o valor da temperatura como string ou número
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const response = await axios.get('http://localhost:5050/mensagem/');
        const responseT = await axios.get('http://localhost:5000/temp/');

        if (response.data) {
          const dados = response.data;
          
          const ecgData = dados.ECG ? dados.ECG.map(item => ({
            valor: item.valor,
            tempo: item.tempo
          })) : [];
  
          setMensagem({
            ecg: ecgData
          });
        }

        // Aqui você extrai a temperatura de responseT.data, assumindo que a resposta tem a chave 'temperatura'
        if (responseT.data && responseT.data.temperatura) {
          setTemp(responseT.data.temperatura);
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
          {/* Exibição da temperatura ajustada */}
          <h3 className="temperatura">Temperatura: {temp}</h3>
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
