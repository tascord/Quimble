import Logo from '../media/logo_light.svg'

export function links() {
  return [{ rel: "stylesheet", href: 'tailwind/index' }];
}

export default function Index() {

  // Tailwind hero header reading 'Quimble, giving you the power to express yourself.'
  return (
    <>
      <div className="w-full flex flex-row justify-around items-center flex-wrap mt-8">
        <div className="">
          <img src={Logo} alt="Quimble logo" />
          <p className="text-4xl font-extrabold w-[40rem] mb-8">
            Ensure expression without sacrificing safety.
          </p>
        </div>
        <div className="w-[30rem] h-[35rem] flex items-center justify-center relative mb-[15rem]">
          <div className="absolute w-[35.5rem] h-[37.5rem] pr-32 bg-gradient-to-br from-yellow-500 to-pink-400 rounded-l-2xl mt-64 right-[-23rem] z-10"></div>
          <img src="https://via.placeholder.com/720x720" alt="Placeholder" className="h-[32.5rem] w-[32.5rem] rounded-2xl z-20" />
        </div>
      </div>

      <hr className="my-8 w-full" />

      <div className="questions">

        <div className="question">
          <div className="text">
            <h1>What is Quimble?</h1>
            <p>
              Quimble is a tool that allows students to selectively share information about their identity with teachers.
              Students can create 'identities' which contain names and pronouns, which they can assign to teachers.
              This allows them to assign different teachers different information to make them comfortable.
            </p>
          </div>
          <img src="https://via.placeholder.com/720x720" alt="Placeholder" />
        </div>

        <div className="question">
          <img src="https://via.placeholder.com/720x720" alt="Placeholder" />
          <div className="text">
            <h1>What is the issue that Quimble is solving?</h1>
            <p>
              Students are often uncomfortable sharing information about themselves with certain teachers.
              Quimble tries to remove this discomfort by allowing selective sharing per teacher.
            </p>
          </div>
        </div>

      </div>

    </>
  );

}
