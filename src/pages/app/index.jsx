import { useEffect, useState } from 'react';
import './index.scss';
import axios from 'axios';
import ECGChart from '../../components/esg';  // Componente de gráfico
import HeartbeatChart from '../../components/bc';

export default function App() {
  const [mensagem, setMensagem] = useState({});
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const tome = async () => {
      try {
        let response = await axios.get('http://localhost:5050/mensagem/');
        // Garantir que os valores de ECG sejam números
        setMensagem({
          temperatura: response.data.temperatura,
          ecg: parseFloat(response.data.ecg) || 0,  // Garantir que o valor de ECG seja um número
          pressao: response.data.pressao
        });
      } catch (error) {
        setErro(error.message);
      }
    };
    
    // Chama a função na primeira renderização e a cada 2 segundos
    tome();
    const intervalo = setInterval(tome, 1000);

    return () => clearInterval(intervalo);
  }, []);  // A dependência vazia [] significa que esse efeito acontece apenas uma vez, no carregamento inicial

  return (
    <div className="App">
      <h1>Dados ESP32</h1>
      <div className='dados'>
        

        <div className='presureSD'>
          <h3 className='pressao'>Pressão diastólica: {mensagem.pressao}</h3>
          <h3 className='pressao'>Pressão sistolica: {mensagem.pressao}</h3>
          <h3 className='temperatura'>Temperatura: {mensagem.temperatura}</h3>
        </div>

        <div className='batimentos'>
          <h3 className='bati'>
            Batimentos:
            <HeartbeatChart sensorData={mensagem.sensorB || 0} />

            </h3>
          <h3 className='pox'>oxigenação:</h3>
        </div>
        <div className='grafico'>
        <h3 className='eletro'>
          Dados Eletrocardiograma:
          <ECGChart ecgData={mensagem.ecg} />
        </h3>
        </div>
        

        

      </div>
      
    </div>
  );
}
