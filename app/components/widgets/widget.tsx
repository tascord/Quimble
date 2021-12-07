import { Component } from "react";

type WidgetData = {
    [key: string]: any;
}

export type WidgetDimensions = {
    width: number;
    height: number;
}

export default class Widget<T extends WidgetData> extends Component {
    name: string;
    private _data: T | undefined;

    get data(): T | undefined {
        return this._data;
    }

    set data(data: T | undefined) {
        this._data = data;
        this.forceUpdate();
    }

    /**
     * Create a new widget
     * @param name Widget name
     * @param data Default data
     */
    constructor(name: string, data?: T) {
        super({});
        this.name = name;
        this._data = data;
    }

    /**
     * * NOT TO BE OVERWRITTEN
     * Renders the widget through react
     * @returns Widget
     */
    render() {
        return (
            <div className="widget" data-widget={this.name} key={this.name}>
                {this.widget()}
            </div>
        )
    }

    /**
     * Widget body
     * @returns Widget body
     */
    widget(): JSX.Element {
        return <h1> Widget !</h1>
    }

}