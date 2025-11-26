import { useState } from 'react'
import { useApp } from '../contexts/AppContext'
import { Link } from 'react-router-dom'

export default function DailyTracker() {
  const { state, updateTracking, getTracking } = useApp()
  const today = new Date().toISOString().split('T')[0]
  const [reflections, setReflections] = useState({})
  const [showReflection, setShowReflection] = useState({})

  const toggleStatus = (habitId) => {
    const current = getTracking(habitId, today)
    const statuses = [null, 'completed', 'skipped']
    const currentIndex = statuses.indexOf(current.status)
    const nextStatus = statuses[(currentIndex + 1) % statuses.length]

    if (nextStatus === null) {
      updateTracking(habitId, today, null)
      setShowReflection(prev => ({ ...prev, [habitId]: false }))
    } else if (nextStatus === 'skipped') {
      updateTracking(habitId, today, nextStatus)
      setShowReflection(prev => ({ ...prev, [habitId]: false }))
    } else {
      updateTracking(habitId, today, nextStatus)
      setShowReflection(prev => ({ ...prev, [habitId]: false }))
    }
  }

  const parseReflection = (jsonString) => {
    if (!jsonString) return { present: '', values: '', acceptance: '', defusion: '', perspective: '' }
    try {
      const parsed = JSON.parse(jsonString)
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed
      }
      return { present: jsonString, values: '', acceptance: '', defusion: '', perspective: '' }
    } catch {
      return { present: jsonString, values: '', acceptance: '', defusion: '', perspective: '' }
    }
  }

  const handleReflectionChange = (habitId, field, value) => {
    setReflections(prev => {
      const current = prev[habitId] || parseReflection(getTracking(habitId, today).reflection)
      return {
        ...prev,
        [habitId]: { ...current, [field]: value }
      }
    })
  }

  const saveReflection = (habitId) => {
    const current = getTracking(habitId, today)
    const reflectionData = reflections[habitId] || parseReflection(current.reflection)
    updateTracking(habitId, today, current.status, JSON.stringify(reflectionData))
    setShowReflection(prev => ({ ...prev, [habitId]: false }))
  }

  if (state.habits.length === 0) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Habits to Track</h2>
          <p className="text-gray-600 mb-6">Create some habits first!</p>
          <Link to="/habits" className="btn btn-primary">
            Create Habits →
          </Link>
        </div>
      </div>
    )
  }

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Daily Habit Tracker</h1>
          <p className="text-xl text-gray-600">{todayDate}</p>
        </div>

        <div className="space-y-6">
          {state.habits.map((habit) => {
            const tracking = getTracking(habit.id, today)
            const status = tracking.status
            const isReflecting = showReflection[habit.id] || (status === 'skipped' && tracking.reflection)

            return (
              <div
                key={habit.id}
                className={`card transition-all ${
                  status === 'completed'
                    ? 'border-4 border-green-500 bg-green-50'
                    : status === 'skipped'
                    ? 'border-4 border-orange-500 bg-orange-50'
                    : 'border-2 border-gray-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <div
                    className="flex-shrink-0 mt-1 cursor-pointer"
                    onClick={() => toggleStatus(habit.id)}
                  >
                    <div
                      className={`w-12 h-12 rounded-full border-4 flex items-center justify-center text-2xl transition-all ${
                        status === 'completed'
                          ? 'bg-green-500 border-green-600 text-white'
                          : status === 'skipped'
                          ? 'bg-orange-500 border-orange-600 text-white'
                          : 'bg-white border-gray-300 hover:border-primary-400'
                      }`}
                    >
                      {status === 'completed' ? '✓' : status === 'skipped' ? '○' : ''}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
                      {habit.value}
                    </span>
                    <h3 className="text-xl font-semibold mt-1 mb-2">{habit.description}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Reward:</strong> {habit.reward}
                    </p>
                    {habit.time && (
                      <p className="text-sm text-gray-600">
                        <strong>When:</strong> {habit.time}
                      </p>
                    )}

                    {/* Status Help */}
                    <div className="mt-4 text-xs text-gray-500">
                      Click checkbox to cycle: Empty → Completed (✓) → Skipped (○) → Empty
                    </div>

                    {/* Positive Reinforcement */}
                    {status === 'completed' && (
                      <div className="mt-4 p-3 bg-green-100 border-l-4 border-green-500 rounded">
                        <p className="text-sm font-medium text-green-800">
                          🎉 Great job! You\'re living your values!
                        </p>
                      </div>
                    )}

                    {/* ACT Reflection */}
                    {status === 'skipped' && (
                      <div className="mt-4 p-4 bg-orange-100 border-l-4 border-orange-500 rounded">
                        <p className="text-sm font-medium text-orange-800 mb-3">
                          It's okay - missing a habit doesn't define you
                        </p>

                        {isReflecting ? (
                          <div className="space-y-4">
                            {/* Header Message */}
                            <p className="text-sm text-orange-900 italic">
                              There will be days you will not be doing tiny habit - <strong>that doesn't mean you are a terrible person</strong>
                            </p>

                            {/* 1. Be present */}
                            <div>
                              <label className="block text-xs font-bold text-orange-900 mb-1">
                                Be present - I am off track
                              </label>
                              <textarea
                                className="w-full px-3 py-2 text-sm border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
                                rows="2"
                                placeholder="Notice what's happening..."
                                value={(reflections[habit.id] || parseReflection(tracking.reflection)).present}
                                onChange={(e) => handleReflectionChange(habit.id, 'present', e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>

                            {/* 2. Values */}
                            <div>
                              <label className="block text-xs font-bold text-orange-900 mb-1">
                                Values - Tune into the value - how do I wanna be
                              </label>
                              <textarea
                                className="w-full px-3 py-2 text-sm border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
                                rows="2"
                                placeholder="Reconnect with your value..."
                                value={(reflections[habit.id] || parseReflection(tracking.reflection)).values}
                                onChange={(e) => handleReflectionChange(habit.id, 'values', e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>

                            {/* 3. Acceptance */}
                            <div>
                              <label className="block text-xs font-bold text-orange-900 mb-1">
                                Acceptance - This is what it feels like
                              </label>
                              <textarea
                                className="w-full px-3 py-2 text-sm border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
                                rows="2"
                                placeholder="Make room for the feeling..."
                                value={(reflections[habit.id] || parseReflection(tracking.reflection)).acceptance}
                                onChange={(e) => handleReflectionChange(habit.id, 'acceptance', e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>

                            {/* 4. De-fusion */}
                            <div>
                              <label className="block text-xs font-bold text-orange-900 mb-1">
                                De-fusion - Thanks Mind ! What you are trying to tell me ?
                              </label>
                              <textarea
                                className="w-full px-3 py-2 text-sm border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
                                rows="2"
                                placeholder="Observe your thoughts..."
                                value={(reflections[habit.id] || parseReflection(tracking.reflection)).defusion}
                                onChange={(e) => handleReflectionChange(habit.id, 'defusion', e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>

                            {/* 5. Perspective */}
                            <div>
                              <label className="block text-xs font-bold text-orange-900 mb-1">
                                Perspective - Have self-compassion and add perspective to the story
                              </label>
                              <textarea
                                className="w-full px-3 py-2 text-sm border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
                                rows="2"
                                placeholder="Be kind to yourself..."
                                value={(reflections[habit.id] || parseReflection(tracking.reflection)).perspective}
                                onChange={(e) => handleReflectionChange(habit.id, 'perspective', e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                saveReflection(habit.id)
                              }}
                              className="text-xs bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-lg transition-colors w-full sm:w-auto"
                            >
                              Save Reflection
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowReflection(prev => ({ ...prev, [habit.id]: true }))
                            }}
                            className="text-xs bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Reflect on this
                          </button>
                        )}

                        {tracking.reflection && !showReflection[habit.id] && (
                          <div className="mt-3 p-3 bg-white bg-opacity-50 rounded text-xs text-orange-900 space-y-2">
                            {(() => {
                              const r = parseReflection(tracking.reflection)
                              return (
                                <>
                                  {r.present && <p><strong>Be present:</strong> {r.present}</p>}
                                  {r.values && <p><strong>Values:</strong> {r.values}</p>}
                                  {r.acceptance && <p><strong>Acceptance:</strong> {r.acceptance}</p>}
                                  {r.defusion && <p><strong>De-fusion:</strong> {r.defusion}</p>}
                                  {r.perspective && <p><strong>Perspective:</strong> {r.perspective}</p>}
                                </>
                              )
                            })()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary */}
        <div className="card mt-8 bg-gradient-to-r from-blue-50 to-green-50">
          <h3 className="text-lg font-semibold mb-4">Today\'s Summary</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600">
                {state.habits.filter(h => getTracking(h.id, today).status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">
                {state.habits.filter(h => getTracking(h.id, today).status === 'skipped').length}
              </div>
              <div className="text-sm text-gray-600">Skipped</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-600">
                {state.habits.filter(h => !getTracking(h.id, today).status).length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link to="/weekly" className="btn btn-primary">
            View Weekly Progress →
          </Link>
        </div>
      </div>
    </div>
  )
}
