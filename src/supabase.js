import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jbcqrxcpywwgldjodgtr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiY3FyeGNweXd3Z2xkam9kZ3RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MzUzNTYsImV4cCI6MjA2NjQxMTM1Nn0.G6OufQjmyi9nmEXun2s3smfjMUs2xLRde2pWipZ7SsA'
export const supabase = createClient(supabaseUrl, supabaseKey)
