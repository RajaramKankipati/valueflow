import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const AppContext = createContext()

const initialState = {
  coreValues: [],
  valuableThings: [],
  happinessImmediate: [],
  happinessLongTerm: [],
  peaceOfMind: [],
  habits: [],
  tracking: {}
}

export function AppProvider({ children }) {
  const [state, setState] = useState(initialState)
  const [syncing, setSyncing] = useState(false)
  const auth = useAuth ? useAuth() : null

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      if (auth?.user) {
        // If logged in, fetch from server
        const serverData = await auth.fetchData()
        if (serverData) {
          setState(serverData)
          localStorage.setItem('valueflowState', JSON.stringify(serverData))
        }
      } else {
        // If not logged in, load from localStorage
        const saved = localStorage.getItem('valueflowState')
        if (saved) {
          try {
            setState(JSON.parse(saved))
          } catch (e) {
            console.error('Error loading state:', e)
          }
        }
      }
    }

    if (!auth?.loading) {
      loadData()
    }
  }, [auth?.user, auth?.loading])


  // Auto-sync to server when state changes
  useEffect(() => {
    const syncToServer = async () => {
      // Always save to localStorage as backup
      localStorage.setItem('valueflowState', JSON.stringify(state))

      // Sync to server if user is logged in
      if (auth?.user && !syncing) {
        setSyncing(true)
        try {
          console.log('🔄 Syncing data to MongoDB...', {
            values: state.coreValues.length,
            habits: state.habits.length
          })
          const result = await auth.syncData(state)
          console.log('✅ Data synced successfully')
        } catch (error) {
          console.error('❌ Sync failed:', error)
        } finally {
          setSyncing(false)
        }
      }
    }

    const timeoutId = setTimeout(syncToServer, 1000) // Debounce sync
    return () => clearTimeout(timeoutId)
  }, [state, auth?.user]) // Don't include syncing to avoid infinite loops


  const addCoreValue = (value) => {
    if (state.coreValues.length >= 5) {
      alert('You can only select up to 5 core values')
      return false
    }
    if (!state.coreValues.includes(value)) {
      setState(prev => ({ ...prev, coreValues: [...prev.coreValues, value] }))
      return true
    }
    return false
  }

  const removeCoreValue = (index) => {
    setState(prev => ({
      ...prev,
      coreValues: prev.coreValues.filter((_, i) => i !== index)
    }))
  }

  const addHabit = (habit) => {
    setState(prev => ({
      ...prev,
      habits: [...prev.habits, { ...habit, id: Date.now().toString() }]
    }))
  }

  const deleteHabit = (habitId) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.filter(h => h.id !== habitId),
      tracking: Object.fromEntries(
        Object.entries(prev.tracking).filter(([id]) => id !== habitId)
      )
    }))
  }

  const updateTracking = (habitId, date, status, reflection = null) => {
    setState(prev => ({
      ...prev,
      tracking: {
        ...prev.tracking,
        [habitId]: {
          ...(prev.tracking[habitId] || {}),
          [date]: {
            status,
            timestamp: new Date().toISOString(),
            reflection: reflection || prev.tracking[habitId]?.[date]?.reflection || null
          }
        }
      }
    }))
  }

  const getTracking = (habitId, date) => {
    return state.tracking[habitId]?.[date] || { status: null }
  }

  const calculateStreak = (habitId) => {
    const today = new Date().toISOString().split('T')[0]
    const todayTracking = getTracking(habitId, today)
    if (todayTracking.status !== 'completed') return 0

    let streak = 0
    let currentDate = new Date(today)
    let maxDays = 1000

    while (streak < maxDays) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const tracking = getTracking(habitId, dateStr)
      if (tracking.status === 'completed') {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }
    return streak
  }

  return (
    <AppContext.Provider value={{
      state,
      setState,
      addCoreValue,
      removeCoreValue,
      addHabit,
      deleteHabit,
      updateTracking,
      getTracking,
      calculateStreak
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
