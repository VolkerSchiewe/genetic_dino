import Controller from './game/controller'
import {Runner} from './game/game'
import {createDinoBrain, activateDinoBrain, crossOver, spawnBestBois} from "./genetic_algorithm";

let generation = 0;
let currentDino = 0;
let populationSize = 10;
let population = [];
let fitness = [];

function onDocumentLoad() {
    population = createPopulation(populationSize);
    runGeneration();
}

function runGeneration() {
    generation++;
    currentDino = 0;
    runNext();
}

function createPopulation(populationSize) {
    let population = [];

    for (let i = 0; i < populationSize; i++) {
        population.push(createDinoBrain(2, 5, 1));
    }

    return population;
}

function runNext() {
    console.log(`${currentDino}  ${population.length}`);
    updateUi();

    if (currentDino < population.length) {
        console.log(`Run dino: ${currentDino}`);
        runDino(population[currentDino], currentDino);
        currentDino++;
    } else {
        evaluatePopulation(population, fitness);
    }
}

function runDino(brain, number) {
    let runner = new Runner('.interstitial-wrapper', {});
    let controller = new Controller(runner);

    runner.addMetricsListener((speed, distance, distanceToObstacle, obstacleWidth) => {
        let output = activateDinoBrain(brain, distanceToObstacle, obstacleWidth);

        if (output > 0.50) {
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

function evaluatePopulation() {
    let indexOfBestDino = indexOfMaxValue(fitness);
    fitness[indexOfBestDino] = 0;
    let indexOfSecondBestDino = indexOfMaxValue(fitness);
    let childOfBestDinos = crossOver(population[indexOfBestDino], population[indexOfSecondBestDino]);

    population = spawnBestBois(childOfBestDinos, populationSize);
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
