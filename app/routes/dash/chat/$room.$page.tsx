import { useState } from "react";
import { FaPencilAlt, FaReply, FaTimes } from "react-icons/fa";
import { ActionFunction, Form, Link, LoaderFunction, redirect, useActionData, useLoaderData, useTransition } from "remix"
import Popup from "~/components/popup";
import { Stater } from "~/helpers/stater";
import { to_forum_case } from "~/helpers/utils";
import { ChatroomData, create_message, get_chatroom } from "~/utils/db.server";
import { getSession, commitSession } from "~/utils/session.server";

export function links() {
    return [{ rel: "stylesheet", href: '/tailwind/chat' }];
}

export const loader: LoaderFunction = ({ params }): Promise<ChatroomData> => new Promise(async (resolve, reject) => {

    const room = params.room;
    const page = params.page;

    if (!room || !page || isNaN(Number(page))) {
        return reject(redirect("/dash/chat"));
    }

    get_chatroom(room, Number(page))
        .then(resolve)
        .catch(() => reject(redirect("/dash/chat")));

});

export const action: ActionFunction = async ({ request, params }) => {

    const data = await request.formData();
    let errors: { [key: string]: string } = {};

    const room = params.room;
    const page = params.page;

    if (!room || !page || isNaN(Number(page))) {
        throw redirect("/dash/chat");
    }

    // Validate content
    if (!data.has('content')) {
        errors.content = 'Message content is required';
        return errors;
    }

    let content = (data.get('content')?.toString() ?? '').split('\n').reduce((a, b, i) => a + (i < 5 ? '\n' : '') + b);
    if (content.length < 2) {
        errors.content = 'Message content is too short';
        return errors;
    }

    if (content.length > 250) {
        errors.content = 'Message content is too long';
        return errors;
    }

    let reply = -1;
    if (data.has('reply')) {
        reply = Number(data.get('reply'));
        if (isNaN(reply)) errors.reply = 'Invalid reply ID';
    }

    // Ensure user is logged in
    const session = await getSession(request.headers.get('Cookie'));
    if (!session || !session.has('user_token')) {
        return redirect('/login', {
            headers: {
                'Set-Cookie': await commitSession(session)
            }
        });
    }

    // Create message
    try {
        await create_message(session.get('user_token') as string, room, content, reply);
        return redirect(`/dash/chat/${room}/0`);
    } catch (err: any) {
        errors.content = err.message;
        return errors;
    }


}

export default function Index() {

    const room: ChatroomData = useLoaderData();
    const errors = useActionData();

    const [editing, setEditing] = useState(false);
    const [reply, setReply] = useState<ChatroomData['messages'][number] | null>(null);

    Stater.emit('context_menu.set_menu', [
        <Link to="/dash/">Home</Link>,
        <Link to="/dash/staff">Staff List</Link>,
        <Link to="/dash/resources">Resources</Link>,
        <Link to="/dash/chat" className="active">Chat</Link>,
    ])

    function Message({ message, replies }: { message: ChatroomData['messages'][number], replies?: ChatroomData['messages'][number][] }): JSX.Element {

        return (
            <div className="message" id={'m-' + message.id.toString()}>
                <h2>
                    <a href={`#m-${message.id.toString()}`}>
                        {message.author}
                        <span>
                            {new Date(message.timestamp).toLocaleString()}
                        </span>
                    </a>
                </h2>
                <a href="#" className="flex flex-row align-middle items-center" onClick={() => { setEditing(true); setReply(message); }}>
                    <FaReply className="mr-2" /> Reply
                </a>
                <p>
                    {message.content}
                </p>
                {
                    replies && replies.length > 0 &&
                    <div className="replies">
                        {
                            replies.map(reply => (
                                <Message message={reply} />
                            ))
                        }
                    </div>
                }
            </div>
        )

    }

    return (
        <>

            <Popup open={editing} close={() => setEditing(false)}>
                <Form method="post" className="mt-16 mx-auto w-[90%] md:w-[30rem]">

                    {
                        reply &&
                        <label>
                            <span className="text-white text-lg flex flex-row justify-between items-center">
                                Replying to {reply.author}
                                <a href="#" className="text-gray-400 hover:text-white transition-all ease-in-out duration-200" onClick={() => setReply(null)}>
                                    <FaTimes className="mr-2" />
                                </a>
                            </span>
                            <blockquote>
                                {reply.content}
                            </blockquote>
                            {errors?.reply && <span>{errors.reply}</span>}
                            <input type="hidden" name="reply" value={reply.id} />
                        </label>
                    }

                    <label>
                        Content
                        {errors?.content && <span>{errors.content}</span>}
                        <textarea name="content" className="w-[30rem] max-w-[95%] h-[10rem] resize-none" maxLength={250} onChange={(e) => e.target.value = e.target.value.split('\n').reduce((a, b, i) => a + (i < 5 ? '\n' : '') + b)} />
                    </label>

                    <SubmitButton />

                </Form>
            </Popup>

            <article className="header">
                <h1 className="text-4xl text-green-500">{to_forum_case(room.name)}</h1>
                <p>Please be respectful of others in chatrooms</p>
                <a href="#" className="flex flex-row align-middle items-center" onClick={() => setEditing(true)}>
                    <FaPencilAlt className="mr-2" /> Create New Thread
                </a>
            </article >

            <div className="chatroom">
                {
                    room.messages
                        .filter(m => m.reply === -1) // Non-replies
                        .map(message => (

                            <Message key={message.id}
                                message={message}
                                replies={
                                    room.messages
                                        .filter(m => m.reply === message.id) // Only replies
                                        .reverse() // Oldest first for replies}
                                }
                            />
                        ))
                }
            </div>
        </>
    )


}


function SubmitButton() {

    // Haha like... like.... uhm....
    const trans = useTransition();

    return (
        <button
            type="submit"
            className={trans.state === 'idle' ? '' : 'loading'}
        >
            Create
        </button>
    )


}