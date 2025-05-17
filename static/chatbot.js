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

function toggleChat() {
  const body = document.body;
  if (body.classList.contains("show-chat")) {
    body.classList.remove("show-chat");
    body.classList.add("hide-chat");
  } else {
    body.classList.remove("hide-chat");
    body.classList.add("show-chat");
  }
}

window.onload = function () {
  document.body.classList.add("hide-chat");

  const chatbox = document.getElementById("chatbox");
  const welcome = document.createElement("div");
  welcome.className = "bubble bot-bubble";
  welcome.textContent = "Cześć! Jestem NAVI – asystent BiznesBot.pl. W czym mogę pomóc?";
  chatbox.appendChild(welcome);

  document.getElementById("chat-toggle").addEventListener("click", toggleChat);
  document.getElementById("userInput").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
};
