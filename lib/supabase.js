// import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zuafoaugcognfgfrxben.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1YWZvYXVnY29nbmZnZnJ4YmVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MDEyODQsImV4cCI6MjA2MjI3NzI4NH0.a_eRkH4rb6evqp_XZYVQPENmlwRXk_OtLoB1XkopRtI'
const isBrowser = typeof window !== 'undefined'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: isBrowser ? window.localStorage : undefined,
    autoRefreshToken: true,
    persistSession: isBrowser,
    detectSessionInUrl: isBrowser,
  },
})