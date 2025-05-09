from flask import Flask, request, render_template, jsonify
import openai
import os
import re
import smtplib
from email.message import EmailMessage

app = Flask(__name__)
openai.api_key = os.getenv("OPENAI_API_KEY")

# Funkcja wykrywająca e-mail lub numer telefonu
def is_email_or_phone(text):
    email_pattern = r"[\w\.-]+@[\w\.-]+\.\w+"
    phone_pattern = r"\b\d{9,12}\b"
    return re.search(email_pattern, text) or re.search(phone_pattern, text)

# Funkcja wysyłająca powiadomienie e-mail do właściciela
def send_email_notification(client_info):
    msg = EmailMessage()
    msg.set_content(f"Nowe zapytanie od klienta NAVI:\n\n{client_info}")
    msg["Subject"] = "BiznesBot – Nowy klient z NAVI"
    msg["From"] = os.getenv("SMTP_EMAIL")
    msg["To"] = os.getenv("OWNER_EMAIL")

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(os.getenv("SMTP_EMAIL"), os.getenv("SMTP_PASS"))
            smtp.send_message(msg)
    except Exception as e:
        print(f"Błąd wysyłania e-maila: {str(e)}")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json["message"]

    # Jeśli klient poda kontakt – wyślij e-mail
    if is_email_or_phone(user_message):
        send_email_notification(user_message)

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": """
Jesteś chatbotem NAVI reprezentującym firmę BiznesBot.pl. Twoim zadaniem jest prezentować konkretne usługi i styl pracy właściciela.

Oferta BiznesBot.pl:
- Mini Landing Page + AI Chatbot: nowoczesna, responsywna strona z chatbotem 24/7. Idealna dla małych firm (500–1500 zł brutto)
- System Rezerwacji + Google Kalendarz + e-mail (500–3000 zł brutto, zależnie od funkcji)
- Pakiet Podstawowy: chatbot lub strona WWW – 990 zł/rok lub 500 zł + 50 zł/miesiąc
- Szkolenia IT: od 100 zł/h (komputer, AI, automatyzacje)
- Logo – od 300 zł, banery – od 150 zł

Zawsze kieruj użytkownika do odpowiednich stron:
- Chatboty: https://biznesbot.pl/demo-chatboty/
- Rezerwacje: https://biznesbot.pl/demo-systemy-rezerwacji/
- Strony WWW: https://biznesbot.pl/stronyinternetowe/
- Szkolenia: https://biznesbot.pl/szkolenia-it/
- Pełna oferta: https://biznesbot.pl/oferta/
- Kontakt: https://biznesbot.pl/kontakt/

Twój styl to: prosty język, ludzkie podejście, konkretne informacje. Nigdy nie wymyślaj usług spoza oferty. Podkreślaj:
- Indywidualne podejście
- Szybkość i jakość
- Stały kontakt i wsparcie
- Rozsądne ceny

Zakończ rozmowę wezwaniem do kontaktu: kontakt@biznesbot.pl lub tel. 725 777 393.
"""
                },
                {"role": "user", "content": user_message}
            ]
        )
        return jsonify({"reply": response.choices[0].message.content})
    except Exception as e:
        return jsonify({"reply": f"[BŁĄD NAVI]: {str(e)}"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
