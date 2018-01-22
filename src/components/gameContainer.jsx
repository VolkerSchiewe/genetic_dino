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

        return (
            <div>
                <Grid container>
                    <Grid item xs={8}>
                        {range(MAPS_COUNT).map((i) => (
                            <div key={i} id={'game-' + (i + 1)} className="game-wrapper"/>
                        ))}
                    </Grid>
                    <Grid item xs={4}>
                            {populationRange.map((index) => {
                                    let isAliveText = 'Dinos alive: ' + population[index].countDinosAlive();
                                    return (
                                        <div key={index} style={{margin:5}}>
                                            <Circle color={colors[index]}/>
                                            <div>{isAliveText}</div>
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
                                        <Grid item xs={2} key={populationIndex}
                                              style={{margin: '10px', minHeight: 150}}>
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
