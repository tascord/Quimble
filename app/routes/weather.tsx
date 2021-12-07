import { Response } from "@remix-run/node";
import { LoaderFunction } from "remix";
import { get_weather } from "~/utils/weather.server";

export let loader: LoaderFunction = async ({ request }) => {

    try {

        const data = await get_weather();

        return new Response(JSON.stringify(data), {
            headers: {
                "Content-Type": "application/json"
            }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: (error as any).message ?? 'Something happened...' }), { headers: { 'Content-Type': 'application/json' } });
    }

};

