import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

const URI = process.env.LLM_API!;
const secret = process.env.LLM_API_KEY;

app.use('/v1/*', cors());
app.post('/v1/chat/description', async c => {
  try {
    const { state } = await c.req.json();

    const response = await fetch(URI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({
        model: 'Meta-Llama-3.2-3B-Instruct',
        messages: [
          {
            role: 'system',
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

    const result = { message: json.choices[0].message.content };
    return c.json(result);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'An error occurred while processing your request.' }, 500);
  }
});

export default {
  fetch: app.fetch,
  port: 7642,
};
