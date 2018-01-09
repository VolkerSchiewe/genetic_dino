import React from 'react'
import GameContainer from "./gameContainer.jsx";
import {GeneticAlgorithm} from "../genetic_algorithm";
import {GenerationRunner} from "../generation_runner";
import {indexOfMaxValue} from "../utils";
import Grid from 'material-ui/Grid';
import Slider from 'rc-slider';
import GenerationMetrics from "./generationMetrics.jsx";
import 'rc-slider/assets/index.css';

const REQUIRED_FITNESS = 75;
export const POPULATION_SIZE = 10;
const SURVIVOR_COUNT = 3;
export const colors = ['#535353', '#E53935', '#D81B60', '#8E24AA', '#1E88E5', '#039BE5', '#43A047', '#FDD835', '#FB8C00', '#6D4C41'];


export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            generation: 0,
            maxScore: 0,
            dinoOutputs: [],
            scoreHistory: [],
            mutationRate: 0.2
        };
        this.geneticAlgorithm = new GeneticAlgorithm(POPULATION_SIZE);
        this.onSliderChange = this.onSliderChange.bind(this)
    }

    onSliderChange(value) {
        value = value/100;
        this.setState({
            mutationRate: value
        });
        if (this.geneticAlgorithm)
            this.geneticAlgorithm.setMutationRate(value);
    }

    runGeneration(population) {
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
            .then(fitness => this.naturalSelection(population, fitness))
            .catch(error => console.log(error));

    }

    naturalSelection(population, fitness) {
        let dinoAiArray = [];
        let bestFitness = Math.max(...fitness);
        let survivorIndex = 0;
        let scoreHistory = this.state.scoreHistory;
        for (let i = 0; i < fitness.length; i++) {
            let dinoFitness = scoreHistory[i];
            if (dinoFitness)
                dinoFitness.push(fitness[i]);
            else
                dinoFitness = [fitness[i]];
            scoreHistory[i] = dinoFitness
        }
        if (bestFitness > this.state.maxScore) {
            this.setState({
                maxScore: bestFitness,
                scoreHistory: scoreHistory,
            });
        }

        for (let i = 0; i < SURVIVOR_COUNT; i++) {
            survivorIndex = indexOfMaxValue(fitness);
            dinoAiArray[i] = population[survivorIndex];
            fitness[survivorIndex] = 0;
        }
        let new_population = this.geneticAlgorithm.evolvePopulation(dinoAiArray);
        if (this.state.generation < 4 && bestFitness < REQUIRED_FITNESS) {
            new_population = this.geneticAlgorithm.generatePopulation();
            this.setState({
                generation: 0
            });
        }
        this.runGeneration(new_population);
    }

    componentDidMount() {
        const population = this.geneticAlgorithm.generatePopulation();
        this.runGeneration(population);
    }

    render() {
        const {generation, maxScore, dinoOutputs, scoreHistory, mutationRate} = this.state;

        return (
            <div style={{marginTop: '50px'}}>
                <Grid container justify="center">
                    <Grid container xs={12} sm={8}>
                        <Grid item xs={5}>
                            <h1>Generation {generation}</h1>
                            Highscore: {maxScore}

                            <div style={{marginTop: 10}}>
                                <label> Mutation Rate: {mutationRate}
                                    <Slider onChange={this.onSliderChange} defaultValue={20}/>
                                </label>
                            </div>

                        </Grid>
                        <Grid item xs={6}>
                            <GenerationMetrics scoreHistory={scoreHistory}/>
                        </Grid>
                        <Grid item xs={12}>
                            <GameContainer dinoOutputs={dinoOutputs}/>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
