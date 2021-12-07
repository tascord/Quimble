import Widget, { WidgetDimensions } from "./widget";
import { WeatherData } from "~/utils/weather.server";

type WeatherWidgetData = {
    weather: WeatherData | null;
    fetching: boolean;
}

export const Dimensions: WidgetDimensions = {
    height: 1, width: 2
}

export default class Weather extends Widget<WeatherWidgetData> {

    constructor() {
        super("Weather", {
            weather: null,
            fetching: false
        });
    }

    componentDidMount() {
        if (!this.data?.weather && !this.data?.fetching) {

            this.data = { weather: null, fetching: true };

            this.update_weather();
            setInterval(this.update_weather, 1000 * 60 * 60);
        }
    }

    update_weather() {
        fetch('/weather?x=0')
            .then(res => res.json())
            .then(data => this.data = { weather: data, fetching: false })
            .catch(console.error);
    }

    widget() {

        if (!this.data?.weather) {
            return <></>;
        }

        return (
            <h1 className="flex flex-row justify-center items-center">
                <img src={`http://openweathermap.org/img/wn/${this.data.weather.weather[0].icon}@2x.png`} alt="Weather symbol" className="shadow-2xl rounded-full mr-2 bg-green-500" />
                <div className="flex flex-col font-mono ml-4">

                    <span className="text-3xl text-green-400">
                        {this.data.weather.weather[0].main}
                        <span className="text-2xl opacity-70 text-gray-500 ml-4">
                            ({this.data.weather.weather[0].description})
                        </span>
                    </span>

                    <span className="text-xl text-gray-900">
                        Currently <strong className="text-green-300">{this.data.weather.main.temp}°C</strong>, Feels like <strong className="text-green-300">{this.data.weather.main.feels_like}°C</strong>
                    </span>

                    <span className="text-xl text-gray-900">
                        Top of <strong className="text-green-300">{this.data.weather.main.temp_max}°C</strong>, Low of <strong className="text-green-300">{this.data.weather.main.temp_min}°C</strong>
                    </span>

                    <sub className="opacity-90 py-3">Location: Melbourne, Weather courtesy of <a href="https://openweathermap.org" className="hover:text-green-500">OpenWeatherMap</a></sub>

                </div>
            </h1>
        );
    }

}