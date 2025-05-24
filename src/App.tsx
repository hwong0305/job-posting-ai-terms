import { Button } from '@/components/ui/button/Button';
import { Textarea } from '@/components/ui/textarea/TextArea';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

import './App.css';

function App() {
  const [state, setState] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const summarizeJobDescription = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/chat/description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          state,
        }),
      });

      const json = await response.json();
      setResult(json.message);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="rounded-lg shadow-sm p-8 max-w-md w-full">
          <h1 className="text-xl font-bold mb-4">Job Description Analysis</h1>

          <div className="mb-6">
            <Textarea
              placeholder="Paste job description text here..."
              value={state}
              onChange={e => setState(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 mt-6">
            <Button onClick={() => summarizeJobDescription()} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : 'Analyze Text'}
            </Button>
          </div>

          <div className="my-6 text-left max-h-[400px] overflow-y-auto">
            {result && (
              <pre className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: result }} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
