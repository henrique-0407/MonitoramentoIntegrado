import { useEffect, useState } from 'react';
import './index.scss';
import axios from 'axios';
import ECGChart from '../../components/esg';  

export default function App() {
  const [mensagem, setMensagem] = useState({
    ecg: []
  });
  const [temp, setTemp] = useState('');
  const [press, setPress] = useState('');
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const response = await axios.get('http://localhost:5050/mensagem/');
        const responseT = await axios.get('http://localhost:5000/temp/');
        const responseP = await axios.get('http://localhost:5010/press/');

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
        if (responseP.data && responseP.data.pressao_mmHg) {
          setPress(responseP.data.pressao_mmHg);
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
          <h3 className="pressao">Pressão: {press}</h3>
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
