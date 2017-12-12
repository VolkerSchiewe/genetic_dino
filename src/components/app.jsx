import React from 'react'
import GameContainer from "./gameContainer.jsx";
import {GeneticAlgorithm} from "../genetic_algorithm";
import {GenerationRunner} from "../generation_runner";
import {indexOfMaxValue} from "../utils";

const REQUIRED_FITNESS = 3000;
export const POPULATION_SIZE = 10;
const SURVIVOR_COUNT = 3;

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            generation: 0,
            maxScore: 0,
            dinoOutputs: [],
        };
    }

    runGeneration(population, geneticAlgorithm) {
        this.setState({
            generation: this.state.generation + 1,
        });
        GenerationRunner.runSingleGeneration(population, (index, output) => {
            let dinoOutputs = this.state.dinoOutputs;
            if (dinoOutputs.length === index)
                dinoOutputs.push(output);
            else
                dinoOutputs[index] = output;
            this.setState({
                dinoOutputs: dinoOutputs,
            })
        })
            .then(fitness => this.naturalSelection(population, fitness, geneticAlgorithm))
            .catch(error => console.log(error));

    }

    naturalSelection(population, fitness, geneticAlgorithm) {
        let dinoAiArray = [];
        let bestFitness = Math.max(...fitness);
        let survivorIndex = 0;
        if (bestFitness > this.state.maxScore) {
            this.setState({
                maxScore: bestFitness,
            });
        }

        for (let i = 0; i < SURVIVOR_COUNT; i++) {
            survivorIndex = indexOfMaxValue(fitness);
            dinoAiArray[i] = population[survivorIndex];
            fitness[survivorIndex] = 0;
        }
        let new_population = geneticAlgorithm.evolvePopulation(dinoAiArray);
        if (this.state.generation < 4 && bestFitness < REQUIRED_FITNESS) {
            new_population = geneticAlgorithm.generatePopulation();
            this.setState({
                generation: 0
            });
        }
        this.runGeneration(new_population, geneticAlgorithm);
    }

    componentDidMount() {
        const geneticAlgorithm = new GeneticAlgorithm(POPULATION_SIZE);
        const population = geneticAlgorithm.generatePopulation();
        this.runGeneration(population, geneticAlgorithm);
    }

    render() {
        const {generation, maxScore, dinoOutputs} = this.state;

        return (
            <div className="container" style={{marginTop: '50px'}}>
                <h1>Generation {generation}</h1>
                Highscore: {maxScore}
                <GameContainer dinoOutputs={dinoOutputs}/>
            </div>
        );
    }
}
