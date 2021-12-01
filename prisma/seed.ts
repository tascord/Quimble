import { PrismaClient, Identity } from '@prisma/client';
import Users from './users.json';

// Connect to the database
const database = new PrismaClient();

// Main wrapper for async/await
async function seed() {

    // Keep track of how many users we've created (or skipped)
    let index = 0;

    // Console update task
    const update = (user: string) => {
        index++;
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(`Seeding ${Users.length} users to the database. [Added ${user} :: ${Math.round(index / Users.length * 100)}%]`)
    }

    // Starting message
    console.log(`Starting to seed ${Users.length} users...`)

    // Create user task
    const create_user = (user: typeof Users[number]) => new Promise<void>(async (resolve, reject) => {

        // Fetch user from database
        let current = await database.user.findFirst({
            where: {
                id: user.id
            }
        });

        // User already exists
        if (current !== null) return resolve();

        // Create the four identities in the most scuffed way I have seen.
        let identities: Identity[] = [];

        // Create four identities in a job system to await creation
        await Array(4).fill(null).map(() => new Promise<void>((resolve, reject) => {
            database.identity.create({ data: { name: user.name, pronouns: 'Unknown' } })
                .then(i => {
                    identities.push(i);
                    resolve();
                })
                .catch(reject)
        }))
            .reduce((p, task) => p.then(() => task), Promise.resolve());

        // Create a user in the database
        database.user.create({
            data: {
                name: user.name,
                id: user.id,
                role: user.type,
                identities: identities.map(i => i.id).join(','),
            }
        })
            .then(() => { resolve(); })
            .catch(reject)

    });

    // Loop through all user's tasks completing them sequentially
    for (const user of Users) {

        // Perform the task
        await create_user(user);

        // Update progress message
        update(user.name);

        // Delay to prevent database overload
        await new Promise(resolve => setTimeout(resolve, 150));

    }

    // All done!
    console.log(`\nSeed complete!`);

}

// Call main function
seed();