import { Link } from "remix";
import { Stater } from "~/helpers/stater";

export default function Index() {

    Stater.emit('context_menu.add_to_default', (
        <Link to="/dash" className="active">Explore</Link>
    ))

    return (
        <a href="/">Bruh</a>
    )

}