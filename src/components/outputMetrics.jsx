import React from 'react'
import {Bar} from "react-chartjs-2";
import {colors} from "./app.jsx";

export default class OutputMetrics extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {value, id} = this.props;
        let color = colors[id];
        return (
            <div style={{margin: '10px', minHeight:150}}>
                {value &&
                <Bar data={{
                    labels: ['Jump', 'Duck'],
                    datasets: [
                        {
                            data: value,
                            backgroundColor: [
                                color,
                                color,
                            ],
                        }
                    ]
                }} options={{
                    animation:{
                        duration: 0,
                    },
                    title: {
                        display: true,
                        text: 'Output ' + (id + 1),
                    },
                    legend: {
                        display: false
                    },
                    tooltips: {
                        enabled: false
                    },
                    scales: {
                        yAxes: [{
                            barThickness: 0.1,
                            stacked: true,
                            ticks: {
                                min: -0.3,
                                max: 0.3,
                                stepSize: 0.1,
                            }
                        }],
                        xAxes: [{
                            barPercentage: 0.7,
                            categoryPercentage: 1
                        }]
                    }
                }}
                />
                }
            </div>
        );
    }
}
