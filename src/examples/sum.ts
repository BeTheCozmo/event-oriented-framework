
import { BaseEmitter } from "../lib/BaseEmitter";
import { LogSystem } from "../lib/LogSystem";

export type SumConfig = {
  logger: LogSystem;
}
export type SumEvents = {
  sumRequest: number[];
  sumProcessed: number;
  sumError: string;
}

export class SumSystem extends BaseEmitter<SumConfig, SumEvents> {
  name: string = "SumSystem";
  private logger: LogSystem;

  configure(config: SumConfig) {
    this.logger = config.logger;
    this.configureAccepts();
    this.setConfigured();
  }
  configureAccepts() {
    this.accept("sumRequest", this.sum.bind(this));
  }

  sum(numbers: number[]) {
    this.ensureConfigured();
    if(typeof numbers != "object")
      return this.send("sumError", "The argument is not a list of numbers.");
    
    const sum = numbers.reduce((pv, cv) => cv + pv , 0);
    this.logger.info(this.name, "Sum processed");
    this.send("sumProcessed", sum);
  }
}