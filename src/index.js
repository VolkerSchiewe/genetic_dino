import {GeneticAlgorithm} from "./genetic_algorithm";
import {GenerationRunner} from "./generation_runner";

const REQUIRED_FITNESS = 2000;
const POPULATION_SIZE = 10;
let generation = 0;

function onDocumentLoad() {
    const geneticAlgorithm = new GeneticAlgorithm(POPULATION_SIZE);
    const population = geneticAlgorithm.generatePopulation();
    runGeneration(population);
}

function runGeneration(population) {
    const generationRunner = new GenerationRunner();
    generation++;
    showGeneration();
    generationRunner.runSingleGeneration(population)
        .then(fitness => naturalSelection(population, fitness))
        .catch(error => console.log(error));
}

//TODO: Implement jump/obstacle-ratio into fitness function to breed new bois!
function naturalSelection(population, fitness) {
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
    runGeneration(population);
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
