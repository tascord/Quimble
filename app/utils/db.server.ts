/* Taken from remix docs */
// https://remix.run/docs/en/v1/tutorials/jokes#set-up-prisma

import { PrismaClient } from "@prisma/client";

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

export type Identity = {
    name: string,
    pronouns: string,
}

export type User = {
    code: string,
    role: 'staff' | 'student' | 'moderator',
    identities: Identity[],
}

export function get_user(code: string): Promise<User> {

    return new Promise((resolve, reject) => {

        db.user.findUnique({ where: { id: code } })
            .then(async (user) => {

                if (user === null) return reject("No user exists with that ID");

                let identities: Identity[] = [];
                for (let identity of user.identities) {
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

                resolve({
                    code: user.id,
                    role: role,
                    identities: identities
                });

            })

            .catch(reject);


    });

}