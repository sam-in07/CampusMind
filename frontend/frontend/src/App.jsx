import { useEffect, useState } from 'react'

function App() {
  const [status, setStatus] = useState('Connecting...')

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/health`)
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(err => setStatus('Error connecting to backend'))
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="p-8 bg-white shadow-xl rounded-lg">
        <h1 className="text-2xl font-bold mb-4">CampusMind Status</h1>
        <p className="text-lg">Backend Status: <span className="font-mono text-blue-600">{status}</span></p>
      </div>
    </div>
  )
}

export default App
