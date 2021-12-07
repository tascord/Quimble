import { Link } from "remix";
import { Stater } from "~/helpers/stater";

export default function Index() {

    Stater.emit('context_menu.set_menu', [
        <Link to="/dash/">Home</Link>,
        <Link to="/dash/staff" className="active">Staff List</Link>,
        <Link to="/dash/resources">Resources</Link>,
        <Link to="/dash/chat">Chat</Link>
    ])

    return (
        <a href="/">Staff</a>
    )

}