import React from 'react';
import GeneticAlgorithm from '../genetic_algorithm';
import GenerationRunner from '../generation_runner';
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
const SURVIVOR_COUNT = 3;
export const colors = ['#535353', '#E53935', '#D81B60', '#8E24AA', '#1E88E5', '#039BE5', '#43A047', '#FDD835', '#FB8C00', '#6D4C41'];


export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            generation: 0,
            maxScore: 0,
            population: [],
            scoreHistory: [],
            mutationRate: 0.2,
            showMetrics: false,
            bestPopulation: [],
            snackbarOpen: false,
            isGameRunning: false,
        };
        this.geneticAlgorithm = new GeneticAlgorithm(POPULATION_SIZE);
        this.outputs = [];
        for (let i = 0; i < MAPS_COUNT; i++) {
            this.outputs.push([]);
        }

        for (let i = 0; i < MAPS_COUNT; i++) {
            for (let j = this.outputs[i].length; j < POPULATION_SIZE; j++) {
                this.outputs[i].push(0);
            }
        }
        this.onSliderChange = this.onSliderChange.bind(this);
        this.switchShowMetrics = this.switchShowMetrics.bind(this);
        this.exportBestPopulation = this.exportBestPopulation.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.exportGenerationData = this.exportGenerationData.bind(this);
        this.handleStartClick = this.handleStartClick.bind(this);
        this.handleImportClick = this.handleImportClick.bind(this);
    }

    switchShowMetrics() {
        let currentState = !this.state.showMetrics;
        this.setState({showMetrics: currentState});
    }

    exportBestPopulation() {
        let bestPopulation = this.state.bestPopulation;
        if (bestPopulation.length === 0) {
            this.setState({snackbarOpen: true});
            return;
        }
        let text = JSON.stringify(bestPopulation.map((dino) => dino.toJson()));

        download('best_population.json', text, 'data:text/json;charset=utf-8,');
    }

    exportGenerationData() {
        let data = this.state.scoreHistory;
        if (data.length === 0) {
            this.setState({snackbarOpen: true});
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

    handleClose(event, reason) {
        if (reason === 'clickaway')
            return;
        this.setState({snackbarOpen: false});
    }

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


    runGeneration(population) {
        this.setState({
            generation: this.state.generation + 1,
            population: population,
        });
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
                console.log(`All games ended: Fitness: ${fitnessOfAllMaps}`);
                let fitness = this.mergeFitnessOfGames(fitnessOfAllMaps);
                console.log(`Merged fitness: ${fitness}`);
                return this.naturalSelection(population, fitness);
            })
            .catch(error => console.log(error));

    }

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

    naturalSelection(population, fitness) {
        let dinoAiArray = [];
        let bestFitnessOfGeneration = Math.max(...fitness);
        let survivorIndex = 0;
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
            // population = this.state.bestPopulation;
        }

        // sort population
        for (let i = 0; i < SURVIVOR_COUNT; i++) {
            survivorIndex = indexOfMaxValue(fitness);
            dinoAiArray[i] = population[survivorIndex];
            fitness[survivorIndex] = 0;
        }

        let newPopulation = this.geneticAlgorithm.evolvePopulation(dinoAiArray);

        if (this.state.generation < 4 && bestFitnessOfGeneration < REQUIRED_FITNESS) {
            newPopulation = this.geneticAlgorithm.generatePopulation();
            this.setState({
                generation: 0
            });
        }
        this.runGeneration(newPopulation);
    }

    render() {
        const {generation, maxScore, population, scoreHistory, mutationRate, showMetrics, isGameRunning} = this.state;
        const btnText = showMetrics ? 'hide outputs' : 'show outputs';
        return (
            <div>
                <NavBar showMetrics={this.switchShowMetrics}
                    showMetricsText={btnText}
                    exportPopulation={this.exportBestPopulation}
                    exportGeneration={this.exportGenerationData}/>
                <Grid container justify="center">
                    <Grid item xs={12} sm={10}>
                        <Grid container>
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
                                {!isGameRunning &&
                                <div>
                                    <Button raised color="primary" onClick={this.handleStartClick} style={{margin: 5}}>Start
                                        Simulation</Button>
                                    <input
                                        style={{display: 'None'}}
                                        id="raised-button-file"
                                        type="file"
                                        onChange={this.handleImportClick}
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
                    open={this.state.snackbarOpen}
                    autoHideDuration={6000}
                    onClose={this.handleClose}
                    SnackbarContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">Please wait until the first generation finished.</span>}
                />
            </div>
        );
    }
}
