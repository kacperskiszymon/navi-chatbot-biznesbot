document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("chat-toggle");
  const chatWrapper = document.getElementById("chat-wrapper");
  const userInput = document.getElementById("userInput");
  const chatbox = document.getElementById("chatbox");

  toggleButton.addEventListener("click", () => {
    if (chatWrapper.style.display === "flex") {
      chatWrapper.style.display = "none";
    } else {
      chatWrapper.style.display = "flex";
    }
  });

  window.sendMessage = async function () {
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage(message, "user");
    userInput.value = "";

    try {
      const response = await fetch("/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ msg: message })
      });

      const data = await response.json();
      appendMessage(data.reply || "Brak odpowiedzi.", "bot");
    } catch (err) {
      appendMessage("Błąd połączenia z serwerem.", "bot");
    }
  };

  function appendMessage(text, sender) {
    const bubble = document.createElement("div");
    bubble.className = "bubble " + sender + "-bubble";
    bubble.textContent = text;
    chatbox.appendChild(bubble);
    chatbox.scrollTop = chatbox.scrollHeight;
  }
});
