import Controller from './game/controller'
import {Runner} from './game/game'
import {createDinoBrain, activateDinoBrain} from "./genetic_algorithm";

let index = 0;
let population = [];
let fitness = [];

function onDocumentLoad() {
    population = createPopulation(5);
    runNext();
}

function createPopulation(size) {
    let population = [];

    for (let i = 0; i < size; i++) {
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
        onDinoFinished(number, distance);
    });

    console.log(`Game started for dino: ${number} with brain: ${brain}`);
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
    // TODO: Calculate new population...
    // TODO: Clear fitness values
    // TODO: Start new run with runNext()
}

document.addEventListener('DOMContentLoaded', onDocumentLoad);
