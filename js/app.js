// Handle login or account button
document.addEventListener('DOMContentLoaded', () => {
  const loginAccountItem = document.getElementById('login-account');

  // Monitor user authentication state
  auth.onAuthStateChanged((user) => {
    if (user) {
      // If the user is logged in
      loginAccountItem.innerHTML = '<i class="fas fa-user-circle"></i>My Account';
      loginAccountItem.onclick = () => {
        window.location.href = 'account.html'; // Account page link
      };
    } else {
      // If no user is logged in
      loginAccountItem.innerHTML = '<i class="fas fa-sign-in-alt"></i>Login';
      loginAccountItem.onclick = () => {
        window.location.href = 'logins.html'; // Login page link
      };
    }
  });
});


const saveButton = document.getElementById("saveCityButton");
const cityInput = document.getElementById("cityInput");

// Update button state based on save status
function updateSaveButton(saved) {
  if (saved) {
    saveButton.textContent = "Saved ";
    saveButton.style.backgroundColor = "#2ecc71"; // Green color
  } else {
    saveButton.textContent = "Save City";
    saveButton.style.backgroundColor = ""; // Default color
  }
}

// When the save button is clicked
saveButton.addEventListener("click", function () {
  const cityName = cityInput.value.trim();
  if (!cityName) {
    alert("Please enter city name !");
    return;
  }

  let savedCities = JSON.parse(localStorage.getItem("cities")) || [];
  if (savedCities.includes(cityName)) {
    // If the city is saved, delete it
    savedCities = savedCities.filter((city) => city !== cityName);
    updateSaveButton(false);
  } else {
    // If not saved, add it
    savedCities.push(cityName);
    updateSaveButton(true);
  }
  localStorage.setItem("cities", JSON.stringify(savedCities));
});

// Update button state when city changes
cityInput.addEventListener("input", function () {
  const cityName = cityInput.value.trim();
  const savedCities = JSON.parse(localStorage.getItem("cities")) || [];
  updateSaveButton(savedCities.includes(cityName));
});


// Unused variable: const saveCityBtn = document.getElementById('saveCityBtn');
// Unused variable: let currentCity = "London";

document.getElementById("ab-us").addEventListener("click", function () {
    window.location.href = "aboutus.html"; // Redirect user to aboutus.html
});

document.getElementById("set").addEventListener("click", function () {
    window.location.href = "settings.html"; // Redirect user to settings.html
});

document.getElementById("sav").addEventListener("click", function () {
    window.location.href = "saved-cities.html"; // Redirect user to saved-cities.html
});


const API_KEY = 'REMOVED_FOR_SECURITY';

// Utility Functions for Weather Descriptions
const weatherDescriptions = {
    getHumidityDescription: (humidity) => {
        if (humidity < 30) return "Dry Atmosphere";
        if (humidity <= 60) return "Comfortable Humidity";
        return "High Humidity";
    },
    getTemperatureDescription: (temp) => {
        if (temp < 10) return "Freezing Cold";
        if (temp < 20) return "Cool Temperature";
        if (temp < 30) return "Warm Weather";
        return "Hot and Sunny";
    },
    getWindDescription: (speed) => {
        if (speed < 5) return "Calm Winds";
        if (speed < 15) return "Gentle Breeze";
        if (speed < 30) return "Moderate Winds";
        return "Strong Gusty Winds";
    },
    getVisibilityDescription: (visibility) => {
        if (visibility > 10) return "Crystal Clear";
        if (visibility >= 5) return "Moderate Visibility";
        return "Low Visibility";
    },
    getCloudDescription: (coverage) => {
        if (coverage <= 20) return "Clear Skies";
        if (coverage <= 50) return "Partly Cloudy";
        if (coverage <= 80) return "Mostly Overcast";
        return "Dense Cloud Cover";
    },
    getPressureDescription: (pressure) => {
        if (pressure < 1000) return "Low Atmospheric Pressure";
        if (pressure <= 1020) return "Stable Pressure";
        return "High Atmospheric Pressure";
    }
};

// Menu Functionality
const menuToggle = () => {
    const menu = document.querySelector('.menu');
    const backdrop = document.querySelector('.backdrop');
    menu.classList.toggle('active');
    backdrop.style.display = menu.classList.contains('active') ? 'block' : 'none';
};

// Error Handling
const displayError = (message) => {
    const errorElement = document.getElementById("error");
    errorElement.textContent = message;
    errorElement.style.opacity = 1;
    setTimeout(() => {
        errorElement.style.opacity = 0;
    }, 3000);
};

