import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface UserAccess {
  email: string
  agent: string
  last_access: string
}

function getBrazilianDateTime() {
  // Create a date in Brazilian timezone
  // const date = new Date()
  // const brazilianDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
  // console.log(brazilianDate.toISOString().replace('T', ' ').replace('Z', ''))
  
  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
  console.log(localISOTime)
  console.log(localISOTime.replace('T', ' ').replace('Z', ''))
  return localISOTime.replace('T', ' ').replace('Z', '')
  
  // Format in PostgreSQL timestamp format
  // return brazilianDate.toISOString().replace('T', ' ').replace('Z', '')
}

export async function upsertUserAccess(email: string) {
  const agent = navigator.userAgent
  const last_access = getBrazilianDateTime()

  const { error } = await supabase
    .from('users')
    .upsert(
      { 
        email, 
        agent, 
        last_access,
        created_at: last_access
      },
      {
        onConflict: 'email'
      }
    )

  if (error) {
    console.error('Error updating user access:', error)
    throw error
  }
}

export async function updateLastAccess(email: string) {
  const { error } = await supabase
    .from('users')
    .update({ last_access: getBrazilianDateTime() })
    .eq('email', email)

  if (error) {
    console.error('Error updating last access:', error)
    throw error
  }
}
