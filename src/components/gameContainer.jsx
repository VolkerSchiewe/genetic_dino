import React from 'react'
import OutputMetrics from "./outputMetrics.jsx";
import Grid from 'material-ui/Grid';
import {Circle} from './circle.jsx'
import {colors} from "./app.jsx";

export default class GameContainer extends React.Component {

    render() {
        const {id, showMetrics, dinoOutputs} = this.props;

        let list = [];
        for (let i = 0; i < dinoOutputs.length; i++) {
            list.push(i);
        }
        let floatStyle = {
            float: 'left',
            marginRight: 20,
        };
        return (

            <div>
                <Grid container>
                    <Grid item xs={12}>
                        <div id={id} className="game-wrapper"/>
                    </Grid>

                    <Grid item xs={12}>
                        {list.map((index) => {
                                let is_alive = dinoOutputs[index].is_alive;
                                return (
                                    <div key={index}>
                                        <Circle color={colors[index]}/>
                                        {is_alive ?
                                            (<div style={floatStyle}>Alive</div>) :
                                            (<div style={floatStyle}>Dead</div>)
                                        }
                                    </div>
                                )
                            }
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            {list.map((index) => {
                                let output = dinoOutputs[index].output;
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
