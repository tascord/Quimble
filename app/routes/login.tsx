import { ActionFunction, Form, json, LoaderFunction, redirect, useActionData, useTransition } from 'remix';
import { get_user } from '~/utils/db.server';
import { commitSession, getSession } from '~/utils/session.server';

export const loader: LoaderFunction = async ({ request }) => {

    //TODO: Why the redirects?

    const session = await getSession(request.headers.get('Cookie'));
    
    // Redirect if logged in already
    if(session.has('user_token')) {
        try {
            await get_user(session.get('user_token'));
            return redirect('/dash');
        } catch {
            session.unset('user_token');
            return redirect('/login', {
                headers: {
                    'Set-Cookie': await commitSession(session)
                }
            });
        }
    }

    return json({});

}

export const action: ActionFunction = async ({ request }) => {

    const data = await request.formData();
    let errors: { [key: string]: string } = {};

    // Format user_code field
    let user_code = (data.get('user_code') ?? '').toString();
    if (!(/^(([A-Z]{3}[0-9]{4})|([A-Z]{3,4}))$/.test(user_code))) {
        errors['user_code'] = 'Invalid code format.';
    }

    // Check user exists
    try { await get_user(user_code) }
    catch {
        errors['user_code'] = 'No user exists with that code.';
    }

    // Return errors if any
    if (Object.keys(errors).length > 0) {
        return errors;
    }

    // Get and update session information
    const session = await getSession(request.headers.get('Cookie'));
    session.set('user_token', user_code);

    // Redirect with session information
    return redirect('/dash', {
        headers: {
            'Set-Cookie': await commitSession(session)
        }
    });

}

export default function Index() {

    // Stater.emit('context_menu.reset', null);

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
                    {errors?.user_code && <span>{errors.user_code}</span>}
                    <input
                        type="text"
                        name="user_code"
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
