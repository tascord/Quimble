import { ActionFunction, Form, redirect, useActionData, useTransition } from 'remix';
import { Stater } from '~/helpers/stater';
import { User } from '../helpers/user';

export const action: ActionFunction = async ({ request }) => {

    const data = await request.formData();
    let errors: { [key: string]: string } = {};

    let username = (data.get('username') ?? '').toString();
    if (!(/^(([A-Z]{3}[0-9]{4})|([A-Z]{3,4}))$/.test(username))) {
        errors['username'] = 'Invalid code format.';
    }

    if (Object.keys(errors).length > 0) {
        return errors;
    }

    User.user = username;
    return redirect('/dash');
}

export default function Index() {

    Stater.emit('context_menu.reset', null);

    const errors = useActionData();

    return (
        <>

            <article className="header">
                <h1 className="text-4xl text-green-500">Login</h1>
                <p>To access Quimble, you'll need to login with your school account!</p>
            </article>

            <Form method="post" className="mt-16 mx-auto w-[90%] md:w-[25rem]">

                <label>
                    Staff/Student Code
                    {errors?.username && <span>{errors.username}</span>}
                    <input
                        type="text"
                        name="username"
                        minLength={3}
                        maxLength={7}
                        autoComplete="off"
                        autoCorrect="off"
                        onChange={(e) => {
                            e.target.value = e.target.value.replace(/[^A-z0-9]/, '').toUpperCase()
                        }} />
                </label>

                <SubmitButton />

            </Form>


        </>
    );

}

function SubmitButton() {

    // Haha like... like.... uhm....
    const trans = useTransition();

    return (
        <button
            type="submit"
            className={trans.state === 'idle' ? '' : 'loading'}
        >
            Log In!
        </button>
    )


}
