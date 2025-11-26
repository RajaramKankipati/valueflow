import { useState } from 'react'
import { useApp } from '../contexts/AppContext'
import { getHabitSuggestionsForValue } from '../data/habitSuggestions'
import { Link } from 'react-router-dom'

export default function Habits() {
  const { state, addHabit, deleteHabit, calculateStreak } = useApp()
  const [formData, setFormData] = useState({
    value: '',
    description: '',
    reward: '',
    time: ''
  })
  const [suggestions, setSuggestions] = useState(null)

  const handleValueChange = (value) => {
    setFormData({ ...formData, value })
    if (value) {
      setSuggestions(getHabitSuggestionsForValue(value))
    } else {
      setSuggestions(null)
    }
  }

  const applySuggestion = (suggestion) => {
    setFormData({
      ...formData,
      description: suggestion.habit,
      reward: suggestion.reward,
      time: suggestion.when
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    addHabit(formData)
    setFormData({ value: '', description: '', reward: '', time: '' })
    setSuggestions(null)
  }

  if (state.coreValues.length === 0) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Values Selected Yet</h2>
          <p className="text-gray-600 mb-6">Please select your values first to create habits</p>
          <Link to="/values" className="btn btn-primary">
            Go to Values →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Create Tiny Habits</h1>

        {/* Create Habit Form */}
        <div className="card mb-8">
          <h2 className="text-2xl font-semibold mb-6">Add a New Habit</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Choose a Value</label>
              <select
                value={formData.value}
                onChange={(e) => handleValueChange(e.target.value)}
                className="input"
                required
              >
                <option value="">Select a value...</option>
                {state.coreValues.map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>

            {/* Suggestions */}
            {suggestions && (
              <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-l-4 border-yellow-500">
                <h3 className="text-lg font-semibold mb-4">💡 Tiny Habit Suggestions for "{formData.value}"</h3>
                <p className="text-sm text-gray-600 mb-4">Click any suggestion to auto-fill the form:</p>
                <div className="space-y-3">
                  {suggestions.map((suggestion, i) => (
                    <div
                      key={i}
                      onClick={() => applySuggestion(suggestion)}
                      className="p-4 bg-white rounded-lg cursor-pointer hover:shadow-md transition border-2 border-transparent hover:border-primary-400"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{i + 1}</span>
                        <div className="flex-1">
                          <p className="font-semibold mb-1"><strong>Habit:</strong> {suggestion.habit}</p>
                          <p className="text-sm text-gray-600 mb-1"><strong>Reward:</strong> {suggestion.reward}</p>
                          <p className="text-sm text-gray-600"><strong>When:</strong> {suggestion.when}</p>
                        </div>
                        <span className="text-primary-500 text-sm">Click to use →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Tiny Habit</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Put everything aside and greet my partner"
                className="input"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Keep it small and specific!</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Intrinsic Reward</label>
              <input
                type="text"
                value={formData.reward}
                onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
                placeholder="e.g., Breathe and enjoy the connection"
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">When will you do this?</label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="e.g., When they arrive home"
                className="input"
              />
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Add Habit
            </button>
          </form>
        </div>

        {/* Habits List */}
        <div className="card">
          <h2 className="text-2xl font-semibold mb-6">Your Tiny Habits</h2>
          {state.habits.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No habits yet. Create your first one above!</p>
          ) : (
            <div className="space-y-4">
              {state.habits.map((habit) => {
                const streak = calculateStreak(habit.id)
                return (
                  <div key={habit.id} className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border-2 border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
                          Value: {habit.value}
                        </span>
                        <h3 className="text-lg font-semibold mt-1">{habit.description}</h3>
                      </div>
                      <div className={`px-4 py-2 rounded-lg text-center ${streak > 0 ? 'bg-gradient-to-r from-green-500 to-blue-500' : 'bg-gray-300'} text-white`}>
                        <div className="text-2xl font-bold">{streak}</div>
                        <div className="text-xs">{streak === 1 ? 'day' : 'days'}</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2"><strong>Reward:</strong> {habit.reward}</p>
                    {habit.time && <p className="text-sm text-gray-700 mb-4"><strong>When:</strong> {habit.time}</p>}
                    <button
                      onClick={() => {
                        if (confirm('Delete this habit?')) deleteHabit(habit.id)
                      }}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {state.habits.length > 0 && (
          <div className="text-center mt-8 space-x-4">
            <Link to="/daily" className="btn btn-primary">
              Start Daily Tracking →
            </Link>
            <Link to="/weekly" className="btn btn-outline">
              View Weekly Progress
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
