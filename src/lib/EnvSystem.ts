import { BaseEmitter } from "./BaseEmitter";
import dotenv from "dotenv";
import { MonitoringSystem } from "./MonitoringSystem";
import { LogSystem } from "./LogSystem";
dotenv.config();

export type EnvConfig = {
  monitoringSystem: MonitoringSystem;
  logSystem: LogSystem;
  variables: {[key:string]: string}[];
}

export class EnvSystem extends BaseEmitter<EnvConfig, {}> {
  name: string = "EnvSystem";
  private variables: Map<string, string>;
  logSystem: LogSystem;

  configure(config: EnvConfig) {
    this.monitoringSystem = config.monitoringSystem;
    this.logSystem = config.logSystem;
    if(!this.variables) this.variables = new Map<string, string>();
    if(!config.variables) {
      this.configureAccepts();
      this.setConfigured();
      return;
    }
    for(const variable of config.variables) {
      const key = Object.keys(variable)[0];
      this.variables.set(key, variable[key]);
    }

    this.configureAccepts();
    this.setConfigured();
  }
  configureAccepts() {}

  getVar(variable: string, otherwise?: any) { return this.variables.get(variable) ?? otherwise; }
  setVar(variable: string, value: any) { this.variables.set(variable, value); }

}