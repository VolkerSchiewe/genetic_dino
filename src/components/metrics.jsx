import React from 'react'
import {Bar} from "react-chartjs-2";
import Grid from 'material-ui/Grid';

export default class Metrics extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Grid container >
                {this.props.value !== undefined && this.props.value.map((value, index) => {
                    let label = index === 0 ? 'Jump' : 'Duck';
                    return (
                        <Grid item xs={6} key={index}>
                            <Bar data={{
                                labels: [label],
                                datasets: [
                                    {
                                        data: [value]
                                    }
                                ]
                            }} options={{
                                legend: {
                                    display: false
                                },
                                tooltips: {
                                    enabled: false
                                },
                                scales: {
                                    yAxes: [{
                                        stacked: true,
                                        ticks: {
                                            min: -0.3,
                                            max: 0.3,
                                            stepSize: 0.5,
                                        }
                                    }]
                                }
                            }}/>
                        </Grid>
                    )
                })}
            </Grid>
        );
    }
}
