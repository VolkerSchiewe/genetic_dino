import {Component} from 'react'
import DinoGame from "./dinoGame.jsx";
import {POPULATION_SIZE} from "./app.jsx";

export default class GameContainer extends Component {

    render() {
        let list = [];
        for (let i = 0; i <= POPULATION_SIZE; i++) {
            list.push(i);
        }

        return (
            <div>
                {list.map((index)=>{
                    return (
                        <DinoGame key={index} dinoOutput={this.props.dinoOutputs[index]} id={index}/>
                    )
                })}
            </div>
        );
    }
}
