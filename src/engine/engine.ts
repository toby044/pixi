import type {
  ApplicationOptions,
  DestroyOptions,
  RendererDestroyOptions,
} from "pixi.js";
import { Application, Assets, extensions, ResizePlugin } from "pixi.js";
import "pixi.js/app";
import { initDevtools } from "@pixi/devtools";
import manifest from "../manifest.json";

import { CreationNavigationPlugin } from "./navigation/NavigationPlugin";
import { CreationResizePlugin } from "./resize/ResizePlugin";
import { getResolution } from "./utils/getResolution";

extensions.remove(ResizePlugin);
extensions.add(CreationResizePlugin);
extensions.add(CreationNavigationPlugin);

// Main engine used to create the app itself
export class CreationEngine extends Application {
  public async init(opts: Partial<ApplicationOptions>): Promise<void> {
    opts.resizeTo ??= window;
    opts.resolution ??= getResolution();

    await super.init(opts);

    if (import.meta.env.DEV) {
      initDevtools({ app: this });
    }

    document.getElementById("pixi-container")!.appendChild(this.canvas);
    document.addEventListener("visibilitychange", this.visibilityChange);

    // load assets
    await Assets.init({ manifest, basePath: "assets" });
    await Assets.loadBundle("preload");

    // list and load bundles
    const allBundles = manifest.bundles.map((item) => item.name);
    Assets.backgroundLoadBundle(allBundles);
  }

  public override destroy(
    rendererDestroyOptions: RendererDestroyOptions = false,
    options: DestroyOptions = false,
  ): void {
    document.removeEventListener("visibilitychange", this.visibilityChange);
    super.destroy(rendererDestroyOptions, options);
  }

  protected visibilityChange = () => {
    if (document.hidden) {
      this.navigation.blur();
    } else {
      this.navigation.focus();
    }
  };
}
