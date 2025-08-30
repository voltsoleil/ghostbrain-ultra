// Fonction principale pour envoyer une requête à l'IA
async function sendMessage() {
    const input = document.getElementById("userInput").value;
    const output = document.getElementById("response");

    if (!input.trim()) {
        output.innerText = "⚠️ Merci d'écrire un message.";
        return;
    }

    output.innerText = "⏳ L'IA réfléchit...";

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: input }]
            })
        });

        const data = await response.json();
        output.innerText = data.choices[0].message.content;
    } catch (error) {
        output.innerText = "❌ Erreur : " + error.message;
    }
}
