function sendMessage() {
    const input = document.getElementById("userInput");
    const message = input.value.trim();
    if (!message) return;

    const chatbox = document.getElementById("chatbox");

    const userBubble = document.createElement("div");
    userBubble.className = "bubble user-bubble";
    userBubble.textContent = message;
    chatbox.appendChild(userBubble);

    input.value = "";

    fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    })
        .then((res) => res.json())
        .then((data) => {
            const botBubble = document.createElement("div");
            botBubble.className = "bubble bot-bubble";
            botBubble.textContent = data.reply;
            chatbox.appendChild(botBubble);
            chatbox.scrollTop = chatbox.scrollHeight;
        })
        .catch(() => {
            const errorBubble = document.createElement("div");
            errorBubble.className = "bubble bot-bubble";
            errorBubble.style.color = "red";
            errorBubble.textContent = "Błąd połączenia z NAVI.";
            chatbox.appendChild(errorBubble);
        });

    chatbox.scrollTop = chatbox.scrollHeight;
}

function clearChat() {
    const chatbox = document.getElementById("chatbox");
    chatbox.innerHTML = "";
    const welcome = document.createElement("div");
    welcome.className = "bubble bot-bubble";
    welcome.textContent = "Cześć! Jestem NAVI – wirtualny asystent BiznesBot.pl. Jak mogę Ci pomóc?";
    chatbox.appendChild(welcome);
    document.getElementById("userInput").focus();
}

window.onload = function () {
    clearChat(); // start z powitaniem
    document.getElementById("chat-toggle").addEventListener("click", () => {
        document.getElementById("chat-container").style.display = "flex";
    });

    document.getElementById("minimize-btn").addEventListener("click", () => {
        document.getElementById("chat-container").style.display = "none";
    });

    document.getElementById("userInput").addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
};
