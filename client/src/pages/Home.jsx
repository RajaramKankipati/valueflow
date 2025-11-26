import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  const [tutorialStep, setTutorialStep] = useState(0)

  const tutorial = [
    {
      title: "Meet Sarah",
      content: "Hi! I'm Sarah, and I'll show you how ValueFlow helped me build better habits.",
      avatar: "👩‍💼"
    },
    {
      title: "Identifying Values",
      content: "First, I identified my top 5 values: Family, Health, Creativity, Growth, and Peace.",
      avatar: "💎"
    },
    {
      title: "Creating Tiny Habits",
      content: "Then I created small habits like 'Call mom for 5 minutes after breakfast' based on my Family value.",
      avatar: "🌱"
    },
    {
      title: "Tracking Progress",
      content: "I track daily and weekly, building streaks. The app celebrates wins and helps me reflect when I miss.",
      avatar: "📊"
    }
  ]

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Welcome to ValueFlow
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Build meaningful habits aligned with your values using ACT principles
          </p>
          <Link to="/values" className="btn btn-primary text-lg">
            Get Started →
          </Link>
        </div>

        {/* Demo Tutorial */}
        <div className="card max-w-3xl mx-auto mb-12">
          <div className="text-center mb-6">
            <span className="text-6xl mb-4 block">{tutorial[tutorialStep].avatar}</span>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {tutorial[tutorialStep].title}
            </h2>
            <p className="text-gray-600">{tutorial[tutorialStep].content}</p>
          </div>
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setTutorialStep(Math.max(0, tutorialStep - 1))}
              disabled={tutorialStep === 0}
              className="btn btn-outline disabled:opacity-50"
            >
              ← Previous
            </button>
            <div className="flex space-x-2">
              {tutorial.map((_, i) => (
                <div key={i} className={`h-2 w-2 rounded-full ${i === tutorialStep ? 'bg-primary-500' : 'bg-gray-300'}`} />
              ))}
            </div>
            <button
              onClick={() => setTutorialStep(Math.min(tutorial.length - 1, tutorialStep + 1))}
              disabled={tutorialStep === tutorial.length - 1}
              className="btn btn-outline disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '🎯', title: 'Identify Values', desc: 'Discover your top 5 core values' },
            { icon: '🌱', title: 'Build Habits', desc: 'Create tiny, values-based habits' },
            { icon: '📈', title: 'Track Progress', desc: 'Daily & weekly tracking with streaks' },
          ].map((feature) => (
            <div key={feature.title} className="card text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