// Weather Data Fetching and UI Update
async function fetchWeatherData(city) {
    // Clear previous data and show loading messages
    document.getElementById("cityName").textContent = "Loading...";
    document.getElementById("countryName").textContent = "";
    document.getElementById("temperatureValue").textContent = "";
    document.getElementById("weatherDescription").textContent = "Fetching weather data...";
    document.getElementById("humidity").textContent = "...";
    document.getElementById("windSpeed").textContent = "...";
    document.getElementById("pressure").textContent = "...";

    const cardIds = ['pressure-text', 'clouds-text', 'visibility-text', 'wind-text', 'temperature-text', 'humidity-text'];
    cardIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = "Loading...";
    });

    const recommendationCardSelectors = ['.cird#temperature-card .card-ses', '.cird#humidity-card .card-ses', '.cird#wind-speed-card .card-ses', '.cird#visibility-card .card-ses', '.cird#cloudiness-card .card-ses'];
    recommendationCardSelectors.forEach(selector => {
        const el = document.querySelector(selector);
        if (el) el.textContent = "Loading...";
    });

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error("City not found. Please check the spelling and try again.");
        }

        const data = await response.json();
        updateMainWeatherCard(data);
        updateAdditionalWeatherCards(data);
        // Assuming updateRecommendationCards is desired, ensure it's defined or called correctly.
        // If it was part of the original script and intended to be used, it should be included.
        // For now, calling it based on the structure of the previous file.
        const weatherDataForRecommendations = {
            temperature: Math.round(data.main.temp),
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed * 3.6),
            visibility: data.visibility / 1000,
            cloudiness: data.clouds.all
        };
        updateRecommendationCards(weatherDataForRecommendations); // Added this call
    } catch (error) {
        displayError(error.message);
    }
}

// Update Main Weather Card
function updateMainWeatherCard(data) {
    document.getElementById("cityName").textContent = data.name;
    document.getElementById("countryName").textContent = data.sys.country;
    document.getElementById("temperatureValue").textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById("weatherDescription").textContent = data.weather[0].description
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    document.getElementById("humidity").textContent = `${data.main.humidity}%`;
    document.getElementById("windSpeed").textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    document.getElementById("pressure").textContent = `${data.main.pressure} hPa`;

    // Switch views
    document.getElementById("welcome-page").style.display = "none";
    document.getElementById("home").style.display = "block";
}

// Update Additional Weather Cards in Reverse Order
function updateAdditionalWeatherCards(data) {
    const cardData = [
        { id: 'pressure-text', value: data.main.pressure, description: weatherDescriptions.getPressureDescription(data.main.pressure), icon: '📊' },
        { id: 'clouds-text', value: data.clouds.all, description: weatherDescriptions.getCloudDescription(data.clouds.all), icon: '☁️' },
        { id: 'visibility-text', value: data.visibility / 1000, description: weatherDescriptions.getVisibilityDescription(data.visibility / 1000), icon: '👁️' },
        { id: 'wind-text', value: Math.round(data.wind.speed * 3.6), description: weatherDescriptions.getWindDescription(Math.round(data.wind.speed * 3.6)), icon: '💨' },
        { id: 'temperature-text', value: Math.round(data.main.temp), description: weatherDescriptions.getTemperatureDescription(Math.round(data.main.temp)), icon: '🌡️' },
        { id: 'humidity-text', value: data.main.humidity, description: weatherDescriptions.getHumidityDescription(data.main.humidity), icon: '💧' }
    ];

    cardData.reverse().forEach((item, index) => {
        const element = document.getElementById(item.id);
        if (element) {
            element.textContent = `${item.description}`;
            // You could also update the icon dynamically if needed
        }
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const menuBtns = document.querySelectorAll('.menu-btn');
    const backdrop = document.querySelector('.backdrop');

    menuBtns.forEach(btn => btn.addEventListener('click', menuToggle));
    backdrop.addEventListener('click', menuToggle);

    document.getElementById("start").addEventListener("click", () => {
        const city = document.getElementById("cityInput").value.trim();
        city ? fetchWeatherData(city) : displayError("Please enter a city name");
    });

    document.getElementById("cityInput").addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            const city = event.target.value.trim();
            city ? fetchWeatherData(city) : displayError("Please enter a city name");
        }
    });
});
//--------------
function getRecommendations(weatherData) {
    const recommendations = {
        temperature: {
            cold: "It's very cold. Wear warm layers, use thermal clothing, and limit outdoor exposure.",
            cool: "Cool weather. Dress in light jackets, perfect for brisk walks or light outdoor activities.",
            warm: "Warm and pleasant. Great for outdoor sports, picnics, and outdoor recreation.",
            hot: "Hot weather. Stay hydrated, use sunscreen, wear light clothing, and avoid midday sun."
        },
        humidity: {
            dry: "The air is very dry. Keep yourself hydrated, use moisturizer, and consider a humidifier.",
            comfortable: "Humidity levels are comfortable. Enjoy outdoor activities without discomfort.",
            humid: "High humidity. Stay in well-ventilated areas, wear breathable clothing, and stay hydrated."
        },
        windSpeed: {
            calm: "Calm winds. Perfect for outdoor yoga, photography, or leisurely walks.",
            light: "Light breeze. Good for cycling, kite flying, and outdoor sports.",
            moderate: "Moderate winds. Be cautious during outdoor activities. Secure loose items.",
            strong: "Strong winds. Recommended to stay indoors. Avoid outdoor activities and driving."
        },
        visibility: {
            excellent: "Crystal clear visibility. Ideal for road trips, sightseeing, and outdoor photography.",
            good: "Good visibility. Safe for driving and outdoor activities.",
            poor: "Low visibility. Exercise caution while driving. Consider postponing travel."
        },
        cloudiness: {
            clear: "Clear skies. Perfect for outdoor events, stargazing, and solar activities.",
            partlyCloudy: "Partly cloudy. Great for picnics and outdoor leisure.",
            mostlyCloudy: "Mostly cloudy. Good for mild outdoor walks or indoor activities.",
            overcast: "Overcast skies. Prepare for potential rain. Keep an umbrella handy."
        }
    };
    // Image links by recommendations (This comment seems misplaced, refers to logic below)

    // Temperature-based recommendation
    let tempRec = recommendations.temperature.warm;
    if (weatherData.temperature < 10) tempRec = recommendations.temperature.cold;
    else if (weatherData.temperature < 20) tempRec = recommendations.temperature.cool;
    else if (weatherData.temperature > 30) tempRec = recommendations.temperature.hot;

    // Humidity-based recommendation
    let humidityRec = recommendations.humidity.comfortable;
    if (weatherData.humidity < 30) humidityRec = recommendations.humidity.dry;
    else if (weatherData.humidity > 60) humidityRec = recommendations.humidity.humid;

    // Wind speed recommendation
    let windRec = recommendations.windSpeed.light;
    if (weatherData.windSpeed < 5) windRec = recommendations.windSpeed.calm;
    else if (weatherData.windSpeed > 30) windRec = recommendations.windSpeed.strong;
    else if (weatherData.windSpeed > 15) windRec = recommendations.windSpeed.moderate;

    // Visibility recommendation
    let visibilityRec = recommendations.visibility.good;
    if (weatherData.visibility > 10) visibilityRec = recommendations.visibility.excellent;
    else if (weatherData.visibility < 5) visibilityRec = recommendations.visibility.poor;

    // Cloudiness recommendation
    let cloudinessRec = recommendations.cloudiness.partlyCloudy;
    if (weatherData.cloudiness < 20) cloudinessRec = recommendations.cloudiness.clear;
    else if (weatherData.cloudiness > 80) cloudinessRec = recommendations.cloudiness.overcast;

    return {
        temperature: tempRec,
        humidity: humidityRec,
        windSpeed: windRec,
        visibility: visibilityRec,
        cloudiness: cloudinessRec
    };
}

