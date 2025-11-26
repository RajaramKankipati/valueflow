import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo')
        if (userInfo) {
            setUser(JSON.parse(userInfo))
        }
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Login failed')
            }

            localStorage.setItem('userInfo', JSON.stringify(data))
            setUser(data)
            return data
        } catch (error) {
            throw error
        }
    }

    const register = async (name, email, password) => {
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed')
            }

            localStorage.setItem('userInfo', JSON.stringify(data))
            setUser(data)
            return data
        } catch (error) {
            throw error
        }
    }

    const logout = () => {
        localStorage.removeItem('userInfo')
        setUser(null)
    }

    const syncData = async (appData) => {
        if (!user) {
            console.log('⚠️ No user logged in, skipping sync')
            return
        }

        try {
            console.log('📤 Sending data to server:', {
                endpoint: '/api/users/sync',
                dataSize: JSON.stringify(appData).length,
                values: appData.coreValues?.length || 0,
                habits: appData.habits?.length || 0
            })

            const response = await fetch('/api/users/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ data: appData })
            })

            if (!response.ok) {
                const errorData = await response.json()
                console.error('❌ Sync failed:', errorData)
                throw new Error(errorData.message || 'Sync failed')
            }

            const result = await response.json()
            console.log('📥 Server response:', result)
            return result
        } catch (error) {
            console.error('❌ Sync error:', error)
            throw error
        }
    }

    const fetchData = async () => {
        if (!user) return null

        try {
            const response = await fetch('/api/users/data', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })

            if (!response.ok) {
                throw new Error('Fetch failed')
            }

            return await response.json()
        } catch (error) {
            console.error('Fetch error:', error)
            return null
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            syncData,
            fetchData
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
