import React from 'react'
import {Bar} from "react-chartjs-2";

export default class OutputMetrics extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let value = this.props.value;

        return (
            <div style={{margin: '20px'}}>
                {value &&
                <Bar data={{
                    labels: ['Jump', 'Duck'],
                    datasets: [
                        {
                            data: value,
                            backgroundColor: [
                                '#F44336',
                                '#03A9F4',
                            ],
                        }
                    ]
                }} options={{
                    title: {
                        display: true,
                        text: 'Output',
                    },
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
                }}
                />
                }
            </div>
        );
    }
}
