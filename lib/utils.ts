import { BaseEmitter } from "./BaseEmitter";

export async function waitForEvent<
  T extends Record<string, any>,
  // TODO: infer this to args automatically
  K extends keyof T = keyof T
>(
  system: BaseEmitter<any, T>,
  {
    successEvent,
    errorEvent,
    requestEvent,
    args,
  }: {
    successEvent: keyof T;
    requestEvent: keyof T;
    errorEvent?: keyof T;
    args: T[K];
  }
): Promise<T[keyof T]> {
  return new Promise<T[keyof T]>((resolve, reject) => {
    let onSuccess: (value: T[typeof successEvent]) => void;
    let onError: (message: string) => void;

    onSuccess = (value: T[keyof T]) => {
      system.off(successEvent as string, onSuccess);
      if (errorEvent) system.off(errorEvent as string, onError);
      resolve(value);
    };

    onError = (message: string) => {
      if (errorEvent) system.off(errorEvent as string, onError);
      system.off(successEvent as string, onSuccess);
      reject(message);
    };

    system.accept(successEvent, onSuccess);
    if (errorEvent) system.accept(errorEvent, onError);

    system.send(requestEvent, args);
  });
}