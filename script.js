const form = document.querySelector("form");
const input = document.querySelector("#message");
const dialogue = document.querySelector("#dialogue");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  // Afficher ton message
  dialogue.innerHTML += `<div><strong>Tu:</strong> ${userMessage}</div>`;
  input.value = "";

  try {
    // Envoyer la requête POST à Netlify Function
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await response.json();

    if (data.reply) {
      dialogue.innerHTML += `<div><strong>IA:</strong> ${data.reply}</div>`;
    } else {
      dialogue.innerHTML += `<div><strong>IA:</strong> Erreur: ${data.error}</div>`;
    }
  } catch (err) {
    dialogue.innerHTML += `<div><strong>IA:</strong> Erreur serveur</div>`;
  }
});
