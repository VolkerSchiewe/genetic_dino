import Controller from './game/controller'
import {Runner} from './game/game'
import {createPopulation, activateDinoBrain, evolvePopulation} from "./genetic_algorithm";

const REQUIRED_FITNESS = 2000;
const JUMP_THRESHOLD = 0.51;
const POPULATION_SIZE = 10;

let generation = 0;
let currentDino = 0;
let population = [];
let fitness = [];

function onDocumentLoad() {
    population = createPopulation(POPULATION_SIZE);
    runGeneration();
}

function runGeneration() {
    generation++;
    currentDino = 0;
    runNext();
}

function runNext() {
    console.log(`${currentDino}  ${population.length}`);
    updateUi();

    if (currentDino < population.length) {
        console.log(`Run dino: ${currentDino}`);
        runDino(population[currentDino], currentDino);
        currentDino++;
    } else {
        naturalSelection();
    }
}

function runDino(brain, number) {
    console.log(`New runner #dino-${number}`);
    let runner = new Runner(`#dino-${number}`);
    let controller = new Controller(runner);

    runner.addMetricsListener((speed, distance, distanceToObstacle, obstacleWidth) => {
        let output = activateDinoBrain(brain, distanceToObstacle, obstacleWidth);

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
    runNext();
}

//TODO: Implement jump/obstacle-ratio into fitness function to breed new bois! 
function naturalSelection() {
    let numberOfSurvivingDinos = 3
    let dinoAiArray = [];
    let survivorIndex = 0;
    let bestFitness = Math.max(...fitness);

    for (let i = 0; i < numberOfSurvivingDinos; i++) {
        survivorIndex = indexOfMaxValue(fitness);
        dinoAiArray[i] = population[survivorIndex];
        fitness[survivorIndex] = 0;
    }
    population = evolvePopulation(dinoAiArray, POPULATION_SIZE);

    if (generation < 4 && bestFitness < REQUIRED_FITNESS) {
        population = createPopulation(POPULATION_SIZE);
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
function updateUi() {
    document.getElementById("generation-title").innerHTML = `Generation: ${generation}, Dino ${currentDino + 1}/${population.length}`;
}

document.addEventListener('DOMContentLoaded', onDocumentLoad);
