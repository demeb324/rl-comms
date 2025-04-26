import { createClient } from '@supabase/supabase-js'

const url = 'https://dbodrclpiesrafhiogua.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRib2RyY2xwaWVzcmFmaGlvZ3VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMjk3MTUsImV4cCI6MjA2MDYwNTcxNX0.MDNwfXq2vrZz-bYn05hHhOPnlZ5hZXccqOrjD8PGo_k'

export const supabase = createClient(url, key)