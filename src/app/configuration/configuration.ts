import { ApplicationConfiguration } from 'src/app/configuration/application-configuration.interface';

export class Configuration {
  public static config: ApplicationConfiguration;
  public static initialized = false;

  private static configurationFile = '/assets/config.json';

  public static init(): Promise<void> {
    return Configuration.loadConfiguration(Configuration.configurationFile);
  }

  private static loadConfiguration(configurationFile: string): Promise<void> {
    const ts = Math.round(new Date().getTime() / 1000);

    return new Promise<void>((resolve: () => void, reject: (s: string) => any): void => {
      fetch(`${configurationFile}?t=${ts}`)
        .then((response: Response): void => {
          response
            .json()
            .then((configuration: ApplicationConfiguration): void => {
              Configuration.config = configuration;
              Configuration.initialized = true;

              resolve();
            })
            .catch((error: any): void => reject(`Invalid JSON in file '${configurationFile}': ${error}`));
        })
        .catch((error: any): void => reject(`Could not load file '${configurationFile}': ${error}`));
    });
  }
}
