import { Link } from "remix";
import { Stater } from "~/helpers/stater";

export default function Index() {

    Stater.emit('context_menu.set_menu', [
        <Link to="/dash/" className="active">Home</Link>,
        <Link to="/dash/staff">Staff List</Link>,
        <Link to="/dash/resources">Resources</Link>
    ])

    return (
        <a href="/">Home</a>
    )

}