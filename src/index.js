import Controller from './game/controller'
import {Runner} from './game/game'
import {createDinoBrain, activateDinoBrain, crossOver, spawnBestBois} from "./genetic_algorithm";

let generation = 0;
let currentDino = 0;
let populationSize = 5;
let population = [];
let fitness = [];

function onDocumentLoad() {
    population = createPopulation(populationSize);
    runGeneration();
}

function createPopulation(populationSize) {
    let population = [];

    for (let i = 0; i < populationSize; i++) {
        population.push(createDinoBrain(2, 5, 1));
    }

    return population;
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
        // Evaluate generation after all Dinos finished.
        evaluatePopulation(population, fitness);
    }
}

function runDino(brain, number) {
    let runner = new Runner('.interstitial-wrapper');
    let controller = new Controller(runner);

    runner.addMetricsListener((speed, distance, distanceToObstacle, obstacleWidth) => {
        let output = activateDinoBrain(brain, distanceToObstacle, obstacleWidth);
        // console.log(`speed: ${speed}, distance: ${distance}, distanceToObstacle: ${distanceToObstacle}, obstacleWidth ${obstacleWidth}`);
        if (output > 0.50) {
            controller.jump();
        }
    });

    runner.addGameEndListener((distance) => {
        console.log(`Game ended for dino: ${number} with distance: ${distance}`);
        controller.stop()
        // console.log(`Game ended for dino: ${number} with distance: ${distance}`);
        onDinoFinished(number, distance);
    });

    // console.log(`Game started for dino: ${number} with brain: ${brain}`);
    controller.start();
}

function onDinoFinished(number, distance) {
    fitness[number] = distance;
    runNext();
}

function evaluatePopulation(population, fitness) {

    // returns the index of max value in fitness
    let indexOfBestBoi = fitness.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
    // poor mans way to find the second best boi in fitness
    fitness[indexOfBestBoi] = 0;
    let indexOf2ndBestBoi = fitness.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);

    // disregard bad bitches and acquire best genomes
    let bestBoiEmbryo = crossOver(population[indexOfBestBoi], population[indexOf2ndBestBoi])
    console.log(`Fitness ${fitness}`);

    // TODO: Calculate new population...
    population = spawnBestBois(bestBoiEmbryo, populationSize);

    // TODO: Clear fitness values
    fitness = [];

    // TODO: Start new run with runNext()
    console.log('start next iteration');
    runGeneration();
}

function updateUi() {
    let text = `Generation: ${generation}, Dino ${currentDino + 1}/${population.length}`;
    document.getElementById("generation-title").innerHTML = text;
}

document.addEventListener('DOMContentLoaded', onDocumentLoad);
