import React from 'react';
import GeneticAlgorithm from '../geneticAlgorithm';
import GenerationRunner from '../generationRunner';
import {indexOfMaxValue, range} from '../utils';
import Grid from 'material-ui/Grid';
import Slider from 'rc-slider';
import GenerationMetrics from './metrics/generationMetrics';
import 'rc-slider/assets/index.css';
import Snackbar from 'material-ui/Snackbar';
import {download} from '../utils';
import NavBar from './layout/NavBar';
import Button from 'material-ui/Button';
import GameContainer from './layout/gameContainer';

const REQUIRED_FITNESS = 100;
export const POPULATION_SIZE = 10;
export const MAPS_COUNT = 3;
const SURVIVOR_COUNT = 4;
const MIN_MUTATION_RATE = 0.2;
const MAX_MUTATION_RATE = 0.5;
const MUTATION_RATE_INCREASE = 0.05;
export const colors = ['#535353', '#E53935', '#D81B60', '#8E24AA', '#1E88E5', '#039BE5', '#43A047', '#FDD835', '#FB8C00', '#6D4C41'];


// Base Component that contains all other component and contains most of the logic
export default class App extends React.Component {
    constructor(props) {
        super(props);
        // set default state values
        this.state = {
            generation: 0,
            maxScore: 0,
            population: [],
            scoreHistory: [],
            mutationRate: MIN_MUTATION_RATE,
            showMetrics: false,
            bestPopulation: [],
            snackBarOpen: false,
            snackBarMessage: '',
            isGameRunning: false,
        };

        this.geneticAlgorithm = new GeneticAlgorithm(POPULATION_SIZE);

        // create output array with MAPS as rows and POPULATION_SIZE as columns
        this.outputs = [];
        for (let i = 0; i < MAPS_COUNT; i++) {
            this.outputs.push([]);
        }

        for (let i = 0; i < MAPS_COUNT; i++) {
            for (let j = this.outputs[i].length; j < POPULATION_SIZE; j++) {
                this.outputs[i].push(0);
            }
        }
    }

    // handler to display or hide dinosaur outputs
    switchShowMetrics() {
        let currentState = !this.state.showMetrics;
        this.setState({showMetrics: currentState});
    }

    // initialize download of best population as json
    exportBestPopulation() {
        let bestPopulation = this.state.bestPopulation;
        if (bestPopulation.length === 0) {
            this.setState({snackBarOpen: true, snackBarMessage: 'Please wait until the first generation finished.'});
            return;
        }
        let text = JSON.stringify(bestPopulation.map((dino) => dino.toJson()));

        download('best_population.json', text, 'data:text/json;charset=utf-8,');
    }

    // initialize download of the generation data as csv (score history over all generations)
    exportGenerationData() {
        let data = this.state.scoreHistory;
        if (data.length === 0) {
            this.setState({snackBarOpen: true, snackBarMessage: 'Please wait until the first generation finished.'});
            return;
        }
        //generate headers
        let headers = [];
        for (let i = 0; i < data[0].length; i++) {
            headers.push((i + 1) + '. Generation');
        }
        //write header
        let csvFile = '';
        csvFile += headers.join(',') + '\n';
        for (let row of data) {
            csvFile += row.join(',') + '\n';
        }
        download('generation_data.csv', csvFile, 'data:text/csv;charset=utf-8,');
    }

    // snackBar close handler
    handleClose(event, reason) {
        if (reason === 'clickaway')
            return;
        this.setState({snackBarOpen: false});
    }

    // handle slider changes and apply new mutation rate
    onSliderChange(value) {
        value = value / 100;
        this.setState({
            mutationRate: value
        });
        if (this.geneticAlgorithm)
            this.geneticAlgorithm.setMutationRate(value);
    }

    handleStartClick() {
        this.setState({
            isGameRunning: true
        });
        const population = this.geneticAlgorithm.generatePopulation();
        this.runGeneration(population);
    }

    // handle imported file and recreate the containing population and start the simulation
    handleImportClick(event) {
        this.setState({
            isGameRunning: true
        });
        let file = event.target.files[0];
        let r = new FileReader();
        r.onload = (e) => {
            let content = e.target.result;
            let jsonContent = JSON.parse(content);
            const population = this.geneticAlgorithm.generatePopulation(jsonContent);
            this.runGeneration(population);
        };
        r.readAsText(file);

    }

    // run a generation on different maps and initialize fitness merging and natural selection after all dinosaurs crashed
    runGeneration(population) {
        this.setState({
            generation: this.state.generation + 1,
            population: population,
        });
        // resolves when all internal Promises are resolved
        Promise.all(range(MAPS_COUNT).map((mapIndex) => {
                return GenerationRunner.runSingleGeneration(mapIndex + 1, population, (i, output) => {
                    if (this.state.showMetrics) {
                        this.outputs[mapIndex][i] = output;
                        this.forceUpdate();
                    }
                }, (i) => {
                    if (population[i].isAlive[mapIndex] > 0) {
                        population[i].isAlive[mapIndex] = 0;
                    } else {
                        // debugger;
                    }
                    this.setState({
                        population: population,
                    });
                });
            }
        ))
            .then(fitnessOfAllMaps => {
                let fitness = this.mergeFitnessOfGames(fitnessOfAllMaps);
                return this.naturalSelection(population, fitness);
            })
            .catch(error => console.log(error));

    }

    // merge the fitness of all dinos by calculation the mean for each dino on all maps
    mergeFitnessOfGames(fitnessOfMultipleMaps) {
        let numberOfGames = fitnessOfMultipleMaps.length;
        let numberOfDinosInGeneration = fitnessOfMultipleMaps[0].length;
        let fitness = [];

        for (let i = 0; i < numberOfDinosInGeneration; i++) {
            fitness[i] = 0;

            for (let k = 0; k < numberOfGames; k++) {
                fitness[i] += fitnessOfMultipleMaps[k][i];
            }
            fitness[i] = fitness[i] / numberOfGames;
        }
        return fitness;
    }

