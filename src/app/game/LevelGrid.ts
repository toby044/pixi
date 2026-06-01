// size of a single tile
export const TILE_SIZE = 64;
export type TileType = "buildable" | "path" | "blocked";


// any cell never set is treated as the default type.
// you only paint the cells that differ from plain ground.

export class LevelGrid {
  // type used for any cell which is not plain ground
  public static readonly DEFAULT: TileType = "buildable";

  public readonly cols: number;
  public readonly rows: number;

  private readonly tiles = new Map<string, TileType>();

  constructor(cols: number, rows: number) {
    this.cols = cols;
    this.rows = rows;
  }

  // set coordinate to key
  private static key(col: number, row: number): string {
    return `${col},${row}`;
  }

  // is it inside the grid
  public inBounds(col: number, row: number): boolean {
    return col >= 0 && row >= 0 && col < this.cols && row < this.rows;
  }

  // get or set a tile
  public get(col: number, row: number): TileType {
    return this.tiles.get(LevelGrid.key(col, row)) ?? LevelGrid.DEFAULT;
  }

  public set(col: number, row: number, type: TileType): void {
    this.tiles.set(LevelGrid.key(col, row), type);
  }

  // run a callback for every cell in the grid, row by row.
  public forEach(cb: (col: number, row: number, type: TileType) => void): void {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        cb(col, row, this.get(col, row));
      }
    }
  }

  // get sizes of board
  public get worldWidth(): number {
    return this.cols * TILE_SIZE;
  }

  public get worldHeight(): number {
    return this.rows * TILE_SIZE;
  }

  //get corner of a tile
  public tileToWorld(col: number, row: number): { x: number; y: number } {
    return { x: col * TILE_SIZE, y: row * TILE_SIZE };
  }

  // get center of a tile
  public tileCenter(col: number, row: number): { x: number; y: number } {
    return { x: (col + 0.5) * TILE_SIZE, y: (row + 0.5) * TILE_SIZE };
  }

  // take a point in the world
  // use inBounds + set
  // could be to set a turret somewhere on the map
  public worldToTile(x: number, y: number): { col: number; row: number } {
    return { col: Math.floor(x / TILE_SIZE), row: Math.floor(y / TILE_SIZE) };
  }
  
  public tileAtWorld(x: number, y: number): { col: number; row: number } | null {
    const { col, row } = this.worldToTile(x, y);
    return this.inBounds(col, row) ? { col, row } : null;
  }

  // paint a tile at a world point; returns the tile set, or null if off the grid
  public setAtWorld(
    x: number,
    y: number,
    type: TileType,
  ): { col: number; row: number } | null {
    const tile = this.tileAtWorld(x, y);
    if (tile) this.set(tile.col, tile.row, type);
    return tile;
  }
}
