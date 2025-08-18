// Script to create a test user in Supabase
// This is for development/testing purposes only

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ylmcwkabyqvgdrbnunri.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsbWN3a2FieXF2Z2RyYm51bnJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzE5NzQsImV4cCI6MjA1MDU0Nzk3NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createTestUser() {
    try {
        console.log('Creating test user...')
        
        // Create a test user
        const { data, error } = await supabase.auth.signUp({
            email: 'test@tiamat.com',
            password: 'test123456'
        })
        
        if (error) {
            console.error('Error creating user:', error)
            return
        }
        
        console.log('User created successfully:', data)
        console.log('Email: test@tiamat.com')
        console.log('Password: test123456')
        console.log('Please check your email to confirm the account')
        
    } catch (error) {
        console.error('Unexpected error:', error)
    }
}

// Run the function
createTestUser()
