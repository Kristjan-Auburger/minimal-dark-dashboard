from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import requests
import os

# .env laden
load_dotenv()

app = Flask(__name__)

API_KEY = os.getenv("WEATHER_API_KEY")
print("API Key geladen:", API_KEY)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/weather")
def get_weather():
    city = request.args.get("city")
    if not city:
        return jsonify({"error": "Bitte gib eine Stadt an."}), 400

    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric&lang=de"
    response = requests.get(url)

    print("API-URL:", url)
    print("Antwort:", response.text)

    if response.status_code != 200:
        return jsonify({"error": "Stadt nicht gefunden oder API-Fehler."}), response.status_code

    data = response.json()

    weather = {
        "name": data["name"],
        "main": data["main"],
        "weather": data["weather"]
    }

    return jsonify(weather)

if __name__ == "__main__":
    app.run(debug=True)
