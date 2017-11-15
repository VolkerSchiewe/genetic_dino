const INPUT = 2;
const HIDDEN = 5;
const OUTPUT = 1;
let neurons = HIDDEN + OUTPUT;
let connections = INPUT * HIDDEN + HIDDEN * OUTPUT;

function createDinoBrain() {
    let dinoBrain = new synaptic.Architect.Perceptron(INPUT, HIDDEN, OUTPUT);

    return dinoBrain;
}

function createPopulation(populationSize) {
    let population = [];

    for (let i = 0; i < populationSize; i++) {
        population.push(createDinoBrain());
    }

    return population;
}

function activateDinoBrain(dinoBrain, distance, width) {
    let input1 = normalize(distance);
    let input2 = normalize(width);
    let inputs = [input1, input2];
    let outputs = dinoBrain.activate(inputs);

    return outputs[0];
}

//merging method() simulates crossover in genetic
function crossOver(dinoBrain1, dinoBrain2) {
    // Converting the networks to JSON makes it all a whole lot easier
    dinoBrain1 = dinoBrain1.toJSON();
    dinoBrain2 = dinoBrain2.toJSON();
    let offspringBrain = new synaptic.Architect.Perceptron(INPUT, HIDDEN, OUTPUT);
    offspringBrain = offspringBrain.toJSON();

    for (let i = 0; i < neurons; i++) {
        let bias1 = dinoBrain1.neurons[INPUT + i].bias; 
        let bias2 = dinoBrain2.neurons[INPUT + i].bias; 
        let new_bias = (bias1 + bias2) / 2; 

        offspringBrain.neurons[INPUT + i].bias = new_bias;
    }

    for (let i = 0; i < connections; i++) {
        let weight1 = dinoBrain1.connections[i].weight; 
        let weight2 = dinoBrain2.connections[i].weight;

        let new_weight = (weight1 + weight2) / 2; 

        offspringBrain.connections[i].weight = new_weight;
    }
    return synaptic.Network.fromJSON(offspringBrain);
}

function mutateDinoGenes(dinoGene) {
    let i;
    dinoGene = dinoGene.toJSON();
    for (i = 0; i < neurons; i++) {
        dinoGene.neurons[INPUT + i].bias = mutate(dinoGene.neurons[INPUT + 1].bias);
    }
    for (i = 0; i < connections; i++) {
        dinoGene.connections[i].weights = mutate(dinoGene.connections[i].weights);
    }
    return synaptic.Network.fromJSON(dinoGene);
}

function bredDinos(bestGenes, goodGenes, mediumGenes, freshGenes, populationSize) {
    let population = [];

    for (let i = 0; i < populationSize; i++) {
        if (i == 0) {
            population.push(bestGenes);
        } else if (i == 1) {
            population.push(mutateDinoGenes(bestGenes));
        } else if (i == 2) {
            population.push(freshGenes);
        } else if (i % 3 == 0) {
            population.push(mutateDinoGenes(goodGenes));
        } else if (i % 4 == 0) {
            population.push(mutateDinoGenes(mediumGenes));
        } else {
            population.push(mutateDinoGenes(freshGenes));
        }
    }
    return population;
}

// Returns new population, using bredDinos() TODO: Research better evolution algorithms
function evolvePopulation(dinoArray, populationSize, bestFitnessValue, minFitness) {
    let newPopulation = [];
    let newDino = new synaptic.Architect.Perceptron(INPUT, HIDDEN, OUTPUT);
    let bestGenes = dinoArray[0];
    let goodGenes = crossOver(dinoArray[0], dinoArray[1]);
    let mediumGenes = crossOver(dinoArray[0], dinoArray[2]);
    let freshGenes = crossOver(dinoArray[0], newDino);

    newPopulation = bredDinos(bestGenes, goodGenes, mediumGenes, freshGenes, populationSize);
    if (bestFitnessValue < minFitness) {
        newPopulation = createPopulation(populationSize);
        console.log('meteor wiped out unfit dinos, new population was created!')
    }

    return newPopulation;
}

function normalize(value) {
    // TODO: Research most fitting normalization for Input!
    return (value);
}

function mutate(gene) {
    let mutateRate = 0.2;
    if (Math.random() < mutateRate) {
        let mutateFactor = 1 + ((Math.random() - 0.5) * 3 + (Math.random() - 0.5));
        gene *= mutateFactor;
    }
    return gene;
}

export {
    createPopulation,
    activateDinoBrain,
    evolvePopulation
}