function updateRecommendationCards(weatherData) {
    const cards = document.querySelectorAll(".cird");
    const recommendations = getRecommendations(weatherData);
    const recommendationKeys = Object.keys(recommendations);

    cards.forEach((card, index) => {
        const description = card.querySelector(".card-ses");
        if (description && recommendationKeys[index]) {
            description.textContent = recommendations[recommendationKeys[index]];
        }
    });
}

function getCityFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('city');
}

document.addEventListener("DOMContentLoaded", function () {
    const cityNameFromUrl = getCityFromURL(); // Renamed to avoid conflict
    if (cityNameFromUrl) {
      document.getElementById("cityInput").value = cityNameFromUrl;
      document.getElementById("start").click();
    }
});

// Load saved cities on page load
function loadSavedCities() {
  // Note: `cityName` here will refer to the global/outer scope if not passed or defined locally.
  // This might be the value from cityInput after getCityFromURL, or undefined if not set.
  const currentCityName = cityInput.value.trim(); // Get current city from input
  const savedCities = JSON.parse(localStorage.getItem("cities")) || [];
  if (savedCities.includes(currentCityName) && currentCityName) { // Check if currentCityName is not empty
    updateSaveButton(true); // Update based on current city in input
    // saveButton.classList.add('saved'); // This is handled by updateSaveButton
    // saveButton.disabled = true; // This logic seems to be handled by updateSaveButton's effects
  }
}

// Save city on save button click
function saveCity() { // This function is defined but not explicitly called in the provided event listeners.
                  // The saveButton's click listener above handles this logic directly.
                  // This function might be redundant or from an earlier version.
  const cityName = cityInput.value.trim(); // Get current city
  let savedCities = JSON.parse(localStorage.getItem("cities")) || [];
  if (!savedCities.includes(cityName)) {
    savedCities.push(cityName);
    localStorage.setItem("cities", JSON.stringify(savedCities)); // Save cities in LocalStorage
    alert(`${cityName} .Saved successfully `);
    updateSaveButton(true); // Update button state
    // saveButton.classList.add('saved'); // Change button color to green after saving
    // saveButton.disabled = true; // Disable button after saving
  } else {
    alert(`${cityName} It has already been saved.`);
  }
}

// Load button state on page load
// Call loadSavedCities after DOM is ready and potentially after cityInput might be populated by getCityFromURL
document.addEventListener("DOMContentLoaded", function () {
    loadSavedCities();
});


// You can now load additional data from Firestore (This is a comment for the user)
