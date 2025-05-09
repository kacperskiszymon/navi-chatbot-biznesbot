// Funkcja wysyłająca wiadomość do API
async function sendMessage() {
    const input = document.getElementById("userInput");
    const message = input.value.trim();
    if (!message) return;

    const chatbox = document.getElementById("chatbox");
    chatbox.innerHTML += `<p><b>Ty:</b> ${message}</p>`;
    input.value = "";

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        chatbox.innerHTML += `<p><b>NAVI:</b> ${data.reply}</p>`;
    } catch (error) {
        chatbox.innerHTML += `<p style="color:red;"><b>Błąd:</b> Nie udało się połączyć z NAVI.</p>`;
    }

    chatbox.scrollTop = chatbox.scrollHeight;
}

// Powitanie po załadowaniu strony
window.onload = function () {
    const chatbox = document.getElementById("chatbox");
    chatbox.innerHTML += `<p><b>NAVI:</b> Cześć! Jestem NAVI, wirtualny asystent BiznesBot.pl. Jak mogę Ci pomóc?</p>`;
};

// Obsługa klawisza Enter
document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("userInput");
    input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
});
