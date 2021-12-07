import { useState } from "react";
import { Link, LinksFunction, LoaderFunction, redirect, useLoaderData } from "remix";
import Weather, { Dimensions as WeatherDimensions } from "~/components/widgets/weather";
import Clock, { Dimensions as ClockDimensions } from "~/components/widgets/clock";
import { Stater } from "~/helpers/stater";
import { get_user, User } from "~/utils/db.server";
import { commitSession, getSession } from "~/utils/session.server";
import { FaPencilAlt, FaTimes } from "react-icons/fa";
import { get_name } from "~/helpers/utils";
import GridLayout from 'react-grid-layout';
import { WidgetDimensions } from "~/components/widgets/widget";

export let links: LinksFunction = () => {
    return [
        { rel: "stylesheet", href: '/tailwind/widgets' }
    ];
};

//TODO: Create a dashboard system with cusomizable widgets.
// Widgets: 
// - Identities
// - News
// - Games
// - Chatrooms (More info later)

export const loader: LoaderFunction = ({ request }): Promise<User> => new Promise(async (resolve, reject) => {

    const session = await getSession(request.headers.get('Cookie'));

    // Redirect if user isn't logged in
    if (!session || !session.has('user_token')) {
        return reject(redirect('/login'));
    }

    // Get user from session
    try {
        let user = get_user(session.get('user_token'));
        return resolve(user);
    }

    catch {
        // Invalid user token
        session.unset('user_token');
        return reject(redirect('/login', {
            headers: {
                'Set-Cookie': await commitSession(session)
            }
        }));

    }

})

const WidgetList = ['Clock', 'Weather'] as const;
type WidgetID = typeof WidgetList[number];
function widget_from_id(id: WidgetID) {
    switch (id) {
        case 'Clock': return <Clock />;
        case 'Weather': return <Weather />;
    }
}

type LayoutItem = {
    x: number,
    y: number,
    w: number,
    h: number,
    item: any,
}

export default function Index() {

    const user: User = useLoaderData();

    Stater.emit('context_menu.set_menu', [
        <Link to="/dash/" className="active">Home</Link>,
        <Link to="/dash/staff">Staff List</Link>,
        <Link to="/dash/resources">Resources</Link>,
        <Link to="/dash/chat">Chat</Link>,
    ])

    const [editMode, setEditMode] = useState(true);
    const [layout, setLayout] = useState<LayoutItem[]>(user.layout.map(l => {
        let [widget, dimensions] = get_wiget_dimensions(l.name);
        return {
            x: l.x,
            y: l.y,
            w: dimensions.width,
            h: dimensions.height,
            item: widget
        }
    }));

    // TODO: Set width based off css
    let grid_layout = layout.map((item, index) => ({
        i: index.toString(),
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
        static: editMode
    }))

    function add_widget(name: string) {

        let [widget, dimensions] = get_wiget_dimensions(name);
        setLayout([...layout, { w: dimensions.width, h: dimensions.height, x: (layout.length * 2) % 5, y: Infinity, item: widget }]);
    }

    function get_wiget_dimensions(name: string): [JSX.Element, WidgetDimensions] {
        switch (name) {
            case 'Clock': return [<Clock />, ClockDimensions];
            case 'Weather': return [<Weather />, WeatherDimensions];
            default: return [<div>Unknown Widget</div>, { width: 1, height: 1 }];
        }
    }

    function save_layout() {
        // TODO: Save the layout lol
    }

    return (

        <>

            <article className="header">
                <h1 className="text-4xl text-green-500">Welcome Home</h1>
                <p>Nice to see you, {get_name(user)}!</p>

                <a href="#" className="flex flex-row align-middle items-center" onClick={() => setEditMode(true)} >
                    <FaPencilAlt className="mr-2" /> Add Widgets
                </a>
            </article>

            <ul className={`drawer ${editMode ? 'open' : ''}`}>
                <a href="#" onClick={() => setEditMode(false)} >
                    <FaTimes />
                </a>
                {
                    WidgetList.map(widget => (
                        <li key={widget} onClick={() => add_widget(widget)}>
                            <h1>Add {widget}</h1>
                            {widget_from_id(widget)}
                        </li>
                    ))
                }
            </ul>

            <div className="flex flex-row flex-wrap mt-8">

                <GridLayout className={"layout" + (editMode ? ' editing' : '')} layout={grid_layout} cols={5} rowHeight={140} width={1800}>

                    {
                        layout.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    onClick={() => {
                                        if (!editMode) return;
                                        setLayout(layout.filter((_, i) => i !== index));
                                    }}>

                                    {item.item}
                                </div>
                            )
                        })
                    }

                </GridLayout>

            </div>

        </>
    )

}