# Genetic Dino

## Installation
**Requirements: [`node.js`](https://nodejs.org/en/) and [`npm`](https://www.npmjs.com/)** (Tested with node v6.10.2 and npm v5.0.3)

Run `npm install` to load all requirements 

Run `npm run build` to bundle JavaScript files or `npm run dev` to activate the webpack file watcher

Start the node server by running `node server.js` or `npm run server`.


## Documentation

### server.js
This file contains a small node.js server to serve the react web app. It is also used by our heroku deployment (https://genetic-dino-2018.herokuapp.com/).

### `results` directory
Contains a sample population and data from a 49. generation which includes a dino that is nearly perfect.

### `src` directory
The extracted and adjusted chrome dinosaur runner code is located in the `game.js`. Our neuronal network and everything related to that is in the `dinoBrain.js`-file. `geneticAlgorithm.js` performs all tasks like cross over, mutation and evolution of the dinosaur population.

### `components` directory
The directory contains all React components. The base component is the App-Component in `app.js` which is located in the root of this directory. The `layout` folder contains all layout related components like the `NavBar-Component` and the `GameContainer` which renders all dinosaur maps and output charts.

The components of this output charts and the generation high score chart are located in the `metrics` directory. `misc` contains a small component to render the Circle for the indicators of a dinosaur is still alive or not.

### misc
* `util.js` - small generic methods
* `generationRunner.js` - run and controle a generation on one map
* `index.js` - entry point to inject our React app into the html 
* `assets` directory - game relevant assets
