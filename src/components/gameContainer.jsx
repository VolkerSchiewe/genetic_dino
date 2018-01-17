import React from 'react'
import OutputMetrics from "./outputMetrics.jsx";
import Grid from 'material-ui/Grid';
import {Circle} from './circle.jsx'
import {colors} from "./app.jsx";
import {range} from "../utils.js";
import {MAPS_COUNT} from "./app.jsx";

export default class GameContainer extends React.Component {

    render() {
        const {population, outputs, showMetrics} = this.props;

        let populationRange = range(population.length);

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
                        {populationRange.map((index) => {
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
                    {range(MAPS_COUNT).map((mapIndex) => (
                        <Grid item xs={12} key={mapIndex}>
                            <Grid container>
                                {populationRange.map((populationIndex) => {
                                    let output = outputs[mapIndex][populationIndex];
                                    return (
                                        <Grid item xs={2} key={populationIndex} style={{margin: '10px', minHeight: 150}}>
                                            {showMetrics &&
                                            <OutputMetrics value={output} id={populationIndex}/>
                                            }
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
            </div>
        );
    }
}
