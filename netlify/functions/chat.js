// netlify/functions/chat.js
export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { userMessage, mode } = JSON.parse(event.body || "{}");
    if (!userMessage) {
      return { statusCode: 400, body: "Missing userMessage" };
    }

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: `Tu es en mode ${mode || "général"}. Réponds brièvement.` },
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
      }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      return {
        statusCode: resp.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: data?.error?.message || "Upstream error" }),
      };
    }

    const reply = data.choices?.[0]?.message?.content ?? "(pas de réponse)";
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message }),
    };
  }
}
