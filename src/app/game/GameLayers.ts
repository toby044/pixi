import { Container, RenderLayer } from "pixi.js";


// game draw order from bottom to top
export const LAYER_ORDER = [
  "terrain", // ground tiles / background
  "path", // the road enemies walk on
  "enemies", 
  "towers",
  "projectiles",
  "fx", //particles
  "ui",
] as const;

export type LayerName = (typeof LAYER_ORDER)[number];

// use renderlayer to attach objects to the world and into the layers
export class GameLayers extends Container {

  public readonly world = new Container();

  private readonly layers = {} as Record<LayerName, RenderLayer>;

  constructor() {
    super();

    // give the world the children for positions
    this.addChild(this.world);

    // create layers based on layer order. move them around to change the render layer order
    for (const name of LAYER_ORDER) {
      const layer = new RenderLayer();
      this.layers[name] = layer;
      this.addChild(layer);
    }
  }

  // add obj to layer
  public addToLayer<T extends Container>(name: LayerName, obj: T): T {
    this.world.addChild(obj);
    this.layers[name].attach(obj);
    return obj;
  }

  // remove obj from layer
  public removeFromLayer(name: LayerName, obj: Container): void {
    this.layers[name].detach(obj);
    this.world.removeChild(obj);
  }
}
