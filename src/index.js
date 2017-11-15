import Controller from './game/controller'
import {Runner} from './game/game'
import {createDinoBrain, activateDinoBrain, crossOver, spawnBestBois} from "./genetic_algorithm";

let index = 0;
let population = [];
let fitness = [];
let populationSize = 5

function onDocumentLoad() {
    population = createPopulation(populationSize);
    runNext();
}

function createPopulation(populationSize) {
    let population = [];

    for (let i = 0; i < populationSize; i++) {
        population.push(createDinoBrain(2, 5, 1));
    }

    return population;
}

function runDino(brain, number) {
    let runner = new Runner('.interstitial-wrapper');
    let controller = new Controller(runner);

    runner.addMetricsListener((speed, distance, distanceToObstacle, obstacleWidth) => {
        let output = activateDinoBrain(brain, distanceToObstacle, obstacleWidth);
        console.log(`speed: ${speed}, distance: ${distance}, distanceToObstacle: ${distanceToObstacle}, obstacleWidth ${obstacleWidth}`);
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


function runNext() {
    console.log(`${index}  ${population.length}`);

    if (index < population.length) {
        console.log(`Run dino: ${index}`);
        runDino(population[index], index);
        index++;
    } else {
        console.log(`Fitness ${fitness}`);
        index = 0;
        evaluatePopulation(population, fitness);
    }
}

function evaluatePopulation(population, fitness) {

    // returns the index of max value in fitness
    let indexOfBestBoi = fitness.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
    // poor mans way to find the second best boi in fitness
    fitness[indexOfBestBoi] = 0
    let indexOf2ndBestBoi = fitness.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);

    // disregard bad bitches and acquire best genomes
    let bestBoiEmbryo = crossOver(population[indexOfBestBoi], population[indexOf2ndBestBoi])
    console.log(`Fitness ${fitness}`)

    // TODO: Calculate new population...
    population = spawnBestBois(bestBoiEmbryo, populationSize);

    // TODO: Clear fitness values
    fitness = [];

    // TODO: Start new run with runNext()
    console.log('start next iteration')
    runNext();
}

document.addEventListener('DOMContentLoaded', onDocumentLoad);
