import React from 'react'
import Metrics from "./metrics.jsx";

export default class DinoGame extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let value = this.props.dinoOutput;
        let id = this.props.id;

        return (
            <div className="row">
                <div className="col">
                    <div id={'dino-' + id} className="game-wrapper"/>
                </div>
                <div className="col col-lg-2">

                    <Metrics value={value}/>
                </div>
            </div>
        );
    }
}
