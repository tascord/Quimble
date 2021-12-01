import { Link } from 'remix';
import { Stater } from '~/helpers/stater';
import Logo from '../media/logo_light.svg';

export default function Index() {

    Stater.emit('context_menu.reset', undefined);
    Stater.emit('context_menu.add_item', (
        <Link to="/support" className="active">Support</Link>
    ))

    return (
        <>
            <div className="absolute w-full flex flex-row justify-around items-center flex-wrap py-16 bg-gray-800 left-0">
                <div className="">
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
