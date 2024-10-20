import React, { createContext, useState, useEffect } from 'react'

// Create a context with default value
export const AuthContext = createContext({})

export const AuthProvider = ({ children }: { children: any }) => {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    // This function simulates fetching the user data and updating the context
    const login = ({ userData }: any) => {
        setUser(userData)
    }

    const logout = () => {
        setUser(null)
    }

    const checkAuthStatus = () => {
        // You can replace this with real logic to check authentication
        const savedUser = null // Example, fetch from local storage or API
        if (savedUser) {
            setUser(savedUser)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        checkAuthStatus()
    }, [])

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
