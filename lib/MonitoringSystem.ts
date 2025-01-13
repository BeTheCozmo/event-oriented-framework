import { BaseEmitter } from "./BaseEmitter";
import { EnvSystem } from "./EnvSystem";

export type MonitoringConfig = {
  envSystem: EnvSystem,
};
export type MonitoringEvents = {};

export class MonitoringSystem extends BaseEmitter<MonitoringConfig, MonitoringEvents> {
  name: string = "MonitoringSystem";
  events: {type: "send" | "accept", event: any, args: any}[] = [];
  private envSystem: EnvSystem;

  configure(config: MonitoringConfig) {
    this.envSystem = config.envSystem;
    this.configureAccepts();
    this.setConfigured();
  }
  configureAccepts() {
    
  }
  
  register<K>(type: "send" | "accept", event: K, args: any) {
    let exceed = (!this.envSystem ? 1000 : (this.events.length - Number(this.envSystem.getVar("MONITORING_EVENTS_STACK_SIZE", 1000))));
    while(exceed-- > 0) this.events.shift();
    this.events.push({type, event, args});
  }
}