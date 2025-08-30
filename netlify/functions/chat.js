// --- Front-end chat for GhostBrain Ultra ---
const form = document.querySelector("form");
const input = document.querySelector("#message");
const dialogue = document.querySelector("#dialogue");
const modeRadios = document.querySelectorAll('input[name="mode"]');

function currentMode() {
  const checked = Array.from(modeRadios).find(r => r.checked);
  return checked ? checked.value : "Coach Business IA";
}

function addBubble(who, text) {
  const line = document.createElement("div");
  line.className = "bubble " + (who === "TU" ? "me" : "gb");
  line.innerHTML = `<strong>${who}</strong> — ${text}`;
  dialogue.appendChild(line);
  dialogue.scrollTop = dialogue.scrollHeight;
}

async function talk(userMessage) {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userMessage,
        mode: currentMode()
      })
    });

    if (!res.ok) {
      const txt = await res.text();
      addBubble("GB", `Erreur HTTP ${res.status} — ${txt.slice(0,200)}`);
      return;
    }

    const data = await res.json();
    const reply = data.reply || "(pas de réponse)";
    addBubble("GB", reply);
  } catch (err) {
    addBubble("GB", "Erreur réseau : " + err.message);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userMessage = (input.value || "").trim();
  if (!userMessage) return;

  addBubble("TU", userMessage);
  input.value = "";
  await talk(userMessage);
});



   
