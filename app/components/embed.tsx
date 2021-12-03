import { useEffect, useState } from "react";

interface EmbedProps {
    url: string;
};

type EmbedData = {
    description?: string;
    image?: string;
    title?: string;
    url?: string;
    loading: boolean | null;
}


// State is either EmbedData or Loading Status
export default function Embed({ url }: { url: string }) {

    const [data, setData] = useState<EmbedData>({ loading: false });

    useEffect(() => {

        if(data.loading) return;
        setData({ loading: true });

        fetch(`/embed?url=${url}`)
            .then(res => res.json())
            .then(res => {
                setData({ ...res, loading: false });
            })
            .catch(() => {
                setData({ loading: null });
            });

        return;

    }, [])

    if (data.loading === true) return (
        <div className="embed loading">
            <div className="header" />
            <div className="text">
                <h2> <span className="opacity-0">.</span> </h2>
                <p />
                <a />
            </div>
        </div>
    );

    if (!data.title || !data.description || data.loading === null) return null;

    return (
        <div className="embed" title={data.title}>
            <a className="header" href={url} target='_blank'>
                <div className="header" style={{ backgroundImage: `url("${data.image ?? 'https://source.unsplash.com/random/1080x720?gradient'}")` }} />
            </a>
            <div className="text">
                <h2>
                    <a href={url} target='_blank'>
                        {data.title}
                    </a>
                </h2>
                <p>{data.description}</p>
                <a target='_blank' href={data.url ?? url}>{data.url ?? url}</a>
            </div>
        </div >
    );

}