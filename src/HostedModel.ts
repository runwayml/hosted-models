import { AxiosRequestConfig, AxiosResponse } from 'axios';

import {
  InvlaidURLError,
  ModelError,
  NetworkError,
  NotFoundError,
  PermissionDeniedError,
  UnexpectedError,
} from './HTTPErrors';
import { delay, requestWithRetry } from './utils';

export interface HostedModelConfig {
  url: string;
  token?: string;
}

export class HostedModel {
  private url: string;
  private token: string;
  private headers: { [name: string]: string };
  private responseCodesToRetry: number[];

  constructor(config: HostedModelConfig) {
    this.url = config.url;
    this.token = config.token || null;
    this.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    if (this.token) this.headers['Authorization'] = `Bearer ${this.token}`;
    this.responseCodesToRetry = [502, 429];
    if (!this.isValidV1URL(this.url)) throw new InvlaidURLError();
  }

  async root() {
    return this.requestHostedModel({
      url: `${this.url}/`,
      method: 'GET',
      headers: this.headers,
    });
  }

  async info() {
    return this.requestHostedModel({
      url: `${this.url}/info`,
      method: 'GET',
      headers: this.headers,
    });
  }

  async query(input: any) {
    return this.requestHostedModel({
      url: `${this.url}/query`,
      method: 'POST',
      headers: this.headers,
      data: input,
    });
  }

  async isAwake() {
    const root = await this.root();
    return root.status === 'running';
  }

  async waitUntilAwake() {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          while (true) {
            const awake = await this.isAwake();
            if (awake) {
              resolve();
              return;
            }
            await delay(500);
          }
        } catch (err) {
          reject(err);
        }
      })();
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
