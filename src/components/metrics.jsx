import React from 'react'
import {Bar} from "react-chartjs-2";

export default class Metrics extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div>
                <div>
                    <Bar data={{
                        labels: ["Output"],
                        datasets: [
                            {
                                data: [this.props.value,]
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
                                    min: 0.4,
                                    max: 0.6,
                                    stepSize: 0.1,
                                }

                            }]
                        }
                    }}/>
                </div>
            </div>

        );
    }
}
