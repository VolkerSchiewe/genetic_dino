import {Component} from 'react'

export default class Metrics extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
           <div>{this.props.value}</div>
        );
    }
}
