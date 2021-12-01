import { FaTwitter, FaInstagram, FaLinkedin, FaGlobe} from 'react-icons/fa';
import { Link } from 'remix';
import { Stater } from '~/helpers/stater';
import Logo from '../media/logo_light.svg';

export function links() {
    return [{ rel: "stylesheet", href: '/tailwind/about' }];
}

export default function Index() {

    Stater.emit('context_menu.add_to_default', (
        <Link to="/about" className="active">About</Link>
    ))

    // Tailwind hero header reading 'Quimble, giving you the power to express yourself.'
    return (
        <>
            <div className="banner">
                <div>
                    <img src={Logo} alt="Quimble logo" />
                    <p className="text-4xl font-extrabold">
                        Meet the team behind our work.
                    </p>
                </div>
            </div>

            <hr className="mt-[18rem] opacity-0" />

            <div className="team md:mb-16">

                <div className="card">
                    <img src="https://avatars.dicebear.com/api/initials/flora.svg" alt="Flora" />
                    <div className="info">
                        <h1>Flora</h1>
                        <h2>Lead Software Designer</h2>

                        <div className="socials">
                            <a href="https://twitter.com/tascord" target="_blank">
                                <FaTwitter />
                            </a>
                            <a href="https://instagram.com/tascord" target="_blank">
                                <FaInstagram />
                            </a>

                            <a href="https://www.linkedin.com/in/oscar-hill-a1a620201/" target="_blank">
                                <FaLinkedin />
                            </a>

                            <a href="https://tascord.xyz" target="_blank">
                                <FaGlobe />
                            </a>
                        </div>

                    </div>
                </div>

            </div>

        </>
    );

}
