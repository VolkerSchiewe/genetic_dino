import React from 'react'
import DinoGame from "./dinoGame.jsx";
import {POPULATION_SIZE} from "./app.jsx";
import Metrics from "./metrics.jsx";

export default class GameContainer extends React.Component {

    render() {
        let list = [];
        for (let i = 0; i <= POPULATION_SIZE; i++) {
            list.push(i);
        }

        return (
            <div>
                {list.map((index)=>{
                    return (
                        <div className="row" key={index}>
                            <div className="col">
                                <DinoGame id={index}/>
                            </div>
                            <div className="col col-lg-2">

                                <Metrics value={this.props.dinoOutputs[index]}/>
                            </div>
                        </div>
                    )
                })}
            </div>
        );
    }
}
