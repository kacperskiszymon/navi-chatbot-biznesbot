async function sendMessage() {
    const input = document.getElementById("userInput");
    const message = input.value.trim();
    if (!message) return;

    document.getElementById("chatbox").innerHTML += `<p><b>Ty:</b> ${message}</p>`;

    const response = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message })
    });

    const data = await response.json();
    document.getElementById("chatbox").innerHTML += `<p><b>NAVI:</b> ${data.reply}</p>`;
    input.value = "";
}
