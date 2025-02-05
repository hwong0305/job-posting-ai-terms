import { Button } from '@/components/ui/button/Button';
import { Input } from '@/components/ui/input/Input';
import { Textarea } from '@/components/ui/textarea/TextArea';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

import sanitizeHtml from 'sanitize-html';

import './App.css';

function App() {
  const [state, setState] = useState('');
  const [url, setUrl] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const summarizeJobDescription = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:13372/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-r1-distill-qwen-7b',
          messages: [
            {
              role: 'user',
              content:
                'You are a job description analyst. You will analyze the contents of the job description and provide a list of terms that should be in included in the resume for a successful job application',
            },
            {
              role: 'user',
              content: state,
            },
          ],
        }),
      });

      const json = await response.json();
      setResult(json.choices[0].message.content.split('</think>')[1]);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const summarizeLink = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:13372/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-r1-distill-qwen-7b',
          messages: [
            {
              role: 'user',
              content:
                'You are a job description analyst. You will analyze the contents of the job description and provide a list of terms that should be in included in the resume for a successful job application',
            },
            {
              role: 'user',
              content: url,
            },
          ],
        }),
      });

      const json = await response.json();
      setResult(json.choices[0].message.content.split('</think>')[1]);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const sanitizeLink = (content: string) => sanitizeHtml(content);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="rounded-lg shadow-sm p-8 max-w-md w-full">
          <h1 className="text-xl font-bold mb-4">Text Analyser</h1>

          <div className="mb-6">
            <Input
              type="email"
              placeholder="Job Description URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <Textarea placeholder="Type your message here." value={state} onChange={(e) => setState(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 gap-4 mt-6">
            <Button variant="secondary" onClick={() => summarizeLink()} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : 'Analyze Link'}
            </Button>
            <Button onClick={() => summarizeJobDescription()} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : 'Analyze Text'}
            </Button>
          </div>

          <div className="mb-6 text-left">
            {result && (
              <pre className="overflow-hidden whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: result }} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
