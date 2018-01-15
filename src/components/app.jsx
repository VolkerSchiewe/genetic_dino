import React from 'react'
import GameContainer from "./gameContainer.jsx";
import {GeneticAlgorithm} from "../genetic_algorithm";
import {GenerationRunner} from "../generation_runner";
import {indexOfMaxValue} from "../utils";
import Grid from 'material-ui/Grid';
import Slider from 'rc-slider';
import GenerationMetrics from "./generationMetrics.jsx";
import 'rc-slider/assets/index.css';
import Button from 'material-ui/Button';

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
            dinos: [],
            scoreHistory: [],
            mutationRate: 0.2,
            showMetrics: false
        };
        this.geneticAlgorithm = new GeneticAlgorithm(POPULATION_SIZE);
        this.onSliderChange = this.onSliderChange.bind(this);
        this.buttonClick = this.buttonClick.bind(this);
    }

    buttonClick() {
        let currentState = !this.state.showMetrics;
        this.setState({showMetrics: currentState});
    }

    onSliderChange(value) {
        value = value / 100;
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

        Promise.all([GenerationRunner.runSingleGeneration('#game', population, () => {
            // this.setState({
            //     dinos: population,
            // })
        }), GenerationRunner.runSingleGeneration('#game-2', population, () => {
            // this.setState({
            //     dinos: population,
            // })
        })])
            .then(fitnessOfAllMaps => {
                console.log(`All games ended: Fitness: ${fitnessOfAllMaps}`);
                var fitness = this.mergeFitnessOfGames(fitnessOfAllMaps);
                console.log(`Merged fitness: ${fitness}`);
                return this.naturalSelection(population, fitness);
            })
            .catch(error => console.log(error));

    }

    mergeFitnessOfGames(fitnessOfMultipleMaps) {
        var numberOfGames = fitnessOfMultipleMaps.length;
        var numberOfDinosInGeneration = fitnessOfMultipleMaps[0].length;
        var fitness = [];

        for (var i = 0; i < numberOfDinosInGeneration; i++) {
            fitness[i] = 0;

            for (var k = 0; k < numberOfGames; k++) {
                fitness[i] += fitnessOfMultipleMaps[k][i];
            }
            fitness[i] = fitness[i] / numberOfGames;
        }
        return fitness;
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
        const {generation, maxScore, dinos, scoreHistory, mutationRate, showMetrics} = this.state;
        return (
            <div style={{marginTop: '50px'}}>
                <Grid container justify="center">
                    <Grid item xs={12} sm={8}>
                        <Grid container>
                            <Grid item xs={5}>
                                <h1>Generation {generation}</h1>
                                Highscore: {maxScore}

                                <div style={{marginTop: 10}}>
                                    <label> Mutation Rate: {mutationRate}
                                        <Slider onChange={this.onSliderChange} defaultValue={20}/>
                                    </label>
                                </div>
                                <div>
                                    <Button raised onClick={this.buttonClick}>
                                        Show Outputs
                                    </Button>
                                </div>

                            </Grid>
                            <Grid item xs={6}>
                                <GenerationMetrics scoreHistory={scoreHistory}/>
                            </Grid>
                            <Grid item xs={12}>
                                <GameContainer id={'game'} dinoOutputs={dinos} showMetrics={showMetrics}/>

                                <GameContainer id={'game-2'} dinoOutputs={dinos} showMetrics={showMetrics}/>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
