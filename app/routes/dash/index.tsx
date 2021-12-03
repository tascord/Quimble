import { Navigate } from "react-router";
import { Link, LoaderFunction, redirect, useLoaderData } from "remix";
import { Stater } from "~/helpers/stater";
import { User } from "~/helpers/user";
import { User as PrismaUser } from "~/utils/db.server";

//TODO: Create a dashboard system with cusomizable widgets.
// Widgets: 
// - Identities
// - Weather
// - News
// - Games
// - Chatrooms (More info later)

export const loader: LoaderFunction = (): Promise<PrismaUser|null> => new Promise((resolve) => {

    User.get_user()
        .then(resolve)
        .catch((e) => {
            console.log(e);
            resolve(null)
        });

})

export default function Index() {

    const user = useLoaderData();    
    if(!user) return <Navigate to="/login" />

    Stater.emit('context_menu.set_menu', [
        <Link to="/dash/" className="active">Home</Link>,
        <Link to="/dash/staff">Staff List</Link>,
        <Link to="/dash/resources">Resources</Link>
    ])

    return (

        <>

            <article className="header">
                <h1 className="text-4xl text-green-500">Welcome Home</h1>
                <p>Nice to see you!</p>
            </article>

        </>
    )

}