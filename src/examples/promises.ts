import { LifecycleManager } from "../lib/LifecycleManager";
import { SumSystem } from "./sum";

const lifecycleManager = new LifecycleManager();
const { logSystem, monitoringSystem } = lifecycleManager.getBaseModules();

const sumSystem = new SumSystem(monitoringSystem);
lifecycleManager.registerConfigurationStep(() => { sumSystem.configure({logger: logSystem}); });
lifecycleManager.configure();

async function waitSum(numbers: number[]): Promise<number> {
  const promise = new Promise<number>((resolve, reject) => {
    sumSystem.accept("sumProcessed", (value) => resolve(value));
    sumSystem.accept("sumError", (message) => reject(message));
  });
  sumSystem.send("sumRequest", numbers);
  return promise;
}

lifecycleManager.start(async () => {
  /*
  * You can try to change the array to another type of value
  * You will receive an error handled by the SumSystem
  */
  const value = await waitSum([5, 2, 3]);
  logSystem.debug("Promises", `The sum of [5, 2, 3] is ${value}`);
})
