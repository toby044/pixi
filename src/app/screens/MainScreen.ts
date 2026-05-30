import { Container, Text } from "pixi.js";

import { engine } from "../getEngine";
import { GameScreen } from "./game/GameScreen";

// the first screen the player sees
// press new game to go
export class MainScreen extends Container {
  private readonly title: Text;
  private readonly newGameButton: Text;

  constructor() {
    super();

    this.title = new Text({
      text: "Tower Defence",
      style: { fill: 0xffffff, fontSize: 56 },
    });
    this.title.anchor.set(0.5);
    this.addChild(this.title);

    this.newGameButton = new Text({
      text: "New Game",
      style: { fill: 0xffffff, fontSize: 28 },
    });
    this.newGameButton.anchor.set(0.5);
    this.newGameButton.eventMode = "static";
    this.newGameButton.cursor = "pointer";
    this.newGameButton.on("pointertap", () => {
      engine().navigation.showScreen(GameScreen);
    });
    this.addChild(this.newGameButton);
  }

  // todo - make this into its own plugin or extension
  public resize(width: number, height: number) {
    const cx = width * 0.5;
    const cy = height * 0.5;
    this.title.position.set(cx, cy - 80);
    this.newGameButton.position.set(cx, cy + 20);
  }
}
