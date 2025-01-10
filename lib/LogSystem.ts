import { BaseEmitter } from "./BaseEmitter";
import { MonitoringSystem } from "./MonitoringSystem";

type LogSystemConfig = {
  monitoringSystem: MonitoringSystem
};
type LogEvents = {
  info: string[];
  warn: string[];
  debug: string[];
  error: string[];
};

export class LogSystem extends BaseEmitter<LogSystemConfig, LogEvents> {
  name: string = "LogSystem";
  
  configure(config: LogSystemConfig) {
    this.monitoringSystem = config.monitoringSystem;
    this.configureAccepts();
    this.setConfigured();

    this.info(this.name, "Configured!");
  }

  configureAccepts() {}

  info(caller: string, ...args: any[]) {
    let fulltext = "";
    for(const arg of args) {
      fulltext += ` ${arg}`;
      console.log(`${new Date().toLocaleString()} \x1b[32mINFO\x1b[0m ${caller}:`, arg);
    }
    this.send("info", fulltext);
  }

  warn(caller: string, ...args: any[]) {
    let fulltext = "";
    for(const arg of args) {
      fulltext += ` ${arg}`;
      console.log(`${new Date().toLocaleString()} \x1b[33mWARN\x1b[0m ${caller}:`, arg);
    }
    this.send("warn", fulltext);
  }

  debug(caller: string, ...args: any[]) {
    let fulltext = "";
    for(const arg of args) {
      fulltext += ` ${arg}`;
      console.log(`${new Date().toLocaleString()} \x1b[35mDEBUG\x1b[0m ${caller}:`, arg);
    }
    this.send("debug", fulltext);
  }

  error(caller: string, ...args: any[]) {
    let fulltext = "";
    for(const arg of args) {
      fulltext += ` ${arg}`;
      console.log(`${new Date().toLocaleString()} \x1b[31mERROR\x1b[0m ${caller}:`, arg);
    }
    this.send("error", fulltext);
  }
}