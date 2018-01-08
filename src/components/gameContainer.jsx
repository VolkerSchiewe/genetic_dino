import React from 'react'
import {POPULATION_SIZE} from "./app.jsx";
import OutputMetrics from "./outputMetrics.jsx";
import Grid from 'material-ui/Grid';

export default class GameContainer extends React.Component {

    render() {
        let list = [];
        for (let i = 0; i < POPULATION_SIZE; i++) {
            list.push(i);
        }
        return (
            <div>
                <Grid container>
                    <Grid item xs={12}>
                        <div id={'game'} className="game-wrapper"/>
                    </Grid>
                    {list.map((index) => {
                        let output = this.props.dinoOutputs[index];
                        return (
                            <Grid item xs={3} key={index}>
                                <OutputMetrics value={output} id={index}/>
                            </Grid>
                        )
                    })}
                </Grid>
            </div>
        );
    }
}
