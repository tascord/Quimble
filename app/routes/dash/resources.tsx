import { Link } from "remix";
import { Stater } from "~/helpers/stater";
import Video from "~/components/video";
import Embed from "~/components/embed";

export default function Index() {

    Stater.emit('context_menu.set_menu', [
        <Link to="/dash/">Home</Link>,
        <Link to="/dash/staff">Staff List</Link>,
        <Link to="/dash/resources" className="active">Resources</Link>
    ])

    return (

        <>

            <h1 className="text-4xl text-green-500">Resources</h1>
            <p>Some useful resources for queer folk</p>

            <section className="w-full flex flex-row justify-around items-center flex-wrap">

                <Embed url="https://discord.com" />

            </section>

        </>

    )

}