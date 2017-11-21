import Controller from './game/controller'
import {Runner} from './game/game'
import {GeneticAlgorithm} from "./genetic_algorithm";

const REQUIRED_FITNESS = 2000;
const JUMP_THRESHOLD = 0.51;
const POPULATION_SIZE = 10;

let generation = 0;
let population = [];
let fitness = [];

function onDocumentLoad() {
    let geneticAlgorithm = new GeneticAlgorithm(POPULATION_SIZE);
    population = geneticAlgorithm.generatePopulation();
    runGeneration();
}

function runGeneration() {
    generation++;
    showGeneration();

    for (let currentDino = 0; currentDino < POPULATION_SIZE; currentDino++) {
        console.log(`Start dino ${currentDino}`);
        runDino(population[currentDino], currentDino);
    }
}

function runDino(brain, number) {
    console.log(`New runner #dino-${number}`);
    let runner = new Runner(`#dino-${number}`);
    let controller = new Controller(runner);

    runner.addMetricsListener((speed, distance, distanceToObstacle, obstacleWidth, obstacleHeight) => {
        let output = brain.activateDinoBrain(distanceToObstacle, obstacleWidth);

        if (output > JUMP_THRESHOLD) {
            controller.jump();
        }
    });

    runner.addGameEndListener((distance) => {
        console.log(`Game ended for dino: ${number} with distance: ${distance}`);
        controller.stop();
        onDinoFinished(number, distance);
    });

    controller.start();
}

function onDinoFinished(number, distance) {
    fitness[number] = distance;
    const numberOfDinosFinished = Object.keys(fitness).length;
    console.log(`Dinos finished ${numberOfDinosFinished}`);

    if (numberOfDinosFinished === POPULATION_SIZE) {
        console.log(`Generation finished`);
        naturalSelection();
    }
}

//TODO: Implement jump/obstacle-ratio into fitness function to breed new bois!
function naturalSelection() {
    console.log(`Performing natural selection`);
    let numberOfSurvivingDinos = 3;
    let dinoAiArray = [];
    let survivorIndex = 0;
    let bestFitness = Math.max(...fitness);

    for (let i = 0; i < numberOfSurvivingDinos; i++) {
        survivorIndex = indexOfMaxValue(fitness);
        dinoAiArray[i] = population[survivorIndex];
        fitness[survivorIndex] = 0;
    }
    let geneticAlgorithm = new GeneticAlgorithm(POPULATION_SIZE);
    population = geneticAlgorithm.evolvePopulation(dinoAiArray);

    if (generation < 4 && bestFitness < REQUIRED_FITNESS) {
        population = geneticAlgorithm.generatePopulation();
        generation = 0;
        console.log('meteor wiped out unfit dinos, new population was created!')
    }
    fitness = [];
    runGeneration();
}

// TODO: Extract to utility file
function indexOfMaxValue(array) {
    return array.reduce(function (indexOfMax, element, index, array) {
        return element > array[indexOfMax] ? index : indexOfMax
    }, 0);
}

// TODO: Extract to other file
function showGeneration() {
    document.getElementById('generation-title').innerHTML = `Generation: ${generation}`;
}

document.addEventListener('DOMContentLoaded', onDocumentLoad);
