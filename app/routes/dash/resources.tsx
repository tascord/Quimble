import { Link, LoaderFunction, useLoaderData } from "remix";
import { Stater } from "~/helpers/stater";
import Embed from "~/components/embed";
import { get_resources, Resource } from "~/utils/db.server";

export const loader: LoaderFunction = async () => {
    return await get_resources();
}

export default function Index() {

    const resources = useLoaderData<Resource[]>();


    Stater.emit('context_menu.set_menu', [
        <Link to="/dash/">Home</Link>,
        <Link to="/dash/staff">Staff List</Link>,
        <Link to="/dash/resources" className="active">Resources</Link>,
        <Link to="/dash/chat">Chat</Link>,
    ])

    return (

        <>

            <article className="header">
                <h1 className="text-4xl text-green-500">Resources</h1>
                <p>Some useful resources for queer folk</p>
            </article>

            <section className="scroller">

                {
                    resources.map(resource => (
                        <Embed key={resource.url} url={resource.url} />
                    ))
                }

            </section>

        </>

    )

}