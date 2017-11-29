import React from 'react'
import Metrics from "./metrics.jsx";

export default class DinoGame extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let dino = this.props.dino;
        let id = this.props.id;

        return (
            <div className="row">
                <div className="col">
                    <div id={'dino-' + id} className="game-wrapper"/>
                </div>
                <div className="col col-lg-2">

                    <Metrics dino={dino}/>
                </div>
            </div>
        );
    }
}
