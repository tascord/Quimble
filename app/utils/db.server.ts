/* Taken from remix docs */
// https://remix.run/docs/en/v1/tutorials/jokes#set-up-prisma

import { PrismaClient } from "@prisma/client";
import { createCookieSessionStorage } from "@remix-run/server-runtime";
import { hasPermissions } from "./permissions.server";

let db: PrismaClient;

declare global {
    var __db: PrismaClient | undefined;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
if (process.env.NODE_ENV === "production") {
    db = new PrismaClient();
    db.$connect();
} else {
    if (!global.__db) {
        global.__db = new PrismaClient();
        global.__db.$connect();
    }
    db = global.__db;
}

export { db };

/* All mine now bby <3<3 */

export type Resource = {
    url: string,
    tags: string[]
}

export type Identity = {
    name: string,
    pronouns: string,
}

export type User = {
    code: string,
    role: 'staff' | 'student' | 'moderator',
    read_notifications: string[],
    layout: {
        x: number,
        y: number,
        name: string
    }[]
    identities: Identity[],
}

export type Chatroom = {
    name: string,
    last_message: Date,
    sticky: boolean,
}

export type Message = {
    id: number
    author: string,
    content: string,
    timestamp: Date,
    reply?: number
}

export type ChatroomData = {
    name: string,
    messages: Message[]
}

/**
 * Fetches all resource URL's
 * @returns All Resources
 */
export function get_resources(): Promise<Resource[]> {

    return new Promise((resolve, reject) => {

        db.resource.findMany()
            .then(resources => {
                resolve(
                    resources.map(r => ({
                        url: r.url,
                        tags: r.tags.split(',')
                    }))
                )
            })
            .catch(reject);

    });

}

/**
 * Fetches a user by code
 * @param code User code
 * @returns User
 */
export function get_user(code: string): Promise<User> {

    return new Promise((resolve, reject) => {

        db.user.findUnique({ where: { id: code } })
            .then(async (user) => {

                if (user === null) return reject("No user exists with that ID");

                let identities: Identity[] = [];
                for (let identity of user.identities.split(',')) {
                    let fetched = await db.identity.findUnique({ where: { id: identity } });
                    if (!fetched) continue;

                    identities.push({
                        name: fetched.name,
                        pronouns: fetched.pronouns
                    });

                }

                let role: User['role'];
                switch (user.role) {

                    case 'staff':
                        role = 'staff';
                        break;

                    case 'student':
                        role = 'student';
                        break;

                    case 'moderator':
                        role = 'moderator';
                        break;

                    default:
                        return reject("Unknown user role");

                }

                let layout;
                try { layout = JSON.parse(user.layout); }
                catch (e) { layout = []; }
                layout = layout.filter((l: any) => l.x !== undefined && l.y !== undefined && l.name !== undefined);

                resolve({
                    code: user.id,
                    role: role,
                    identities: identities,
                    read_notifications: user.read_notifications.split(','),
                    layout: layout
                });

            })

            .catch(reject);


    });

}

/**
 * Fetches all chatrooms
 * @returns Chatrooms
 */
export function get_chatrooms(): Promise<Chatroom[]> {

    return new Promise((resolve, reject) => {

        db.chatRoom.findMany({
            orderBy: { id: 'asc' },
        })
            .then(rooms => {
                resolve(
                    rooms.map(r => ({
                        name: r.name,
                        last_message: new Date(r.last_message),
                        sticky: r.sticky
                    }))

                        .sort((a, b) => a.last_message.getTime() - b.last_message.getTime())
                        .sort((a, b) => a.sticky ? -1 : b.sticky ? 1 : 0)
                )
            })
            .catch(reject);

    })

}

/**
 * Fetches the messages for a chatroom.
 * @param room_name The name of the chatroom to get
 * @param cursor Message cursor (100 messages per page)
 * @returns Chatroom data
 */
export function get_chatroom(room_name: string, cursor: number = 0): Promise<ChatroomData> {

    const page_count = 50;
    cursor *= page_count;

    return new Promise((resolve, reject) => {

        db.chatRoom.findFirst({ where: { name: room_name } })
            .then(async room => {

                if (!room) return reject("No chatroom exists with that name");

                // Get targeted messages around cursor
                const split = room.messages.split(',')
                    .filter(m => m !== '')
                    .reverse()
                    .map(m => parseInt(m))

                // Get messages
                let messages = await db.chatMessage.findMany({
                    where: {
                        id: {
                            in: split,
                        }
                    },
                })

                let _messages = [...messages];

                // Filter
                messages = messages
                    .filter(m => m.reply === -1)
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .filter((_, i) => i + 2 > cursor && i <= cursor + page_count);

                // Add replies
                messages = messages.concat(
                    _messages
                        .filter(m => m.reply !== -1 && messages.find(m2 => m2.id === m.reply))
                );

                return resolve({
                    name: room_name,
                    messages
                });

            })
            .catch(reject);

    });

}

/**
 * Creates a chat room
 * @param room_name Chatroom name
 * @param user_code User creating the room
 */
export async function create_chatroom(room_name: string, user_code: string): Promise<void> {

    const user = await db.user.findUnique({ where: { id: user_code } });
    if (!user) throw new Error("No user exists with that code");
    if (!hasPermissions(user, 'CREATE_ROOM')) throw new Error("You do not have permission to create a chatroom");

    // TODO: Check for already exiting chatroom

    return new Promise((resolve, reject) => {

        db.chatRoom.create({ data: { name: room_name.replace(/ /g, '_'), messages: '' } })
            .then(() => resolve())
            .catch(reject);

    })

}

/**
 * Creates a message in a chat room
 * @param user_code User creating the message
 * @param room_name Chatroom name
 * @param content Message content
 * @param reply Message to reply to
 */
export async function create_message(user_code: string, room_name: string, content: string, reply?: number): Promise<void> {

    return new Promise(async (resolve, reject) => {

        // Get chat room
        let room = await db.chatRoom.findFirst({ where: { name: room_name } });
        if (!room) return reject("No chatroom exists with that name");

        // Get user
        let user = await db.user.findUnique({ where: { id: user_code } });
        if (!user) return reject("No user exists with that code");

        // Create message
        db.chatMessage.create({
            data: {
                content: content,
                author: user.id,
                reply: reply ?? -1
            }
        })

            .then(message => {

                if (!room) return;

                room.messages += ',' + message.id;
                room.last_message = new Date();

                db.chatRoom.update({
                    where: { id: room.id },
                    data: room
                })

                    .then(() => resolve())
                    .catch(reject);


            })
            .catch(reject);
    });

}

/**
 * Changes the sticky-ness of a chat room (whether or not it will appear at the top)
 * @param room_name Chatroom name
 * @param user_code User making change's code
 * @param sticky New sticky status
 */
export function sticky_chatroom(room_name: string, user_code: string, sticky: boolean): Promise<void> {

    return new Promise(async (resolve, reject) => {

        // Get chat room
        let room = await db.chatRoom.findFirst({ where: { name: room_name } });
        if (!room) return reject("No chatroom exists with that name");

        // Get user
        let user = await db.user.findUnique({ where: { id: user_code } });
        if (!user) return reject("No user exists with that code");
        if (!hasPermissions(user, 'STICKY_ROOM')) return reject("You do not have permission to sticky a chatroom");

        room.sticky = sticky;

        db.chatRoom.update({
            where: { id: room.id },
            data: room
        })

            .then(() => resolve())
            .catch(reject);

    });

}