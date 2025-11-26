import { useState } from 'react'

const actPrinciples = [
  {
    id: 'present',
    title: 'Being Present',
    icon: '🧘',
    description: 'Notice when you\'re off track',
    content: 'Mindfulness helps you recognize when you\'ve drifted from your values. Take a moment to pause and notice what\'s happening right now.'
  },
  {
    id: 'values',
    title: 'Values',
    icon: '💎',
    description: 'How do you want to be?',
    content: 'Your values are your chosen life directions. They guide you toward the person you want to become and the life you want to live.'
  },
  {
    id: 'acceptance',
    title: 'Acceptance',
    icon: '🤲',
    description: 'This is what it feels like',
    content: 'Making room for difficult thoughts and feelings instead of fighting them. Acceptance doesn\'t mean liking - it means allowing.'
  },
  {
    id: 'defusion',
    title: 'Defusion',
    icon: '💭',
    description: 'Thanks mind! What are you trying to tell me?',
    content: 'Creating space from unhelpful thoughts. Notice your thoughts without getting caught up in them or believing them literally.'
  },
  {
    id: 'self',
    title: 'Self-as-Context',
    icon: '👤',
    description: 'Practice self-compassion',
    content: 'You are not your thoughts or feelings. You are the observer, the space in which all experiences occur. Treat yourself with kindness.'
  },
  {
    id: 'action',
    title: 'Committed Action',
    icon: '🎯',
    description: 'What will you do next?',
    content: 'Taking effective action guided by your values, even when it\'s difficult. Small steps toward the life you want to live.'
  }
]

export default function Learn() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Learn ACT Principles</h1>
          <p className="text-lg text-gray-600">
            Acceptance and Commitment Therapy: Six core principles for psychological flexibility
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {actPrinciples.map((principle, index) => (
            <button
              key={principle.id}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === index
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-400'
              }`}
            >
              <span className="mr-2">{principle.icon}</span>
              {principle.title}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="card bg-gradient-to-br from-blue-50 to-green-50">
          <div className="text-center mb-6">
            <span className="text-6xl mb-4 block">{actPrinciples[activeTab].icon}</span>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {actPrinciples[activeTab].title}
            </h2>
            <p className="text-lg text-primary-600 font-medium">
              {actPrinciples[activeTab].description}
            </p>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed">
            {actPrinciples[activeTab].content}
          </p>
        </div>

        {/* How It Works */}
        <div className="card mt-8">
          <h3 className="text-2xl font-bold mb-4">How ValueFlow Uses ACT</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="text-2xl">✓</div>
              <div>
                <h4 className="font-semibold mb-1">When You Complete a Habit</h4>
                <p className="text-gray-600">You receive positive reinforcement celebrating your values-aligned action</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl">○</div>
              <div>
                <h4 className="font-semibold mb-1">When You Skip a Habit</h4>
                <p className="text-gray-600">You\'re guided through ACT reflection: What got in the way? How do you want to show up?</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl">💎</div>
              <div>
                <h4 className="font-semibold mb-1">Values-Based Living</h4>
                <p className="text-gray-600">Every habit is connected to your core values, making behavior change meaningful</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="card mt-8 bg-primary-50 border-l-4 border-primary-500">
          <p className="text-lg italic text-gray-700">
            "We have to live WITH truths but we choose to live BY our values"
          </p>
          <p className="text-sm text-gray-600 mt-2">- Chimp Management</p>
        </div>
      </div>
    </div>
  )
}
