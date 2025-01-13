import axios from 'axios';

const API_URL = '/api/maritaca';
const API_KEY = import.meta.env.VITE_MARITACA_API_KEY;

interface MaritacaResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface MaritacaRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  model: string;
}

export const generateStudy = async (book: string, chapter: string, verse: string, text: string): Promise<string> => {
  const prompt = `Agora você é um teólogo com 30 anos de experiência em estudo do Livro de Mórmon. 
  Por favor, traga para mim um estudo aprofundado, em português, sobre o livro de ${book}, capítulo ${chapter} versículo ${verse} do Livro de Mórmon. 
  Use técnicas de exegese e hermenêutica para aprofundar ainda mais o estudo, sempre visitando o idioma original 
  em que o texto foi traduzido. Não precisa trazer o texto do livro de mórmon, pois eu o conheço. Deixe explicito que o estudo é baseado
  no texto em ingles. Quero apenas a explicação. Além disso, não precisa responder a este prompt dizendo que vai ajudar, apenas dê a resposta 
  do estudo diretamente, ponto a ponto. Além disso, me traga a resposta em markdown e não deve conter um título geral.
  Esta é a tradução original para inglês: "${text}"`

  const request: MaritacaRequest = {
    model: "sabiazinho-3",
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  };

  try {
    const response = await axios.post<MaritacaResponse>(
      API_URL,
      request,
      {
        headers: {
          'Authorization': `Key ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating study:', error);
    throw error;
  }
};
