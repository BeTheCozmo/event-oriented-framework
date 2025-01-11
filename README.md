# Reactive Event Framework

[![Sponsor](https://img.shields.io/badge/Sponsor-GitHub%20Sponsors-ff69b4)](https://github.com/sponsors/BeTheCozmo)
![npm version](https://img.shields.io/npm/v/reactive-event-framework)
![downloads](https://img.shields.io/npm/dt/reactive-event-framework)

> Reactive Event Framework is a Node.js library for building reactive, event-driven system flows with ease and flexibility. It provides tools to manage application lifecycles and simplify system interactions.

---

## Table of Contents

1. [Installation](#installation)  
2. [Usage](#usage)  
3. [Configuration](#configuration)  
4. [Examples](#examples)  
5. [API](#api)  
6. [Contributing](#contributing)  
7. [License](#license)  

---

## Installation


```bash
npm install reactive-event-framework
# or
yarn add reactive-event-framework
```

---

## Usage


```typescript
import { LifecycleManager } from "reactive-event-framework";

const lifecycleManager = new LifecycleManager();

const {envSystem, logSystem, monitoringSystem} = lifecycleManager.getBaseModules();

lifecycleManager.registerConfigurationStep(() => {
   /* Your configuration step goes here */
});

lifecycleManager.configure();

lifecycleManager.start(async () => {
  logSystem.info("Main", "Application started!");
});
```

---

## Configuration

This lib requires only some environment variables to work:

- MONITORING_EVENTS_STACK_SIZE
  - Default: 1000
---

## Examples

### Example 1: Basic Usage
Here one implementation example of BaseEmitter
```typescript
//sum.ts
import { BaseEmitter, LogSystem } from "reactive-event-framework";

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
```

### Example 1.1: Instantiating and executing
```typescript
import { LifecycleManager } from "reactive-event-framework";
import { SumSystem } from "./sum";

// LifecycleManager will be responsible to all configuration and execution
const lifecycleManager = new LifecycleManager();

// It comes with some base modules that helps you to see what is occurring with your application
const {envSystem, logSystem, monitoringSystem} = lifecycleManager.getBaseModules();

// Here we instantiate our systems
// In this example we have only this one
const sumSystem = new SumSystem();

// Here we use registerConfigurationStep to configure all systems we have
// It have to be called before lifecycleManager.configure() !
lifecycleManager.registerConfigurationStep(() => {
  sumSystem.configure({logger: logSystem});
});

// configure() finishes the lifecycleManager configuration and prepares you to execute everything
lifecycleManager.configure();

/*
export type SumEvents = {
  sumRequest: number[];
  sumProcessed: number;
  sumError: string;
}
*/

// To start your apllication, use lifecycleManager.start() passing an async or not async function
lifecycleManager.start(() => {
  // Here we accept the event "sumProcessed", triggered when the sumSystem finishes the sum
  sumSystem.accept("sumProcessed", (sum) => {
    logSystem.debug(sumSystem.name, `The sum is ${sum}`); // The sum is 10
  });

  // Here we accept the event "sumError", triggered when occurred some error in sum
  sumSystem.accept("sumError", (message) => {
    logSystem.error(sumSystem.name, message);
  });

  // Then we send a request event to SumSystem with the type of key "sumRequest" in SumEvents
  sumSystem.send("sumRequest", [3, 5, 2]);
});
```

### Example 2: Reactive but imperative

You can use `waitForEvent` to program like imperative programming:
To have a type help, you can pass the Events that your system uses in `waitForEvent<Events>`, here we uses `SumEvents`.

```typescript
/*
export type SumEvents = {
  sumRequest: number[];
  sumProcessed: number;
  sumError: string;
}
*/

lifecycleManager.start(async () => {
  const sum = await waitForEvent<SumEvents>(sumSystem, {
    requestEvent: "sumRequest",
    successEvent: "sumProcessed",
    errorEvent: "sumError",
    args: [5, 3, 2]
  }); // 10

  logSystem.debug(sumSystem.name, `The sum is ${sum}`);
});
```

---

## API

### `BaseEmitter`
#### Methods
- `configure(config: EmitterConfig): void`
  - Used to configure all the dependencies that the implementer needs.
  - Obrigatory.
- `setConfigured(): void`
  - Used inside your implementation of configure() to change the state of the class to configured.
  - Without calling this, your systems will fail.
- `ensureConfigured(): void`
  - Should be called in the first line of your methods to guarantee that the class is configured.
- `send<K extends keyof T>(event: K, ...args: T[K] | any): boolean`
  - If the class with this method is listening the `event`, then send args as argument.
  - It is like EventEmiiter.emit.
  - Returns `true` if the event had listeners, `false` otherwise.
- `accept<K extends keyof T>(event: K, listener: (arg: T[K]) => void): this`
  - Register a `event` to listen the resonse.
  - Will be triggered when the system `send` a event that you are listening.
- `configureAccepts(): void`
  - You need to implement this method;
  - This should be called to configure all the events your system accepts, like in [Examples](#examples)

### `LifecycleManager`
#### Methods

- `getBaseModules(): object`
  - Return the base modules to this library, it is EnvSystem, LogSystem and MonitoringSystem.

- `registerConfigurationStep(step: LifecycleStep) | type LifecycleStep = () => void`
  - Register and step of configuration.
  - It should be used to configure your system using system.configure().
  - It should be used before LifecycleManager.configure()
- `configure()`
  - Finishes all configuration steps and prepare you to execute your application.
- `start(func: () => void)`
  - The callback that you put the code necessary to start your systems.

---

## Contributing

1. Fork the repository.  
2. Create a branch for your feature or fix: `git checkout -b my-feature`.  
3. Submit a pull request.  

Optionally, link to a `CONTRIBUTING.md` file for more details.

---

## License
This library is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

