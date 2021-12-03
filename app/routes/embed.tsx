import { Response } from "@remix-run/node";
import { LoaderFunction } from "remix";
import { embed } from "~/utils/embed.server";

export let loader: LoaderFunction = async ({ request }) => {

    let fragments = new URLSearchParams(request['url'].split('?').slice(1).join('?'));
    if (!fragments.has('url')) {
        return new Response(JSON.stringify({ error: "No URL provided" }), { headers: { 'Content-Type': 'application/json' } });
    }

    try {

        const data = await embed(fragments.get('url') ?? 'https://google.com')
        return new Response(JSON.stringify(data), {
            headers: {
                "Content-Type": "application/json"
            }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: (error as any).message ?? 'Something happened...' }), { headers: { 'Content-Type': 'application/json' } });
    }

};

