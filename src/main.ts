import { LifecycleManager } from "./lib/LifecycleManager";
import { SumSystem } from "./examples/sum";

const lifecycleManager = new LifecycleManager();
const sumSystem = new SumSystem();

const { logSystem } = lifecycleManager.getBaseModules();
lifecycleManager.registerConfigurationStep(()=> sumSystem.configure({logger: logSystem}));
lifecycleManager.configure();
lifecycleManager.start(() => {
  
});