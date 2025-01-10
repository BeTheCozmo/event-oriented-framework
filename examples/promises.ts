import { LifecycleManager } from "../src/lib/LifecycleManager";
import { SumSystem } from "./sum";

const lifecycleManager = new LifecycleManager();
const { logSystem, monitoringSystem } = lifecycleManager.getBaseModules();

const sumSystem = new SumSystem(monitoringSystem);
lifecycleManager.registerConfigurationStep(() => { sumSystem.configure({logger: logSystem}); });
lifecycleManager.configure();

async function waitSum(numbers: number[]): Promise<number> {
  const promise = new Promise<number>((resolve, reject) => {
    sumSystem.accept("sumProcessed", (value) => resolve(value));
    sumSystem.accept("sumError", (message) => {
      logSystem.error(sumSystem.name, message);
      reject(message);
    });
  });
  sumSystem.send("sumRequest", numbers);
  return promise;
}

lifecycleManager.start(async () => {
  /*
  * You can try to change the array to another type of value (like string)
  * You will receive an error handled by the SumSystem
  * Try to comment the correct use of waitSum and uncomment the wrong use.
  */
  // const sum = await waitSum("I want to put a string :P");
  const sum = await waitSum([5, 2, 3]);
  logSystem.debug("Promises", `The sum of [5, 2, 3] is ${sum}`);
})
