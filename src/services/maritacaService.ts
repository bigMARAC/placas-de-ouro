import axios from 'axios'
import { updateLastAccess } from './supabaseService'

const API_URL = '/api/maritaca'
const API_KEY = import.meta.env.VITE_MARITACA_API_KEY

interface MaritacaResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

interface MaritacaRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant'
    content: string
  }>
  model: string
}

export async function generateMaritacaResponse(prompt: string, email?: string): Promise<string> {
  const request: MaritacaRequest = {
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ],
    model: 'sabiazinho-3',
  }

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
    )

    if (!response.data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from Maritaca API')
    }

    // Update last access in Supabase after successful study generation
    if (email) {
      try {
        await updateLastAccess(email)
      } catch (error) {
        console.error('Failed to update last access:', error)
      }
    }

    return response.data.choices[0].message.content
  } catch (error) {
    console.error('Error calling Maritaca API:', error)
    throw error
  }
}
