const INPUT_LAYERS = 2;
const HIDDEN_LAYERS = 6;
const OUTPUT_LAYERS = 1;
const DOMINANT_GENE_RATE = 0.65;
const RECESSIVE_GENE_RATE = 0.35;
// TODO: Test out different hyper parameter setups


let neurons = HIDDEN_LAYERS + OUTPUT_LAYERS;
let connections = INPUT_LAYERS * HIDDEN_LAYERS + HIDDEN_LAYERS * OUTPUT_LAYERS;

function createDinoBrain() {
    // TODO: implement option to create LSTM network when controller.duck() is integrated
    let dinoBrain = new synaptic.Architect.Perceptron(INPUT_LAYERS, HIDDEN_LAYERS, OUTPUT_LAYERS);

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
    distance = normalize(distance);
    width = normalize(width);
    let inputs = [distance, width];
    let outputs = dinoBrain.activate(inputs);

    return outputs[0];
}

// nature inspired merging method, simulates cross over in genetic 
function crossOver(dominantBrain, recessiveBrain) {
    // Converting the networks to JSON makes it alot easier to manipulate parameters
    dominantBrain = dominantBrain.toJSON();
    recessiveBrain = recessiveBrain.toJSON();
    let offspringBrain = createDinoBrain();
    offspringBrain = offspringBrain.toJSON();

    for (let i = 0; i < neurons; i++) {
        let dominant_bias = dominantBrain.neurons[INPUT_LAYERS + i].bias; 
        let recessive_bias = recessiveBrain.neurons[INPUT_LAYERS + i].bias; 
        let new_bias = (dominant_bias * DOMINANT_GENE_RATE + recessive_bias * RECESSIVE_GENE_RATE); 

        offspringBrain.neurons[INPUT_LAYERS + i].bias = new_bias;
    }

    for (let i = 0; i < connections; i++) {
        let dominant_weight = dominantBrain.connections[i].weight; 
        let recessive_weight = recessiveBrain.connections[i].weight;

        let new_weight = (dominant_weight * DOMINANT_GENE_RATE + recessive_weight * RECESSIVE_GENE_RATE); 

        offspringBrain.connections[i].weight = new_weight;
    }
    // TODO: enable to merge to LSTM networks
    return synaptic.Network.fromJSON(offspringBrain);
}

// TODO: implement method() to manipulate LSTM cells
function mutateDinoGenes(dinoGene) {
    let i;
    dinoGene = dinoGene.toJSON();
    for (i = 0; i < neurons; i++) {
        dinoGene.neurons[INPUT_LAYERS + i].bias = mutate(dinoGene.neurons[INPUT_LAYERS + 1].bias);
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
    let newDinoBrain = createDinoBrain();
    let bestGenes = dinoAiArray[0];
    let goodGenes = crossOver(dinoAiArray[0], dinoAiArray[1]);
    let mediumGenes = crossOver(dinoAiArray[0], dinoAiArray[2]);
    let freshGenes = crossOver(dinoAiArray[0], newDinoBrain);

    newPopulation = bredDinos(bestGenes, goodGenes, mediumGenes, freshGenes, populationSize);
    return newPopulation;
}

function normalize(value) {
    // TODO: Research most fitting normalization scheme for INPUT_LAYERS!
    return (value);
}

// TODO: Research about most efficient mutation rate and factor
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
