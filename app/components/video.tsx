import { useState, useRef, MouseEvent } from 'react';
import { FaPause, FaPlay } from 'react-icons/fa';

export default function Video({ url }: { url: string }): JSX.Element {

    const video_ref = useRef<HTMLVideoElement>(null);
    const bar_ref = useRef<HTMLDivElement>(null);

    let [playing, setPlaying] = useState(false);
    let [time, setTime] = useState<number>(0);
    let [duration, setDuration] = useState<number>(0);

    setInterval(() => {
        setTime(video_ref.current?.currentTime || 0);
    }, 150)

    const handle_play_pause = (pause: boolean = false) => {
        if (!video_ref.current) return;
        setPlaying(!pause);

        if (pause) {
            video_ref.current.pause();
        } else {
            video_ref.current.play();
            setDuration(video_ref.current.duration);
        }
    }

    const handle_bar = (event: MouseEvent<HTMLDivElement>) => {

        if (!bar_ref.current || !video_ref.current) return;

        const bounds = bar_ref.current.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const percent = (x / bounds.width) * 100;
        const time = (duration / 100) * percent;

        video_ref.current.currentTime = time;

    }

    return (
        <div className="video">

            <video
                ref={video_ref}
                className="video"
                src={url}
                onClick={(e) => {
                    if (video_ref.current && e.target === video_ref.current) {
                        handle_play_pause(playing);
                    }
                }}
            />

            <div className="video-container">
                <div className="controls">
                    {
                        !playing ? <FaPlay onClick={() => handle_play_pause(false)} /> :
                            <FaPause onClick={() => handle_play_pause(true)} />
                    }
                </div>
                <div className="time">
                    <span>
                        {Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)}
                    </span>
                    <div ref={bar_ref} className="bar" onClick={(e) => handle_bar(e)}>
                        <div className="inner" style={{ width: ((time / (duration || 1)) * 100) + '%' }}></div>
                    </div>
                    <span>
                        {Math.floor(duration / 60) + ":" + ("0" + Math.floor(duration % 60)).slice(-2)}
                    </span>
                </div>
            </div>

        </div>
    );

}