import { LifecycleManager } from "../src/lib/LifecycleManager";
import { waitForEvent } from "../src/lib/utils";
import { SumEvents, SumSystem } from "./sum";

const lifecycleManager = new LifecycleManager();
const { logSystem } = lifecycleManager.getBaseModules();

const sumSystem = new SumSystem();
lifecycleManager.registerConfigurationStep(() => { sumSystem.configure({logger: logSystem}); });
lifecycleManager.configure();

lifecycleManager.start(async () => {
  
  const sum = await waitForEvent<SumEvents, "sumRequest">(sumSystem, {
    requestEvent: "sumRequest",
    successEvent: "sumProcessed",
    errorEvent: "sumError",
    args: [5, 2, 3, 4]
  });

  logSystem.debug("Promises", `The sum is ${sum}`);
})
