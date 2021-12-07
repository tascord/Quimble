import { ActionFunction, Form, Link, LoaderFunction, redirect, useActionData, useLoaderData, useTransition } from "remix";
import { Stater } from "~/helpers/stater";
import { Chatroom, create_chatroom, get_chatrooms, get_user, User } from "~/utils/db.server";
import { getSession, commitSession } from "~/utils/session.server";
import { FaMapPin, FaPlus, FaThumbsDown, FaThumbtack } from "react-icons/fa";
import { useState } from "react";
import Popup from "~/components/popup";
import { to_forum_case } from "~/helpers/utils";
import { hasPermissions } from "~/utils/permissions.server";

export const loader: LoaderFunction = ({ request }): Promise<[[boolean, boolean], Chatroom[]]> => new Promise(async (resolve) => {

    let permissions: [boolean, boolean] = [false, false];

    const session = await getSession(request.headers.get('Cookie'));
    if (session && session.has('user_token')) {
        try {
            let user = await get_user(session.get('user_token'));
            permissions = [
                hasPermissions(user, 'CREATE_ROOM'),
                hasPermissions(user, 'STICKY_ROOM')
            ];
        } catch { }
    }

    // Get chatroom data
    get_chatrooms()
        .then((rooms) => resolve([permissions, rooms]));

})

export const action: ActionFunction = async ({ request }) => {

    const data = await request.formData();
    let errors: { [key: string]: string } = {};

    // Validate room name
    if (!data.has('room_name')) {
        errors.room_name = 'Room name is required';
        return errors;
    }

    let room_name = (data.get('room_name')?.toString() ?? '').replace(/[^A-z0-9 ]/g, '');

    if ((room_name.length ?? 0) > 25 || (room_name.length ?? 0) < 3) {
        errors.room_name = 'Room name must be between 3 and 25 characters';
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

    // Create room
    try {
        await create_chatroom(room_name, session.get('user_token'))
        return redirect(`/dash/chat/${room_name.replace(/ /g, '_')}`);
    } catch (err: any) {
        errors.room_name = err.message;
        return errors;
    }


}

export default function Chat() {

    // Permissions: [Create Room, Sticky Room]
    const [permissions, chat_rooms]: [[boolean, boolean], Chatroom[]] = useLoaderData();

    Stater.emit('context_menu.set_menu', [
        <Link to="/dash/">Home</Link>,
        <Link to="/dash/staff">Staff List</Link>,
        <Link to="/dash/resources">Resources</Link>,
        <Link to="/dash/chat" className="active">Chat</Link>,
    ])

    const [creatingRoom, setCreatingRoom] = useState(false);
    const errors = useActionData();

    return (

        <>

            <Popup open={creatingRoom} close={() => setCreatingRoom(false)}>
                <Form method="post" className="mt-16 mx-auto w-[90%] md:w-[25rem]">

                    <label>
                        Chat Room Name
                        {errors?.room_name && <span>{errors.room_name}</span>}
                        <input
                            type="text"
                            name="room_name"
                            minLength={3}
                            maxLength={25}
                            autoComplete="off"
                            autoCorrect="off"
                            onChange={(e) => {
                                e.target.value = e.target.value.replace(/[^A-z0-9 ]/, '')
                            }} />
                    </label>

                    <SubmitButton />

                </Form>
            </Popup>

            <article className="header">
                <h1 className="text-4xl text-green-500">Chat Rooms</h1>
                <p>Browse any of the {chat_rooms.length} rooms for a space you like!</p>
                {
                    permissions[0] &&
                    <a href="#" className="flex flex-row align-middle items-center" onClick={() => setCreatingRoom(true)} >
                        <FaPlus className="mr-2" /> Create Chatroom
                    </a>
                }
            </article>

            <div className="flex flex-col mt-8">

                {
                    chat_rooms
                        .sort((a, b) => new Date(b.last_message).getTime() - new Date(a.last_message).getTime())
                        .sort(room => room.sticky ? -1 : 0)
                        .map(room => (

                            <a key={room.name} href={`/dash/chat/${room.name}/0`} className="flex flex-row justify-between my-2 text-opacity-75 hover:text-opacity-75 bg-gray-700 p-4 rounded-lg hover:scale-[102%] transition-all ease-in-out duration-200 relative">
                                {
                                    room.sticky &&
                                    <span className="absolute top-1 inline-flex justify-center align-middle font-semibold text-sm text-green-400 text-opacity-80">
                                        <FaThumbtack className="mt-[0.33rem]" /> Sticky
                                    </span>
                                }
                                <h1 className="font-bold text-2xl pt-2 text-white text-opacity-80 hover:text-opacity-100 transition-all ease-in-out duration-300">
                                    {to_forum_case(room.name)}
                                    {
                                        false && permissions[1] &&
                                        <a href="#" className="flex flex-row align-middle items-center text-lg" onClick={() => pinRoom(room.name)} >
                                            <FaMapPin className="mr-2" /> {room.sticky ? 'Unsticky' : 'Sticky'} Room
                                        </a>
                                    }
                                </h1>
                                <span>Last message {new Date(room.last_message).toLocaleString()}</span>
                            </a>

                        ))
                }

            </div>
        </>
    )

}

function pinRoom(room_name: string) {
    // TODO: This
}

function SubmitButton() {

    // Haha like... like.... uhm....
    const trans = useTransition();

    return (
        <button
            type="submit"
            className={trans.state === 'idle' ? '' : 'loading'}
        >
            Create Room
        </button>
    )


}
