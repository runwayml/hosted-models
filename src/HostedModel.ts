/**
 * A module for interfacing with Runway Hosted Models.
 */
import { AxiosRequestConfig, AxiosResponse } from 'axios';

import {
  InvalidArgumentError,
  InvlaidURLError,
  ModelError,
  NetworkError,
  NotFoundError,
  PermissionDeniedError,
  UnexpectedError,
} from './HTTPErrors';
import { delay, requestWithRetry } from './utils';

/**
 * The config object used to construct a new [[HostedModel]].
 *
 * ```typescript
 * // For private models...
 * {
 *   url: 'https://my-model.hosted-models.runwayml.cloud/v1',
 *   token: 'kN5PB/GGgL5IcXxViegzUA==', // this is a fake token, use your own
 * }
 *
 * // For public models...
 * {
 *   url: 'https://my-model.hosted-models.runwayml.cloud/v1',
 * }
 * ```
 */
export interface HostedModelConfig {
  /**
   * The full URL of your hosted model in the format `https://my-model.hosted-models.runwayml.cloud/v1`
   */
  url: string;
  /**
   * The secret token associated with this model. Only required if this model is private.
   */
  token?: string;
}

/**
 * A class representing a Runway Hosted Model. This is the main interface provided by
 * this package. Exposes two main methods for interfacing with a model.
 *
 * - `info()`
 * - `query(input)`
 *
 * Exposes two helper methods for checking the "awake" status of a hosted model.
 *
 * - `isAwake()`
 * - `waitUntilAwake()`
 */
export class HostedModel {
  private url: string;
  private token: string;
  private headers: { [name: string]: string };
  private responseCodesToRetry: number[];

  /**
   * ```typescript
   * const model = new HostedModel({
   *  url: 'https://my-model.hosted-models.runwayml.cloud/v1',
   *  token: 'my-secret-token', # token is only required for private models
   * })
   * ```
   */
  constructor(config: HostedModelConfig) {
    if (typeof config !== 'object') throw new InvalidArgumentError('config');
    this.url = config.url;
    this.token = config.token || null;
    this.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    if (this.token) this.headers['Authorization'] = `Bearer ${this.token}`;
    this.responseCodesToRetry = [502, 429];
    if (!this.isValidV1URL(this.url)) throw new InvlaidURLError();
    // Wake up the model during construction because it will probably be used soon
    this.root()
      .then(result => result)
      .catch(err => err);
  }

  /**
   * Return info about the input/output spec provided by the model. Makes a GET request
   * to the /v1/info route of a hosted model under the hood.
   */
  async info() {
    return this.requestHostedModel({
      url: `${this.url}/info`,
      method: 'GET',
      headers: this.headers,
    });
  }

  /**
   * Run the model on your input and produce an output. This is how you "run" the model.
   * @param input An object containing input parameters to be sent to the model.
   * Use the [[info]] method to get the correct format for this object, as each model
   * expects different inputs.
   */
  async query(input: any) {
    if (typeof input !== 'object') throw new InvalidArgumentError('input');
    return this.requestHostedModel({
      url: `${this.url}/query`,
      method: 'POST',
      headers: this.headers,
      data: input,
    });
  }

  /**
   * Returns `true` if this model is awake, `false` if it is still waking up.
   * See Awake, Awakening, and Awake in the
   * [Hosted Models docs](https://learn.runwayml.com/#/how-to/hosted-models?id=asleep-awakening-and-awake-states).
   */
  async isAwake() {
    const root = await this.root();
    return root.status === 'running';
  }

  /**
   * Returns a promise that will resolve once the model is awake. This method is never
   * required, as [[info]] and [[query]] will always return results eventually, but it can be
   * useful for managing UI if you want to postpone making [[info]] and [[query]] requests
   * until you know that they will resolve more quickly.
   *
   * ```typescript
   * // This is pseudo code
   * const model = new HostedModel({
   *  url: 'https://my-model.hosted-models.runwayml.cloud/v1',
   *  token: 'my-secret-token', # token is only required for private models
   * })
   * // Enter some loading state in the UI.
   * loading(true)
   * await model.waitUntilAwake() // This method is never required, but can sometimes be useful
   * loading(false)
   *
   * while (true) {
   *  const input = getSomeInput()
   *  const output = await model.query(input)
   *  doSomething(output)
   * }
   * ```
   *
   * @param pollIntervalMillis [[waitUntilAwake]] The rate that this function will poll
   * the hosted model endpoint to check if it is awake yet.
   */
  async waitUntilAwake(pollIntervalMillis = 1000): Promise<void> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          while (true) {
            const awake = await this.isAwake();
            if (awake) {
              resolve();
              return;
            }
            await delay(pollIntervalMillis);
          }
        } catch (err) {
          reject(err);
        }
      })();
    });
  }

  private async root() {
    return this.requestHostedModel({
      url: `${this.url}/`,
      method: 'GET',
      headers: this.headers,
    });
  }

  private async requestHostedModel(config: AxiosRequestConfig) {
    let result: AxiosResponse;
    try {
      result = await requestWithRetry(this.responseCodesToRetry, config);
    } catch (err) {
      throw new NetworkError(err.code);
    }
    if (this.isHostedModelResponseError(result)) {
      if (result.status === 401) throw new PermissionDeniedError();
      else if (result.status === 404) throw new NotFoundError();
      else if (result.status === 500) throw new ModelError();
      throw new UnexpectedError();
    }
    return result.data;
  }

  private isHostedModelResponseError(response: AxiosResponse) {
    return (
      !response.headers['content-type'].includes('application/json') ||
      !(response.status >= 200 && response.status < 300)
    );
  }

  private isValidV1URL(url: string) {
    return /^https{0,1}:\/\/.+\.runwayml\.cloud\/v1/.test(url);
  }
}
