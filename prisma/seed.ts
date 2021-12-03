import { PrismaClient, Identity } from '@prisma/client';
import Users from './users.json';

// Connect to the database
const database = new PrismaClient();

// Resource data
const Resources = [
    {
        url: 'https://soyourkidistrans.carrd.co/',
        tags: ['trans']
    },
    {
        url: 'https://pflag.org/ourtranslovedones/',
        tags: ['trans']
    },
    {
        url: 'https://textuploader.com/58uqp/',
        tags: ['coming out']
    },
    {
        url: 'https://docs.google.com/document/d/1-lXWInQ0wjDa0rTV942lGM3C16gDkqAG5sYpn-lJKkY/',
        tags: ['queer']
    },
    {
        url: 'https://www.transhub.org.au/',
        tags: ['trans']
    },
    {
        url: 'http://www.acceptingdad.com/2013/08/05/to-the-unicorns-dad/',
        tags: ['trans']
    }
];

// Main wrapper for async/await
async function seed() {

    // Keep track of how many users we've created (or skipped)
    let user_index = 0;
    let resource_index = 0;

    // Console update task
    const update_users = (user: string) => {
        user_index++;
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(`Seeding ${Users.length} users to the database. [Added ${user} :: ${Math.round(user_index / Users.length * 100)}%]`)
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
        update_users(user.name);

        // Delay to prevent database overload
        await new Promise(resolve => setTimeout(resolve, 150));

    }

    // Console cleanup
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write('Seeded all users successfully!\n');

    // Console update task
    const update_resources = () => {
        resource_index++;
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(`Seeding ${Resources.length} users to the database. [${Math.round(resource_index / Resources.length * 100)}%]`)
    }

    // Resource creation task
    for (const resource of Resources) {

        // Create the resource
        await database.resource.create({
            data: {
                url: resource.url,
                tags: resource.tags.join(',')
            }
        })

        // Update progress message
        update_resources();

        // Delay to prevent database overload
        await new Promise(resolve => setTimeout(resolve, 150));

    }

    // Console cleanup
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write('Seeded all resources successfully!\n');

    // All done!
    console.log(`Seed complete!`);

}

// Call main function
seed();