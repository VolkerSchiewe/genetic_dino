import {Component} from 'react'
import GameContainer from "./gameContainer.jsx";
import {GeneticAlgorithm} from "../genetic_algorithm";
import {GenerationRunner} from "../generation_runner";
import {indexOfMaxValue} from "../utils";

const REQUIRED_FITNESS = 2000;
export const POPULATION_SIZE = 10;
const SURVIVOR_COUNT = 3;

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            generation: 0,
            maxScore: 0,
        };
    }

    runGeneration(population) {
        this.setState({
            generation: this.state.generation + 1,
        });
        GenerationRunner.runSingleGeneration(population)
            .then(fitness => this.naturalSelection(population, fitness))
            .catch(error => console.log(error));

    }

    naturalSelection(population, fitness) {
        console.log(`Performing natural selection`);
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
        let geneticAlgorithm = new GeneticAlgorithm(POPULATION_SIZE);
        population = geneticAlgorithm.evolvePopulation(dinoAiArray);

        if (this.state.generation < 4 && bestFitness < REQUIRED_FITNESS) {
            population = geneticAlgorithm.generatePopulation();
            this.setState({
                generation: 0
            });
            console.log('meteor wiped out unfit dinos, new population was created!')
        }
        this.runGeneration(population);
    }

    componentDidMount() {
        const geneticAlgorithm = new GeneticAlgorithm(POPULATION_SIZE);
        const population = geneticAlgorithm.generatePopulation();
        this.runGeneration(population);
    }

    render() {
        let generation = this.state.generation;
        let highscore = this.state.maxScore;

        return (
            <div className="container" style={{marginTop: '50px'}}>
                <h1>Generation {generation}</h1>
                Highscore: {highscore}
                <GameContainer/>
            </div>
        );
    }
}
