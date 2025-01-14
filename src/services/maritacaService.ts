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
  const prompt = `Você é um teólogo com 30 anos de experiência no estudo do Livro de Mórmon.
Analise ${book} ${chapter}:${verse} de forma aprofundada, em português, utilizando técnicas de exegese e hermenêutica. Baseie-se na tradução original em inglês, explorando o contexto histórico, cultural e doutrinário.
Essa explicação é para uma pessoa que acredita no Livro de Mórmon como escritura sagrada, portanto, a análise deve ser respeitosa e não conter ideias contrárias à sua autenticidade ou veracidade.
Não inclua o texto do versículo, apenas a explicação em Markdown, estruturada ponto a ponto, sem introduções ou títulos gerais.
Tradução original do versículo: "${text}"`

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
