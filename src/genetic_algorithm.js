const INPUT = 2;
const HIDDEN = 6;
const OUTPUT = 1;
const DOMINANT_GENE_RATE = 0.65;
const RECESSIVE_GENE_RATE = 0.35;


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
function crossOver(dominantBrain, recessiveBrain) {
    // Converting the networks to JSON makes it all a whole lot easier
    dominantBrain = dominantBrain.toJSON();
    recessiveBrain = recessiveBrain.toJSON();
    let offspringBrain = new synaptic.Architect.Perceptron(INPUT, HIDDEN, OUTPUT);
    offspringBrain = offspringBrain.toJSON();

    for (let i = 0; i < neurons; i++) {
        let dominant_bias = dominantBrain.neurons[INPUT + i].bias; 
        let recessive_bias = recessiveBrain.neurons[INPUT + i].bias; 
        let new_bias = (dominant_bias * DOMINANT_GENE_RATE + recessive_bias * RECESSIVE_GENE_RATE); 

        offspringBrain.neurons[INPUT + i].bias = new_bias;
    }

    for (let i = 0; i < connections; i++) {
        let dominant_weight = dominantBrain.connections[i].weight; 
        let recessive_weight = recessiveBrain.connections[i].weight;

        let new_weight = (dominant_weight * DOMINANT_GENE_RATE + recessive_weight * RECESSIVE_GENE_RATE); 

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
function evolvePopulation(dinoAiArray, populationSize) {
    let newPopulation = [];
    let newDinoBrain = new synaptic.Architect.Perceptron(INPUT, HIDDEN, OUTPUT);
    let bestGenes = dinoAiArray[0];
    let goodGenes = crossOver(dinoAiArray[0], dinoAiArray[1]);
    let mediumGenes = crossOver(dinoAiArray[0], dinoAiArray[2]);
    let freshGenes = crossOver(dinoAiArray[0], newDinoBrain);

    newPopulation = bredDinos(bestGenes, goodGenes, mediumGenes, freshGenes, populationSize);
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
