import type { Ticker } from "pixi.js";
import { Container, Graphics } from "pixi.js";

import { GameLayers } from "../../game/GameLayers";
import { LevelGrid, TILE_SIZE, type TileType } from "../../game/LevelGrid";

const TILE_COLORS: Record<TileType, number> = {
  buildable: 0x009900, // green ground you can build on
  path: 0x444400, // enemy road
  blocked: 0x990000,
};

// make a levelgrid and render it
export class GameScreen extends Container {
  // for needed assets
  public static assetBundles: string[] = [];

  private readonly layers: GameLayers;
  private readonly level: LevelGrid;

  constructor() {
    super();

    this.layers = new GameLayers();
    this.addChild(this.layers);

    // 20x12 grid, everything should adapt
    this.level = new LevelGrid(20, 12);
    this.createSamplePath();
    this.renderLevel();
  }

  // demo path
  private createSamplePath(): void {
    for (let col = 0; col <= 15; col++) this.level.set(col, 2, "path");
    for (let row = 2; row <= 9; row++) this.level.set(15, row, "path");
    for (let col = 4; col <= 15; col++) this.level.set(col, 9, "path");
  }

  // fill board + lines
  private renderLevel(): void {
    const ground = new Graphics();
    this.level.forEach((col, row, type) => {
      const { x, y } = this.level.tileToWorld(col, row);
      ground.rect(x, y, TILE_SIZE, TILE_SIZE).fill(TILE_COLORS[type]);
    });
    this.layers.addToLayer("terrain", ground);

    const lines = new Graphics();
    for (let col = 0; col <= this.level.cols; col++) {
      lines
        .moveTo(col * TILE_SIZE, 0)
        .lineTo(col * TILE_SIZE, this.level.worldHeight);
    }
    for (let row = 0; row <= this.level.rows; row++) {
      lines
        .moveTo(0, row * TILE_SIZE)
        .lineTo(this.level.worldWidth, row * TILE_SIZE);
    }
    lines.stroke({ width: 1, color: 0x000000, alpha: 0.25 });
    this.layers.addToLayer("terrain", lines);
  }

  // insert game loop here
  public update(_time: Ticker): void {}

  // todo - make this into its own plugin or extension
  public resize(width: number, height: number): void {
    const world = this.layers.world;
    const margin = 40;
    const scale = Math.min(
      (width - margin * 2) / this.level.worldWidth,
      (height - margin * 2) / this.level.worldHeight,
    );
    world.scale.set(scale);
    world.position.set(
      (width - this.level.worldWidth * scale) / 2,
      (height - this.level.worldHeight * scale) / 2,
    );
  }
}
