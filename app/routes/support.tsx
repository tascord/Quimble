import Logo from '../media/logo_light.svg';

export default function Index() {

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
