function toggleChat() {
  const chatWrapper = document.getElementById("chat-wrapper");
  if (chatWrapper.style.display === "flex") {
    chatWrapper.style.display = "none";
  } else {
    chatWrapper.style.display = "flex";
  }
}

function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;

  const chatbox = document.getElementById("chatbox");

  // Dodaj wiadomość użytkownika
  const userBubble = document.createElement("div");
  userBubble.className = "bubble user-bubble";
  userBubble.textContent = message;
  chatbox.appendChild(userBubble);

  input.value = "";

  // Przewiń na dół
  chatbox.scrollTop = chatbox.scrollHeight;

  // Symuluj odpowiedź bota
  fetch("/get", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ msg: message })
  })
  .then(response => response.json())
  .then(data => {
    const botBubble = document.createElement("div");
    botBubble.className = "bubble bot-bubble";
    botBubble.textContent = data.reply || "Brak odpowiedzi.";
    chatbox.appendChild(botBubble);
    chatbox.scrollTop = chatbox.scrollHeight;
  })
  .catch(err => {
    console.error(err);
  });
}
