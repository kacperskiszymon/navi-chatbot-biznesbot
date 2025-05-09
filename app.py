from flask import Flask, request, render_template, jsonify
import openai
import os

app = Flask(__name__)
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json["message"]
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
