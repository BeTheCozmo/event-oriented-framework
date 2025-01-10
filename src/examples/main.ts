import { LifecycleManager } from "../lib/LifecycleManager";
import { SumSystem } from "./sum";

const lifecycleManager = new LifecycleManager();
const { logSystem, monitoringSystem } = lifecycleManager.getBaseModules();
const sumSystem = new SumSystem(monitoringSystem);

lifecycleManager.registerConfigurationStep(()=> sumSystem.configure({logger: logSystem}));
lifecycleManager.configure();
lifecycleManager.start(() => {
  sumSystem.accept("sumProcessed", (sum) => {
    logSystem.debug("Main", `The sum is ${sum}.`);
  });
  sumSystem.accept("sumError", (message) => logSystem.error(sumSystem.name, message));
  
  /*
  * You can try to change the array to another type of value
  * You will receive an error handled by the SumSystem
  */
  sumSystem.send("sumRequest", [1, 2, 3, 5, -11]);
});