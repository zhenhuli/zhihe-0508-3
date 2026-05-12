import './style.css'
import { Game } from './Game.js'

const game = new Game();
document.body.appendChild(game.getDomElement());

function animate() {
  requestAnimationFrame(animate);
  game.update();
  game.render();
}

animate();
