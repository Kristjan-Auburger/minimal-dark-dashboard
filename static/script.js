// Elemente aus dem DOM holen
const cityInput = document.getElementById("cityInput");
const addCityBtn = document.getElementById("addCityBtn");
const weatherGrid = document.getElementById("weatherGrid");

// 🏙️ Standardstädte aus Bayern
const defaultCities = [
  "München",
  "Nürnberg",
  "Augsburg",
  "Regensburg",
  "Ingolstadt",
  "Würzburg",
  "Fürth",
  "Erlangen",
  "Rosenheim",
  "Passau"
];

// Städte aus LocalStorage laden oder Standardstädte verwenden
let cities = JSON.parse(localStorage.getItem("savedCities")) || [...defaultCities];

// 🔄 Wetterdaten von der API holen
async function fetchWeather(city) {
  const response = await fetch(`/weather?city=${encodeURIComponent(city)}`);
  if (!response.ok) throw new Error(`Fehler beim Laden: ${city}`);
  const data = await response.json();
  return data;
}

// 🌤️ Wetterkarten rendern
async function renderCities() {
  weatherGrid.innerHTML = ""; // Grid leeren

  for (const city of cities) {
    const card = document.createElement("div");
    card.classList.add("weather-card");
    card.innerHTML = `<p>Lade ${city}...</p>`;
    weatherGrid.appendChild(card);

    try {
      const data = await fetchWeather(city);

      if (!data.main || !data.weather) {
        card.innerHTML = `<h2>${city}</h2><p>❌ Keine Daten gefunden</p>`;
        continue;
      }

      const temp = Math.round(data.main.temp);
      const desc = data.weather[0].description;
      const icon = data.weather[0].icon;

      card.innerHTML = `
        <h2>${data.name}</h2>
        <p class="temp">${temp}°C</p>
        <p class="desc">${desc}</p>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="">
      `;
    } catch (error) {
      console.error(error);
      card.innerHTML = `<h2>${city}</h2><p>⚠️ Fehler beim Laden</p>`;
    }
  }
}

// ➕ Neue Stadt hinzufügen & speichern
addCityBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city && !cities.includes(city)) {
    cities.push(city);
    localStorage.setItem("savedCities", JSON.stringify(cities));
    renderCities();
  }
  cityInput.value = "";
});

// 🗑️ Optional: Städte löschen (z. B. Doppelklick auf Karte)
weatherGrid.addEventListener("dblclick", (e) => {
  const card = e.target.closest(".weather-card");
  if (!card) return;
  const cityName = card.querySelector("h2")?.textContent;
  if (cityName && confirm(`${cityName} entfernen?`)) {
    cities = cities.filter(c => c !== cityName);
    localStorage.setItem("savedCities", JSON.stringify(cities));
    renderCities();
  }
});

// Seite starten
renderCities();
