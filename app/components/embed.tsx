import { Component } from "react";

interface EmbedState {
    description?: string;
    image?: string;
    title?: string;
    url?: string;
    loading: boolean;
}

interface EmbedProps {
    url: string;
};

// State is either EmbedData or Loading Status
export default class Embed extends Component<{ url: string }, EmbedState> {

    constructor(props: any) {
        super(props);
        this.state = { loading: true };
    }

    componentDidMount() {

        // TODO: Web Crawl Page Meta

    }

    render() {

        const image_data = this.state;
        const url = this.props.url;

        if (image_data.loading) return (
            <div className="embed loading">
                <div className="header" />
                <div className="text">
                    <h2> <span className="opacity-0">.</span> </h2>
                    <p />
                    <a />
                </div>
            </div>
        );

        return (
            <div className="embed">
                <a className="header" href={url} target='_blank'>
                    <div className="header" style={{ backgroundImage: `url("${image_data.image ?? 'https://source.unsplash.com/random/1080x720?gradient'}")` }} />
                </a>
                <div className="text">
                    <h2>
                        <a href={url} target='_blank'>
                            {image_data.title}
                        </a>
                    </h2>
                    <p>{image_data.description}</p>
                    <a target='_blank' href={image_data.url ?? url}>{image_data.url ?? url}</a>
                </div>
            </div >
        );

    }
}