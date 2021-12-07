import { LinksFunction } from "remix";
import GridLayout from 'react-grid-layout';

import Weather, { Dimensions as WeatherDimensions } from "~/components/widgets/weather";
import Clock, { Dimensions as ClockDimensions } from "~/components/widgets/clock";
import { useState } from "react";

export let links: LinksFunction = () => {
    return [
        { rel: "stylesheet", href: '/tailwind/widgets' }
    ];
};

type LayoutItem = {
    x: number,
    y: number,
    w: number,
    h: number,
    item: any,
}

export default function Index() {

    const [layout, setLayout] = useState<LayoutItem[]>([]);

    // TODO: Set width based off css
    let grid_layout = layout.map((item, index) => ({
        i: index.toString(),
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
    }))

    function add_widget(name: string) {

        let widget;
        let dimensions = { width: 1, height: 1 };

        switch (name) {
            case "Weather":
                widget = <Weather />;
                dimensions = WeatherDimensions;
                break;
            case "Clock":
                widget = <Clock />;
                dimensions = ClockDimensions;
                break;
            default:
                widget = <div>Unknown widget</div>;
                break;
        }

        setLayout([...layout, { w: dimensions.width, h: dimensions.height, x: (layout.length * 2) % 5, y: Infinity, item: widget }]);
    }

    return (

        <>

            <div>
                <button onClick={() => add_widget('Clock')} className="mx-2 bg-blue-400 rounded-lg text-lg p-2 px-4 shadow-2xl font-bold hover:bg-blue-600 transition-all ease-in-out duration-200">Add Clock</button>
                <button onClick={() => add_widget('Weather')} className="mx-2 bg-blue-400 rounded-lg text-lg p-2 px-4 shadow-2xl font-bold hover:bg-blue-600 transition-all ease-in-out duration-200">Add Weather</button>
                <button onClick={() => add_widget('Spacer')} className="mx-2 bg-blue-400 rounded-lg text-lg p-2 px-4 shadow-2xl font-bold hover:bg-blue-600 transition-all ease-in-out duration-200">Add Spacer</button>
            </div>

            <GridLayout className="layout" layout={grid_layout} cols={5} rowHeight={140} width={1800}>

                {
                    layout.map((item, index) => {
                        return (
                            <div key={index}>
                                {item.item}
                            </div>
                        )
                    })
                }

            </GridLayout>

        </>
    )

}

