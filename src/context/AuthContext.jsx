import { createContext, useContext, useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
} from 'firebase/auth'
import { auth } from '../lib/firebase'

const AuthContext = createContext()

const googleProvider = new GoogleAuthProvider()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)

  useEffect(() => {
    if (!auth) {
      setIsGuest(true)
      setLoading(false)
      return
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setIsGuest(!firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider)

  const loginWithEmail = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)

  const signupWithEmail = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password)

  const logout = () => signOut(auth)

  const continueAsGuest = () => {
    setIsGuest(true)
    setLoading(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isGuest,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        logout,
        continueAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuthContext must be used within AuthProvider')
  return context
}
