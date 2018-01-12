import React from 'react'
import OutputMetrics from "./outputMetrics.jsx";
import Grid from 'material-ui/Grid';

export default class GameContainer extends React.Component {

    render() {
        let list = [];
        for (let i = 0; i < this.props.dinoOutputs.length; i++) {
            list.push(i);
        }
        return (
            <div>
                <Grid container>
                    <Grid item xs={12}>
                        <div id={'game'} className="game-wrapper"/>
                    </Grid>
                    {this.props.showMetrics &&
                    list.map((index) => {
                        let output = this.props.dinoOutputs[index].output;
                        let is_alive = this.props.dinoOutputs[index].is_alive;
                        return (
                            <Grid item xs={3} key={index}>
                                {is_alive ?
                                    (<OutputMetrics value={output} id={index}/>) :
                                    (<div>Dead</div>)}
                            </Grid>
                        )
                    })
                    }
                </Grid>
            </div>
        );
    }
}