    // check if the population is not improving based on the last high scores
    gameIsStagnating(generations, latestMaxScore) {
        let maxOfLastGenerations = this.getMaxFromLastGenerations(generations);
        let sum = 0;

        for (let i = 0; i < maxOfLastGenerations.length; i++) {
            sum += maxOfLastGenerations[i];
        }

        let mean = sum / maxOfLastGenerations.length;
        return (latestMaxScore - mean) < 0;
    }

    // return the maximum scores of the last n generations in an array
    getMaxFromLastGenerations(n) {
        let history = this.state.scoreHistory;
        let generations = [];
        let endGeneration = (history[0].length - 1);
        let startGeneration = Math.max(endGeneration - n, 0);

        for (let j = endGeneration; j >= startGeneration; j--) {
            let generation = [];

            for (let i = 0; i < history.length; i++) {
                generation.push(history[i][j]);
            }
            generations.push(Math.max(...generation));
        }
        return generations;
    }

    naturalSelection(population, fitness) {
        let dinoAiArray = [];
        let bestFitnessOfGeneration = Math.max(...fitness);
        let survivorIndex = 0;

        // saving the new high scores to the score history
        let scoreHistory = this.state.scoreHistory;
        for (let i = 0; i < fitness.length; i++) {
            let dinoFitness = scoreHistory[i];
            if (dinoFitness)
                dinoFitness.push(fitness[i]);
            else
                dinoFitness = [fitness[i]];
            scoreHistory[i] = dinoFitness;
        }
        if (bestFitnessOfGeneration > this.state.maxScore) {
            this.setState({
                maxScore: bestFitnessOfGeneration,
                scoreHistory: scoreHistory,
                bestPopulation: population
            });
        } else {
            this.setState({
                scoreHistory: scoreHistory,
            });
        }

        // increase mutation rate if the game is stagnation
        if (this.gameIsStagnating(5, bestFitnessOfGeneration)
            && this.state.mutationRate
            <= MAX_MUTATION_RATE
            && this.state.generation > 4) {
            let mutationRate = this.state.mutationRate + MUTATION_RATE_INCREASE;
            this.setState({
                mutationRate: mutationRate,
                snackBarOpen: true,
                snackBarMessage: `Population is stagnating, increasing mutation rate by ${MUTATION_RATE_INCREASE}.`
            });
        } else {
            this.setState({
                mutationRate: MIN_MUTATION_RATE
            });
        }

        if (this.geneticAlgorithm)
            this.geneticAlgorithm.setMutationRate(this.state.mutationRate);

        // sort population
        for (let i = 0; i < SURVIVOR_COUNT; i++) {
            survivorIndex = indexOfMaxValue(fitness);
            dinoAiArray[i] = population[survivorIndex];
            fitness[survivorIndex] = 0;
        }

        // bred new population based on genetic algorithms (geneticAlgorithm.js)
        let newPopulation = this.geneticAlgorithm.evolvePopulation(dinoAiArray);

        // kill generation and generate new random one if required fitness is not reached
        if (this.state.generation < 4 && bestFitnessOfGeneration < REQUIRED_FITNESS) {
            newPopulation = this.geneticAlgorithm.generatePopulation();
            this.setState({
                generation: 0,
                snackBarOpen: true,
                snackBarMessage: 'Required fitness not reached. A new random population has been created.'
            });
        }
        this.runGeneration(newPopulation);
    }

    render() {
        const {generation, maxScore, population, scoreHistory, mutationRate, showMetrics, isGameRunning, snackBarOpen, snackBarMessage} = this.state;
        const btnText = showMetrics ? 'hide outputs' : 'show outputs';
        return (
            <div>
                <NavBar showMetrics={() => this.switchShowMetrics()}
                        showMetricsText={btnText}
                        exportPopulation={() => this.exportBestPopulation()}
                        exportGeneration={() => this.exportGenerationData()}/>
                <Grid container justify="center">
                    <Grid item xs={12} sm={10}>
                        <Grid container>
                            <Grid item xs={5}>
                                <h1>Generation {generation}</h1>
                                Highscore: {maxScore}

                                <div style={{marginTop: 10}}>
                                    <label> Mutation Rate: {mutationRate}
                                        <Slider onChange={(value) => this.onSliderChange(value)} defaultValue={20}/>
                                    </label>
                                </div>

                            </Grid>
                            <Grid item xs={6}>
                                <GenerationMetrics scoreHistory={scoreHistory}/>
                            </Grid>
                            <Grid item xs={12}>
                                {!isGameRunning &&
                                <div>
                                    <Button raised color="primary" onClick={() => this.handleStartClick()}
                                            style={{margin: 5}}>Start
                                        Simulation</Button>
                                    <input
                                        style={{display: 'None'}}
                                        id="raised-button-file"
                                        type="file"
                                        onChange={(event) => this.handleImportClick(event)}
                                    />
                                    <label htmlFor="raised-button-file">
                                        <Button raised component="span" style={{margin: 5}}>
                                            Import Population
                                        </Button>
                                    </label></div>
                                }
                                <GameContainer population={population} outputs={this.outputs}
                                               showMetrics={showMetrics}/>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={snackBarOpen}
                    autoHideDuration={6000}
                    onClose={(event, reason) => this.handleClose(event, reason)}
                    SnackbarContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{snackBarMessage}</span>}
                />
            </div>
        );
    }
}
