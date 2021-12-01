import { Component, createRef, RefObject, MouseEvent } from "react";

interface PopupState {
    open: boolean;
}

interface PopupProps {
    open?: boolean;
    close?: () => void;
}

export default class Popup extends Component<PopupProps, PopupState> {
  
    scrim: RefObject<HTMLDivElement>;

    constructor(props: PopupProps) {
        super(props);

        this.scrim = createRef();
        this.state = {
            open: props.open ?? false
        }
    }

    static getDerivedStateFromProps(props: PopupProps, state: PopupState) {
        return { 
            open: props.open ?? state.open
        }
    }

    private try_close = (e: MouseEvent<HTMLDivElement>) => {
        if (this.scrim.current && e.target === this.scrim.current && this.props.close) {
            this.props.close();
        }
    }

    render() {

        return !this.state.open ? null : (
            <div className="popup" ref={this.scrim} onClick={(e) => this.try_close(e)}>
                <div className="content">
                    {this.props.children}
                </div>
            </div>
        )

    }

}