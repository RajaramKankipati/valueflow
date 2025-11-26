import { useState } from 'react'
import { useApp } from '../contexts/AppContext'
import { coreValuesList } from '../data/values'
import { Link } from 'react-router-dom'

export default function Values() {
  const { state, addCoreValue, removeCoreValue } = useApp()
  const [customValue, setCustomValue] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const handleAddCustomValue = (e) => {
    e.preventDefault()
    if (customValue.trim()) {
      const success = addCoreValue(customValue.trim())
      if (success) setCustomValue('')
    }
  }

  const filteredValues = coreValuesList.filter(v =>
    v.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Identify Your Core Values</h1>
          <p className="text-lg text-gray-600">
            Values are guiding principles - how you want to show up in life
          </p>
        </div>

        {/* What are Values? */}
        <div className="card mb-8 bg-white shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">What are Values?</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-primary-700 mb-3">
                Examples of a principle or moral guide for my conduct:
              </h3>
              <div className="grid grid-cols-2 gap-2 text-gray-700 mb-6">
                <ul className="list-disc list-inside space-y-1">
                  <li>Respect for self and others</li>
                  <li>Justice and fairness</li>
                  <li>Loyalty</li>
                  <li>Compassion</li>
                  <li>Kindness</li>
                </ul>
                <ul className="list-disc list-inside space-y-1">
                  <li>Honesty</li>
                  <li>Integrity</li>
                  <li>Faithfulness</li>
                  <li>Equality</li>
                  <li>Peace and goodwill</li>
                </ul>
              </div>
              <p className="text-gray-600 italic">
                "These values form a moral code to guide your behaviour, based on personal beliefs. They are personal, judgement-based and measured by the behaviours and actions we take."
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                Values vs. Valuable
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-2xl">😊</span>
                  <span>What is <strong>valuable</strong> to us brings quality of life and gives us happiness.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🕊️</span>
                  <span>What is <strong>morally correct</strong> gives us peace of mind.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Top 5 Goal */}
        <div className="card mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500">
          <h3 className="text-xl font-bold text-gray-800 mb-2">🎯 Goal: Select Your Top 5 Values</h3>
          <p className="text-gray-600 mb-4">
            Focus is essential. Choose the 5 values that matter most to you right now.
          </p>
          <div className="text-2xl font-bold text-primary-600">
            Selected: {state.coreValues.length} / 5
            {state.coreValues.length < 5 && (
              <span className="text-base font-normal text-gray-500 ml-2">
                ({5 - state.coreValues.length} more to go!)
              </span>
            )}
            {state.coreValues.length === 5 && (
              <span className="text-base font-normal text-green-600 ml-2">
                ✓ Perfect! Ready to create habits
              </span>
            )}
          </div>
        </div>

        {/* Selected Values */}
        {state.coreValues.length > 0 && (
          <div className="card mb-8">
            <h3 className="text-xl font-semibold mb-4">Your Top 5 Core Values</h3>
            <div className="flex flex-wrap gap-3">
              {state.coreValues.map((value, index) => (
                <div
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full flex items-center gap-2 shadow-md"
                >
                  <span className="font-medium">{value}</span>
                  <button
                    onClick={() => removeCoreValue(index)}
                    className="hover:bg-white/20 rounded-full p-1 transition"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Custom Value */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold mb-4">Add Your Own Value</h3>
          <form onSubmit={handleAddCustomValue} className="flex gap-3">
            <input
              type="text"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              placeholder="e.g., Compassion, Honesty, Courage"
              className="input flex-1"
              disabled={state.coreValues.length >= 5}
            />
            <button
              type="submit"
              disabled={state.coreValues.length >= 5 || !customValue.trim()}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Value
            </button>
          </form>
        </div>

        {/* Values Library */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Browse Values Library</h3>
          <p className="text-gray-600 mb-4">Click any value to add it to your list:</p>

          {/* Search */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search values..."
            className="input mb-4"
          />

          {/* Values Grid */}
          <div className="max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-wrap gap-2">
              {filteredValues.map((value) => (
                <button
                  key={value}
                  onClick={() => addCoreValue(value)}
                  disabled={state.coreValues.length >= 5 || state.coreValues.includes(value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${state.coreValues.includes(value)
                    ? 'bg-primary-200 text-primary-800 cursor-default'
                    : 'bg-white border-2 border-gray-200 hover:border-primary-400 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Next Step */}
        {state.coreValues.length > 0 && (
          <div className="text-center mt-8">
            <Link
              to="/habits"
              className={`btn ${state.coreValues.length >= 3 ? 'btn-primary' : 'btn-outline'}`}
            >
              {state.coreValues.length >= 3 ? '✓ Ready to' : 'Continue to'} Create Habits →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
