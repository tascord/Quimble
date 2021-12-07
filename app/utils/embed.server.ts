/* Fetches meta data from an external site */

import fetch from "node-fetch";
import { load } from "cheerio";

type EmbedData = {
    description?: string;
    image?: string;
    title?: string;
    url?: string;
}

export function embed(url: string): Promise<EmbedData> {

    return new Promise((resolve, reject) => {

        fetch(url)
            .then(res => res.text())
            .then(html => {

                const $ = load(html);

                const title = $('meta[property="og:title"]').attr('content') || $('meta[name="twitter:title"]').attr('content') || $('meta[name="title"]').attr('content') || $('title').text()
                const description = $('meta[property="og:description"]').attr('content') || $('meta[name="twitter:description"]').attr('content') || $('meta[name="description"]').attr('content')
                const url = $('meta[property="og:url"]').attr('content') || $('meta[name="twitter:url"]').attr('content');
                const image = $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content') || $('meta[property="og:image:url"]').attr('content');

                resolve({
                    title,
                    description,
                    image,
                    url,
                });

            })
            .catch(err => reject(err));

    });

};