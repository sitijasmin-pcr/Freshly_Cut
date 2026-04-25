import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wrgfvgawoqupbujhmtxd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyZ2Z2Z2F3b3F1cGJ1amhtdHhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMDE4NzAsImV4cCI6MjA5MjY3Nzg3MH0.AzsK6XN9TnINf5wwF9UTAtL1DTN_6-piWpkxI-O1CYs'
export const supabase = createClient(supabaseUrl, supabaseKey)
