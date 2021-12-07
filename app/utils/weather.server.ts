import fetch from "node-fetch";

export type WeatherData = {
    weather: {
        main: string;
        description: string;
        icon: string;
    }[],
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        humidity: number;
    }
}

let weather_cache: WeatherData | undefined;

// Clear cache every hour
setInterval(() => {
    weather_cache = undefined;
}, 1000 * 60 * 60);

// Get weather data from OpenWeatherMap
export function get_weather() {

    return new Promise<WeatherData>((resolve, reject) => {

        // Use cache if available
        if (weather_cache !== undefined) {
            return resolve(weather_cache);
        }

        //TODO: Use API Key in env file
        fetch('https://api.openweathermap.org/data/2.5/weather?q=Melbourne&units=metric&appid=63f434d3a84928d178569a1236e80a87')
            .then(res => res.json())
            .then(data => {
                weather_cache = data;
                return resolve(data);
            })
            .catch(() => reject(`Unable to fetch weather! Try again later.`));


    });

}