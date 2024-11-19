import { useEffect, useState } from 'react';
import './index.scss';
import axios from 'axios';

export default function App() {
  const [mensagem, setMensagem] = useState({});
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const tome = async () => {
      try {
        let response = await axios.get('http://localhost:5050/mensagem/');
        setMensagem({
          temperatura: response.data.temperatura,
          ecg: response.data.ecg,
          pressao: response.data.pressao
        }); 
      } catch (error) {
        setErro(error.message);
      }
    };
    
    tome();

    const intervalo = setInterval(tome,2000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="App">
      <h1>Dados ESP32</h1>
      <h3 className='eletro'>Dados Eletrocardiograma: {mensagem.ecg}</h3>
      <h3 className='temperatura'>Dados temperatura: {mensagem.temperatura}</h3>
      <h3 className='pressao'>Dados pressao: {mensagem.pressao}</h3>
    </div>
  );
}
