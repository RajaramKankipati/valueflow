import { useState } from 'react'
import { useApp } from '../contexts/AppContext'
import { Link } from 'react-router-dom'

export default function WeeklyTracker() {
  const { state, updateTracking, getTracking, calculateStreak } = useApp()
  const [weekOffset, setWeekOffset] = useState(0)

  const getWeekStart = (offset = 0) => {
    const today = new Date()
    today.setDate(today.getDate() + offset * 7)
    const day = today.getDay()
    const diff = today.getDate() - day
    const weekStart = new Date(today.setDate(diff))
    return weekStart
  }

  const weekStart = getWeekStart(weekOffset)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart)
    date.setDate(date.getDate() + i)
    return date
  })

  const toggleStatus = (habitId, dateStr) => {
    const current = getTracking(habitId, dateStr)
    const statuses = [null, 'completed', 'skipped']
    const currentIndex = statuses.indexOf(current.status)
    const nextStatus = statuses[(currentIndex + 1) % statuses.length]
    updateTracking(habitId, dateStr, nextStatus)
  }

  const calculateWeeklyStats = () => {
    let completed = 0
    let total = state.habits.length * 7
    weekDays.forEach(date => {
      const dateStr = date.toISOString().split('T')[0]
      state.habits.forEach(habit => {
        if (getTracking(habit.id, dateStr).status === 'completed') completed++
      })
    })
    return {
      completed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      activeStreaks: state.habits.filter(h => calculateStreak(h.id) > 0).length,
      bestStreak: Math.max(...state.habits.map(h => calculateStreak(h.id)), 0)
    }
  }

  if (state.habits.length === 0) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Habits to Track</h2>
          <Link to="/habits" className="btn btn-primary">Create Habits →</Link>
        </div>
      </div>
    )
  }

  const stats = calculateWeeklyStats()
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Weekly Habit Tracker</h1>

        {/* Week Navigation */}
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => setWeekOffset(weekOffset - 1)} className="btn btn-outline">
            ← Previous Week
          </button>
          <h2 className="text-xl font-semibold">
            {weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            {' - '}
            {weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </h2>
          <button onClick={() => setWeekOffset(weekOffset + 1)} className="btn btn-outline">
            Next Week →
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600">{stats.completionRate}%</div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600">{stats.activeStreaks}</div>
            <div className="text-sm text-gray-600">Active Streaks</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600">{stats.bestStreak}</div>
            <div className="text-sm text-gray-600">Best Streak</div>
          </div>
        </div>

        {/* Habits Grid */}
        <div className="space-y-6">
          {state.habits.map(habit => {
            const streak = calculateStreak(habit.id)
            const weekCompletion = weekDays.filter(date => {
              const dateStr = date.toISOString().split('T')[0]
              return getTracking(habit.id, dateStr).status === 'completed'
            }).length

            return (
              <div key={habit.id} className="card overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold">{habit.description}</h3>
                      <p className="text-sm opacity-90">Value: {habit.value}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{streak}</div>
                      <div className="text-sm">{streak === 1 ? 'day streak' : 'days streak'}</div>
                    </div>
                  </div>
                </div>

                {/* Week Days */}
                <div className="grid grid-cols-7 divide-x">
                  {weekDays.map((date, i) => {
                    const dateStr = date.toISOString().split('T')[0]
                    const today = new Date().toISOString().split('T')[0]
                    const isToday = dateStr === today
                    const tracking = getTracking(habit.id, dateStr)
                    const status = tracking.status
                    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

                    return (
                      <div
                        key={i}
                        className={`p-4 text-center cursor-pointer hover:bg-gray-50 transition ${
                          isToday ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => toggleStatus(habit.id, dateStr)}
                      >
                        <div className={`text-xs font-semibold mb-1 ${isToday ? 'text-primary-600' : 'text-gray-600'}`}>
                          {dayNames[date.getDay()]}
                        </div>
                        <div className="text-xs text-gray-500 mb-3">{date.getDate()}</div>
                        <div
                          className={`w-10 h-10 rounded-full mx-auto border-3 flex items-center justify-center text-xl transition-all ${
                            status === 'completed'
                              ? 'bg-green-500 border-green-600 text-white'
                              : status === 'skipped'
                              ? 'bg-orange-500 border-orange-600 text-white'
                              : 'bg-white border-2 border-gray-300'
                          }`}
                        >
                          {status === 'completed' ? '✓' : status === 'skipped' ? '○' : ''}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Progress Bar */}
                <div className="p-4 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-700">Week Progress:</span>
                    <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500 flex items-center justify-end pr-2"
                        style={{ width: `${(weekCompletion / 7) * 100}%` }}
                      >
                        {weekCompletion > 0 && (
                          <span className="text-xs font-semibold text-white">
                            {Math.round((weekCompletion / 7) * 100)}%
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      {weekCompletion}/7
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-8">
          <Link to="/daily" className="btn btn-primary">
            ← Back to Daily Tracker
          </Link>
        </div>
      </div>
    </div>
  )
}
