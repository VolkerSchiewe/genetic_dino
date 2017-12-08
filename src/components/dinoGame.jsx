import React from 'react'

export default class DinoGame extends React.Component {

    constructor(props) {
        super(props);
    }
    shouldComponentUpdate(nextProps, nextState){
        return this.props.id !== nextProps.id;
    }
    render() {
        let id = this.props.id;
        return (
            <div id={'dino-' + id} className="game-wrapper"/>

        );
    }
}
