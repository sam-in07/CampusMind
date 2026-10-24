import { useState } from 'react'

function App() {
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setChatLog((prev) => [...prev, userMsg]);
    setLoading(true);
    setInput('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      
      const aiMsg = { role: 'ai', content: data.response || "Error: No response" };
      setChatLog((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setChatLog((prev) => [...prev, { role: 'system', content: 'Error connecting to backend.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">CampusMind AI</h1>
        
        <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
          {chatLog.map((msg, i) => (
            <div key={i} className={`mb-2 ${msg.role === 'user' ? 'text-blue-300' : 'text-green-300'}`}>
              <span className="font-bold">[{msg.role.toUpperCase()}]:</span> {msg.content}
            </div>
          ))}
          {loading && <p className="text-gray-500 animate-pulse">Thinking...</p>}
        </div>

        <div className="flex gap-2">
          <input 
            className="flex-1 p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your studies..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button 
            onClick={sendMessage}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
