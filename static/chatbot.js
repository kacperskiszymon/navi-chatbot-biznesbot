let inactivityTimeout;

function resetInactivityTimer() {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(() => {
        document.getElementById("chat-container").classList.add("hidden");
    }, 180000); // 3 minuty
}

function showChat() {
    document.getElementById("chat-container").classList.remove("hidden");
    resetInactivityTimer();
}

async function sendMessage() {
    const input = document.getElementById("userInput");
    const message = input.value.trim();
    if (!message) return;

    const chatbox = document.getElementById("chatbox");

    // Dodanie dymku użytkownika
    const userBubble = document.createElement("div");
    userBubble.className = "bubble user-bubble";
    userBubble.textContent = message;
    chatbox.appendChild(userBubble);

    input.value = "";

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });

        const data = await response.json();

        // Dodanie dymku NAVI
        const botBubble = document.createElement("div");
        botBubble.className = "bubble bot-bubble";
        botBubble.textContent = data.reply;
        chatbox.appendChild(botBubble);
    } catch (error) {
        const errorBubble = document.createElement("div");
        errorBubble.className = "bubble bot-bubble";
        errorBubble.style.color = "red";
        errorBubble.textContent = "Błąd połączenia z NAVI.";
        chatbox.appendChild(errorBubble);
    }

    chatbox.scrollTop = chatbox.scrollHeight;
    resetInactivityTimer();
}

// Powitanie
window.onload = function () {
    const chatbox = document.getElementById("chatbox");

    const welcome = document.createElement("div");
    welcome.className = "bubble bot-bubble";
    welcome.textContent = "Cześć! Jestem NAVI – wirtualny asystent BiznesBot.pl. Jak mogę Ci pomóc?";
    chatbox.appendChild(welcome);

    showChat();
};

// Obsługa Enter
document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("userInput");
    input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });

    // Każde kliknięcie na stronie przywraca czat
    document.body.addEventListener("click", showChat);
});
