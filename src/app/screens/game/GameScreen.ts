import type { FederatedPointerEvent, Ticker } from "pixi.js";
import { Container, Graphics, Rectangle } from "pixi.js";

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

  // outline drawn over the tile under the pointer
  private readonly hover = new Graphics();

  constructor() {
    super();

    this.layers = new GameLayers();
    this.addChild(this.layers);

    // 20x12 grid, everything should adapt
    this.level = new LevelGrid(20, 12);
    this.createSamplePath();
    this.renderLevel();

    // single reusable tile outline, hidden until the pointer is over the board
    this.hover.rect(0, 0, TILE_SIZE, TILE_SIZE).stroke({ width: 3, color: 0xffffff });
    this.hover.visible = false;
    this.layers.addToLayer("ui", this.hover);

    // make the whole screen receive pointer moves (hitArea is set in resize)
    this.eventMode = "static";
    this.on("pointermove", this.onPointerMove);
  }

  // highlight the tile under the pointer, or hide the outline when off the board
  private onPointerMove = (e: FederatedPointerEvent): void => {
    // convert into the scaled/positioned world container before mapping to a tile
    const p = this.layers.world.toLocal(e.global);
    const tile = this.level.tileAtWorld(p.x, p.y);

    if (!tile) {
      this.hover.visible = false;
      return;
    }

    const { x, y } = this.level.tileToWorld(tile.col, tile.row);
    this.hover.position.set(x, y);
    this.hover.visible = true;
  };

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
    // cover the full screen so pointermove fires anywhere
    this.hitArea = new Rectangle(0, 0, width, height);

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
