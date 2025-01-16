import { generateMaritacaResponse } from './maritacaService'
import { generateStudyWithAssistant } from './openaiService'

export type AIProvider = 'maritaca' | 'openai'

const currentProvider: AIProvider = import.meta.env.VITE_AI_PROVIDER as AIProvider || 'maritaca'

export interface StudyRequest {
  book: string
  chapter: string
  verses: string
  studyType: StudyStyle
  email?: string
  depth: StudyDepth
}

export type StudyDepth = 'basic' | 'intermediate' | 'advanced';
export type StudyStyle = 'historical' | 'spiritual' | 'literary';

export async function generateStudy(request: StudyRequest): Promise<string> {
  
  try {
    if (currentProvider === 'openai') {
      const prompt = generateOpenAiPrompt(request)
      return await generateStudyWithAssistant(prompt, request.email)
    } else {
      const prompt = generateMaritacaPrompt(request)
      return await generateMaritacaResponse(prompt, request.email)
    }
  } catch (error) {
    console.error(`Error generating study with ${currentProvider}:`, error)
    throw error
  }
}

function generateOpenAiPrompt(request: StudyRequest): string {
  const { book, chapter, verses, studyType, depth } = request
  const reference = `${book} ${chapter}:${verses}`
  const style = getStylePrompt(studyType as StudyStyle)
  const depthDesc = getDepthDescription(depth)

  return `Análise ${reference} ${depthDesc}, em português, utilizando técnicas de exegese e hermenêutica. ${style} 
  Não inclua o texto do versículo, apenas a explicação em Markdown, estruturada ponto a ponto, sem introduções ou títulos gerais.`

}

function generateMaritacaPrompt(request: StudyRequest): string {
  const { book, chapter, verses, studyType, depth } = request
  const reference = `${book} ${chapter}:${verses}`
  const style = getStylePrompt(studyType as StudyStyle)
  const depthDesc = getDepthDescription(depth)

  return `Você é um teólogo com 30 anos de experiência no estudo do Livro de Mórmon.
  Analise ${reference} ${depthDesc}, em português, utilizando técnicas de exegese e hermenêutica. Baseie-se na tradução original em inglês.

  ${style}

  Essa explicação é para uma pessoa que acredita no Livro de Mórmon como escritura sagrada, portanto, a análise deve ser respeitosa e não conter ideias contrárias à sua autenticidade ou veracidade.
  Não inclua o texto do versículo, apenas a explicação em Markdown, estruturada ponto a ponto, sem introduções ou títulos gerais.`
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