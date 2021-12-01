import { Link } from 'remix';
import { Stater } from '~/helpers/stater';
import Logo from '../media/logo_light.svg';

export default function Index() {

    Stater.emit('context_menu.add_to_default', (
        <Link to="/support" className="active">Support</Link>
    ))

    return (
        <>
            <div className="banner">
                <div>
                    <img src={Logo} alt="Quimble logo" />
                    <p className="text-4xl font-extrabold">
                        Ask questions about Quimble!
                    </p>
                </div>
            </div>

            <hr className="mt-64 opacity-0" />

            <p>
                Todo: this.
            </p>

        </>
    );

}
