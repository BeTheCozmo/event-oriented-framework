import { EnvSystem } from "./EnvSystem";
import { LogSystem } from "./LogSystem";
import { MonitoringSystem } from "./MonitoringSystem";

type LifecycleStep = () => void

export class LifecycleManager {
  private modules: {
    envSystem: EnvSystem,
    logSystem: LogSystem,
    monitoringSystem: MonitoringSystem,
  } & {[key: string]: any};

  private steps: LifecycleStep[] = [];

  constructor() {
    this.createModules();
    this.configureModules();
  }

  registerConfigurationStep(step: LifecycleStep) { this.steps.push(step); }
  getBaseModules() { return this.modules; }

  private configureModules() {
    const { envSystem, logSystem, monitoringSystem } = this.modules;
    envSystem.configure({
      monitoringSystem,
      logSystem,
      variables: [
        {
          monitoringStackSize: process.env.MONITORING_EVENTS_STACK_SIZE
        }
      ]
    });
    logSystem.configure({
      monitoringSystem
    });
    monitoringSystem.configure({
      envSystem
    });
  }

  configure() {
    for(const step of this.steps) step();
    this.modules.logSystem.info("LifecycleManager", "All configuration steps runned.");
  }

  private createModules() {
    const envSystem = new EnvSystem();
    const logSystem = new LogSystem();
    const monitoringSystem = new MonitoringSystem();

    this.modules = {envSystem, logSystem, monitoringSystem};
  }

  public async start(func: () => void) {
    func();
    this.modules.logSystem.info("LifecycleManager", 'All modules executed succesfully.');
  }
}