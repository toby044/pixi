import { setEngine } from "./app/getEngine";
import { MainScreen } from "./app/screens/MainScreen";
import { CreationEngine } from "./engine/engine";

const engine = new CreationEngine();
setEngine(engine);

(async () => {

  await engine.init({
    background: "#1E1E1E",
    resizeOptions: { minWidth: 768, minHeight: 1024, letterbox: false },
  });

  // show the main menu
  await engine.navigation.showScreen(MainScreen);
})();
