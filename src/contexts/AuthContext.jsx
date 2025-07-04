import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      }
      setLoading(false)
    }).catch((error) => {
      console.error('Error getting session:', error)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        // Create profile if it doesn't exist
        if (error.code === 'PGRST116') {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                id: userId,
                email: user?.email,
                full_name: user?.user_metadata?.full_name || '',
                credits_balance: 10.00, // Free trial credits
                subscription_plan: 'free',
                subscription_status: 'active'
              }
            ])
            .select()
            .single()

          if (createError) throw createError
          setProfile(newProfile)
        } else {
          throw error
        }
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      // Don't show error toast for profile issues, just log them
    }
  }

  const signUp = async (email, password, fullName) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })

      if (error) throw error

      toast.success('Conta criada com sucesso! Verifique seu email.')
      return { data, error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      let errorMessage = 'Erro ao criar conta'
      
      if (error.message.includes('fetch')) {
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.'
      } else if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Credenciais inválidas'
      } else if (error.message.includes('Email already registered')) {
        errorMessage = 'Este email já está cadastrado'
      }
      
      toast.error(errorMessage)
      return { data: null, error }
    }
  }

  const signIn = async (email, password) => {
    try {
      // Check if we have valid Supabase configuration
      if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://your-project.supabase.co') {
        throw new Error('Supabase não configurado. Configure as variáveis de ambiente.')
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      toast.success('Login realizado com sucesso!')
      return { data, error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      let errorMessage = 'Erro ao fazer login'
      
      if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        errorMessage = 'Erro de conexão com o servidor. Verifique se o Supabase está configurado corretamente.'
      } else if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos'
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Email não confirmado. Verifique sua caixa de entrada.'
      } else if (error.message.includes('Supabase não configurado')) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
      setProfile(null)
      toast.success('Logout realizado com sucesso!')
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Erro ao fazer logout')
    }
  }

  const updateCredits = async (amount, type = 'consumption', description = '') => {
    if (!user) return

    try {
      const { data, error } = await supabase.rpc('update_user_credits', {
        user_uuid: user.id,
        amount: amount,
        transaction_type: type,
        description: description
      })

      if (error) throw error

      // Refresh profile
      await fetchProfile(user.id)
      
      return { success: true }
    } catch (error) {
      console.error('Error updating credits:', error)
      return { success: false, error }
    }
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateCredits,
    refreshProfile: () => fetchProfile(user?.id)
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}