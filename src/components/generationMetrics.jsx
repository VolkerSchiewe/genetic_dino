import React from 'react'
import {Line} from "react-chartjs-2";

const colors = ['#F44336', '#9C27B0', '#673AB7', '#00BCD4', '#8BC34A', '#FFC107', '#795548', '#CDDC39', '#009688', '#3F51B5',];

export default class GenerationMetrics extends React.Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.scoreHistory)
            return nextProps.scoreHistory.length !== 0;
        return false
    }

    render() {
        let data = this.props.scoreHistory;
        let datasets = [];
        let labels = [];
        // generate datasets for y-axis
        for (let i = 0; i < data.length; i++) {
            datasets[i] = {
                data: data[i], label: (i + 1) + '. Dino', borderColor: colors[i], fill: false,
            }
        }
        // generate x-axis
        if (data.length > 0) {
            for (let i = 1; i <= data[0].length; i++) {
                labels[i] = i + '.';
            }
        }

        return (
            <div style={{margin: '20px'}}>
                {datasets &&
                <Line data={{
                    labels: labels,
                    datasets: datasets
                }} options={{
                    scales: {
                        yAxes: [{
                            ticks: {
                                suggestedMin: 0,
                            }
                        }]
                    }
                }}/>
                }
            </div>
        );
    }
}
