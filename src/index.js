import GameController from './game/controller'
import {Runner} from './game/game'


// Todo: Only here for consolse debugging,
// Remove if not needed anymore.
var controller = null;


function onDocumentLoad() {
    var runner = new Runner('.interstitial-wrapper');
    controller = new GameController(runner);
    runner.addMetricsListener((speed, distance, distanceTOObstacle, ObstcleWidth) => console.log(speed))
}

document.addEventListener('DOMContentLoaded', onDocumentLoad);
