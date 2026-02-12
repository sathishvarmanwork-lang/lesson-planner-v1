import { useState } from 'react'
import { generateLessonPlan } from './api/claude'
import './App.css'

function App() {
  // WHY: useState hooks manage form inputs and API response
  // WHAT: Tracks objective, grade, subject, result, and loading state
  const [objective, setObjective] = useState('')
  const [grade, setGrade] = useState('9')
  const [subject, setSubject] = useState('Physics')
  const [lessonPlan, setLessonPlan] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // WHY: Async handler for API call with error handling
  // WHAT: Calls Claude API, updates state with result or error
  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    setLessonPlan('')

    try {
      const result = await generateLessonPlan(objective, grade, subject)
      setLessonPlan(result)
    } catch (err) {
      setError('Failed to generate lesson plan. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>AI Lesson Planner</h1>
      <p>Generate curriculum-aligned lesson plans for Kuwait STEM educators</p>

      <div className="form">
        <div className="form-group">
          <label>Learning Objective</label>
          <textarea
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            placeholder="e.g., Students will understand Newton's First Law of Motion"
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Grade Level</label>
            <select value={grade} onChange={(e) => setGrade(e.target.value)}>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Grade {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Subject</label>
            <select value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option>Physics</option>
              <option>Chemistry</option>
              <option>Biology</option>
              <option>Mathematics</option>
            </select>
          </div>
        </div>

        <button onClick={handleGenerate} disabled={loading || !objective}>
          {loading ? 'Generating...' : 'Generate Lesson Plan'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {lessonPlan && (
        <div className="result">
          <h2>Generated Lesson Plan</h2>
          <div className="lesson-content">{lessonPlan}</div>
        </div>
      )}
    </div>
  )
}

export default App
