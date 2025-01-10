import { EventEmitter } from "events";
import { MonitoringSystem } from "./MonitoringSystem";

export abstract class BaseEmitter<EmitterConfig, T extends Record<any, any>> extends EventEmitter {
  protected configured = false;
  abstract name: string;
  monitoringSystem?: MonitoringSystem;

  constructor(monitoringSystem?: MonitoringSystem) {
    super();
    this.monitoringSystem = monitoringSystem;
  };
  abstract configure(config: EmitterConfig);
  protected setConfigured() {
    this.configured = true;
    this.send(`${this.name}:configured`, true);
  }
  protected ensureConfigured() {
    if(this.configured) return;
    this.send("error", `System ${this.name} not configured`);
    throw new Error(`System ${this.name} not configured`);
  }
  send<K extends keyof T>(event: K, ...args: T[K] | any): boolean {
    const result = super.emit(event as string, ...args);
    if(this.monitoringSystem) this.monitoringSystem.register<K>("send", event, args);
    return result;
  }

  accept<K extends keyof T>(event: K, listener: (arg: T[K]) => void): this {
    const result = super.on(event as string, listener);
    if(this.monitoringSystem) this.monitoringSystem.register<K>("accept", event, listener);
    return result;
  }

  abstract configureAccepts();
}