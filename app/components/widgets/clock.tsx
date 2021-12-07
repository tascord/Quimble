import Widget, { WidgetDimensions } from "./widget";
import { FaClock } from "react-icons/fa";

type ClockData = {
    time: Date;
}

export const Dimensions: WidgetDimensions = {
    height: 1, width: 1
}

export default class Clock extends Widget<ClockData> {

    constructor() {
        super("Clock", { time: new Date() });
        setInterval(() => {
            this.data = { time: new Date() };
        }, 1000);
    }

    widget() {
        return (
            <h1 className="flex flex-row justify-center items-center">
                <FaClock className="text-[5rem] mt-1 text-green-500 shadow-2xl rounded-full" />
                <div className="flex flex-col font-mono ml-4">

                    <span className="text-3xl text-green-400">
                        {this.data?.time.toLocaleTimeString()} {((this.data?.time.getHours() ?? 0) >= 12) ? 'PM' : 'AM'}
                    </span>

                    <span className="text-xl text-gray-900">
                        {this.data?.time.toDateString()}
                    </span>

                </div>
            </h1>
        );
    }

}