async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value;
  if (!message) return;

  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML += `<div><b>Moi :</b> ${message}</div>`;

  input.value = "";

  try {
    const res = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userMessage: message, mode: "assistant" })
    });

    const data = await res.json();
    chatBox.innerHTML += `<div><b>IA :</b> ${data.reply}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (err) {
    chatBox.innerHTML += `<div style="color:red;"><b>Erreur :</b> ${err.message}</div>`;
  }
}

