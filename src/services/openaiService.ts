import axios from 'axios'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: {
    text: {
      value: string
    }
  }[]
}

interface Thread {
  id: string
  data: Message[]
}

export async function createThread(): Promise<string> {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/threads',
      {},
      {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      }
    )
    return response.data.id
  } catch (error) {
    console.error('Error creating thread:', error)
    throw error
  }
}

export async function addMessageToThread(threadId: string, content: string): Promise<void> {
  try {
    await axios.post(
      `https://api.openai.com/v1/threads/${threadId}/messages`,
      {
        role: 'user',
        content: content
      },
      {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      }
    )
  } catch (error) {
    console.error('Error adding message to thread:', error)
    throw error
  }
}

export async function runAssistant(threadId: string): Promise<string> {
  try {
    const response = await axios.post(
      `https://api.openai.com/v1/threads/${threadId}/runs`,
      {
        assistant_id: import.meta.env.VITE_OPENAI_ASSISTANT_ID
      },
      {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      }
    )
    return response.data.id
  } catch (error) {
    console.error('Error running assistant:', error)
    throw error
  }
}

export async function checkRunStatus(threadId: string, runId: string): Promise<string> {
  try {
    const response = await axios.get(
      `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
      {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      }
    )
    return response.data.status
  } catch (error) {
    console.error('Error checking run status:', error)
    throw error
  }
}

export async function getMessages(threadId: string): Promise<Message[]> {
  try {
    const response = await axios.get(
      `https://api.openai.com/v1/threads/${threadId}/messages`,
      {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      }
    )
    return response.data.data
  } catch (error) {
    console.error('Error getting messages:', error)
    throw error
  }
}

export async function generateStudyWithAssistant(prompt: string, email?: string): Promise<string> {
  try {
    // Create a new thread
    const threadId = await createThread()

    // Add the user's message to the thread
    await addMessageToThread(threadId, prompt)

    // Run the assistant
    const runId = await runAssistant(threadId)

    // Poll for completion
    let status = await checkRunStatus(threadId, runId)
    while (status !== 'completed' && status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 1000))
      status = await checkRunStatus(threadId, runId)
    }

    if (status === 'failed') {
      throw new Error('Assistant run failed')
    }

    // Get the messages
    const messages = await getMessages(threadId)
    
    const assistantMessage = messages.find(m => m.role === 'assistant')

    if (!assistantMessage) {
      throw new Error('No assistant response found')
    }

    // Update last access if email is provided
    if (email) {
      try {
        const { updateLastAccess } = await import('./supabaseService')
        await updateLastAccess(email)
      } catch (error) {
        console.error('Failed to update last access:', error)
      }
    }
    return assistantMessage.content[0].text.value
  } catch (error) {
    console.error('Error generating study:', error)
    throw error
  }
}
