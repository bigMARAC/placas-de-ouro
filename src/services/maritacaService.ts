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

export type StudyDepth = 'basic' | 'intermediate' | 'advanced';
export type StudyStyle = 'historical' | 'spiritual' | 'literary';

interface StudyOptions {
  depth: StudyDepth;
  style: StudyStyle;
}

const getDepthDescription = (depth: StudyDepth): string => {
  switch (depth) {
    case 'basic':
      return 'de forma clara e concisa, focando nos pontos principais';
    case 'intermediate':
      return 'de forma detalhada, explorando os principais aspectos e suas conexões';
    case 'advanced':
      return 'de forma aprofundada e acadêmica, explorando detalhes, nuances e conexões complexas';
  }
}

const getStylePrompt = (style: StudyStyle): string => {
  switch (style) {
    case 'historical':
      return 'Foque principalmente no contexto histórico, cultural e geográfico da passagem, incluindo informações sobre costumes, práticas e eventos relacionados da época.';
    case 'spiritual':
      return 'Foque principalmente na aplicação espiritual e prática do versículo, incluindo princípios doutrinários, insights pessoais e como aplicar esses ensinamentos em nossa vida hoje.';
    case 'literary':
      return 'Foque principalmente nos aspectos literários do texto, incluindo análise de estrutura, estilo, linguagem, simbolismo e conexões com outros textos sagrados.';
  }
}

export const generateStudy = async (
  book: string, 
  chapter: string, 
  verse: string, 
  text: string,
  options: StudyOptions
): Promise<string> => {
  const depthDesc = getDepthDescription(options.depth)
  const stylePrompt = getStylePrompt(options.style)

  const prompt = `Você é um teólogo com 30 anos de experiência no estudo do Livro de Mórmon.
Analise ${book} ${chapter}:${verse} ${depthDesc}, em português, utilizando técnicas de exegese e hermenêutica. Baseie-se na tradução original em inglês.

${stylePrompt}

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
