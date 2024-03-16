const express = require("express");
const axios = require('axios');
const router = express.Router();
const clm = require('country-locale-map');

async function translate(text, country) {
    try {
        const res = await axios.post(
            `https://translation.googleapis.com/language/translate/v2?key=AIzaSyDIY-uYgUheDgzYOU6ts9fFeWhAUeRioZQ`,
            { q: text, target: country }
        );
        const translation = res.data.data.translations[0].translatedText;
        return translation;
    } catch (error) {
        console.error('Error translating text:', error);
        text += " (jezyk nie wykryty)";
        return text;
    }
}

router.get('/', function(req, res) {
    console.log("hello im on the start page");
    res.render("index");
});

router.post('/index', async (req, res) => {
    try {
        const username = req.body.name;
        const city = req.body.place;
        const apiKey = '14a24dee3920387f8b0cfd6295374d0c';

        const query1 = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;


        const response = await axios.get(query1);
        const y = response.data;
        if (y.cod === '404') {
            const responseMsg = `${city}, czy na pewno podales poprawne miasto?`;
            return res.status(404).json({ message: responseMsg }); 
        }

        let responseMsg;
        switch (true) {
            case y.main.temp < 10:
                responseMsg = `${username}, ubierz się bo na polu tylko ${y.main.temp} stopni`;
                break;
            case y.main.temp > 22:
                responseMsg = `${username}, nie ubieraj się za ciepło bo na polu ${y.main.temp} stopni`;
                break;
            default:
                responseMsg = `${username}, pogoda jest w porządku, ${y.main.temp} stopni`;
        }
        const query2 = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${y.coord.lat},${y.coord.lon}&key=AIzaSyBJn-necCOTFpN-lncYjh5vi_Qr7-T4NIM`;

        const geocodeResponse = await axios.get(query2);
        const results = geocodeResponse.data.results;

        if (!results || results.length === 0) {
            throw new Error('Geocoding API returned empty results');
        }

        const countryComponent = results[0].address_components.find(component => component.types.includes("country"));
        if (!countryComponent) {
            throw new Error('Country component not found in geocoding response');
        }

        const country = countryComponent.short_name;
        const lng = clm.getLocaleByAlpha2(country);
        responseMsg = await translate(responseMsg, lng);
        const location = results[0].geometry.location;
        const lat = location.lat;
        const lon = location.lng;

        (responseMsg);
        res.json({ message: responseMsg, lat: lat, lon: lon });
    } catch (error) {
        if (error.message === 'Geocoding API returned empty results') {
            return res.status(404).json({ message: 'Nie ma takiego miasta' });
        } else {
            console.error('Error:', error);
            return res.status(500).json({ message: 'Nie ma takiego miasta' });
        }
    }
});

module.exports = router;
