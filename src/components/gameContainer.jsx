import React from 'react'
import DinoGame from "./dinoGame.jsx";
import {POPULATION_SIZE} from "./app.jsx";
import Metrics from "./metrics.jsx";
import Grid from 'material-ui/Grid';

export default class GameContainer extends React.Component {

    render() {
        let list = [];
        for (let i = 0; i < POPULATION_SIZE; i++) {
            list.push(i);
        }
        return (
            <div>
                {list.map((index)=>{
                    return (
                        <Grid container key={index}>
                            <Grid item xs={10}>
                                <DinoGame id={index}/>
                            </Grid>
                            <Grid item xs={2}>
                                <Metrics value={this.props.dinoOutputs[index]}/>
                            </Grid>
                        </Grid>
                    )
                })}
            </div>
        );
    }
}
