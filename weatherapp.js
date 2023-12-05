const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 8002;
const apiKey = '4b4e3c6c0fmsh200bc93353c2993p17a126jsn372467f81535';
const apiHost = 'openweather43.p.rapidapi.com';

app.route('/')
  .get((req, res) => {
    const form = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Weather Prediction</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css" integrity="sha384-mz6sYPi8quZLYLMOD1Fyqj09hiJojM90TWWzAexACiqbb3pia5C+0AdypmsofjnB" crossorigin="anonymous">
        <style>
          body {
            background-color: #3498db; /* Sky Blue background color */
            color: #fff;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
          }

          h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
          }

          form {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          label {
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
          }

          input {
            padding: 0.5rem;
            font-size: 1rem;
            border: none;
            border-radius: 5px;
            margin-bottom: 1rem;
          }

          button {
            padding: 0.7rem 1.5rem;
            font-size: 1rem;
            background-color: #2ecc71; /* Green button color */
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }

          button:hover {
            background-color: #27ae60; /* Darker green on hover */
          }

          .weather-container {
            text-align: center;
            margin-top: 2rem;
          }

          .icon {
            font-size: 5rem;
            margin-bottom: 1rem;
          }

          p {
            font-size: 1.5rem;
            margin: 0.5rem 0;
          }
        </style>
      </head>
      <body>
        <h1>Weather Prediction</h1>
        <form method="post" action="/">
          <label for="city">Enter City:</label>
          <input type="text" id="city" name="city" required>
          <button type="submit">Predict Weather</button>
        </form>

        <div class="weather-container">
          <!-- Weather information will be displayed here -->
        </div>
      </body>
      </html>
    `;
    res.send(form);
  })
  .post((req, res) => {
    const city = req.body.city;

    const apiPath = `/weather?q=${city}&units=imperial`;

    const options = {
      method: 'GET',
      hostname: apiHost,
      path: apiPath,
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': apiHost,
        'useQueryString': true,
      }
    };

    https.get(options, (apiRes) => {
      let data = '';

      apiRes.on('data', (chunk) => {
        data += chunk;
      });

      apiRes.on('end', () => {
        try {
          const weatherData = JSON.parse(data);

          if (apiRes.statusCode === 200) {
            const temperature = weatherData.main.temp;
            const description = weatherData.weather[0].description;

            const htmlResponse = `
              <!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Weather in ${city}</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css" integrity="sha384-mz6sYPi8quZLYLMOD1Fyqj09hiJojM90TWWzAexACiqbb3pia5C+0AdypmsofjnB" crossorigin="anonymous">
                <style>
                  body {
                    background-color: #3498db; /* Sky Blue background color */
                    color: #fff;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                  }

                  h1 {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                  }

                  .weather-container {
                    text-align: center;
                    margin-top: 2rem;
                  }

                  .icon {
                    font-size: 5rem;
                    margin-bottom: 1rem;
                  }

                  p {
                    font-size: 1.5rem;
                    margin: 0.5rem 0;
                  }
                </style>
              </head>
              <body>
                <h1>Weather in ${city}</h1>
                <div class="weather-container">
                  <p><i class="fas fa-thermometer-half icon"></i> Temperature: ${temperature}°F</p>
                  <p><i class="fas fa-sun icon"></i> Description: ${description}</p>
                  <p><i class="fas fa-wind icon"></i> Wind Speed: ${weatherData.wind.speed} mph</p>
                  <p><i class="fas fa-tint icon"></i> Humidity: ${weatherData.main.humidity}%</p>
                </div>
              </body>
              </html>
            `;

            res.send(htmlResponse);
          } else {
            res.status(apiRes.statusCode).send('API request failed');
          }
        } catch (error) {
          res.status(500).send('Error parsing API response');
        }
      });
    }).on('error', (error) => {
      res.status(500).send('Error making API request');
    });
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
