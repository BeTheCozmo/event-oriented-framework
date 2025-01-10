import { LifecycleManager } from "../lib/LifecycleManager";
import { SumSystem } from "./sum";

const lifecycleManager = new LifecycleManager();
const sumSystem = new SumSystem();

const { logSystem } = lifecycleManager.getBaseModules();
lifecycleManager.registerConfigurationStep(()=> sumSystem.configure({logger: logSystem}));
lifecycleManager.configure();
lifecycleManager.start(() => {
  sumSystem.accept("sumProcessed", (sum) => {
    logSystem.debug("Main", `The sum is ${sum}.`);
  });
  sumSystem.send("sumRequest", [1, 2, 3, 5, -11]);
});