import React from 'react'
import OutputMetrics from "./outputMetrics.jsx";
import Grid from 'material-ui/Grid';
import {Circle} from './circle.jsx'
import {colors} from "./app.jsx";
import {range} from "../utils.js";
import {MAPS_COUNT} from "./app.jsx";

export default class GameContainer extends React.Component {

    render() {
        const {showMetrics, population} = this.props;

        let list = range(population.length);


        let floatStyle = {
            float: 'left',
            marginRight: 20,
        };
        return (
            <div>
                <Grid container>
                    {range(MAPS_COUNT).map((i)=>(
                        <Grid key={i} item xs={12}>
                            <div id={'game-' + (i + 1)} className="game-wrapper"/>
                        </Grid>
                    ))}

                    <Grid item xs={12}>
                        {list.map((index) => {
                                let isAliveText = 'Dinos alive: ' + population[index].isAlive;
                                return (
                                    <div key={index}>
                                        <Circle color={colors[index]}/>
                                        <div style={floatStyle}>{isAliveText}</div>
                                    </div>
                                )
                            }
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            {list.map((index) => {
                                let output = population[index].output;
                                return (
                                    <Grid item xs={2} key={index} style={{margin: '10px', minHeight: 150}}>
                                        {showMetrics &&
                                        <OutputMetrics value={output} id={index}/>
                                        }
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
