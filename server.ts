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
            content: `You are an expert career coach and resume optimizer. Given a job description, extract a list of the most important keywords that a candidate should include in their resume to maximize relevance and match for applicant tracking systems (ATS).

                      Instructions:
                      - Group keywords by category (e.g., Skills, Tools, Experience, Responsibilities, Qualifications, Soft Skills).
                      - Include both technical and non-technical terms.
                      - Focus on high-signal phrases that are unique to the role or industry.
                      - Return the result in a text list format.`,
          },
          {
            role: 'user',
            content: `Here is the job description: ${state}`,
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
