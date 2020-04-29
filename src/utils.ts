/** @ignore */ /** */
// Ignore utils from generated docs ^
import axios, { AxiosRequestConfig } from 'axios';

export function delay(millis: number) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

export async function requestWithRetry(
  responseCodesToRetry: number[],
  config: AxiosRequestConfig
) {
  if (responseCodesToRetry.length < 1) {
    throw Error(`responseCodesToRetry must include at least one status code`);
  }
  while (true) {
    const result = await axios.request({ ...config, validateStatus: null });
    if (!responseCodesToRetry.includes(result.status)) return result;
  }
}
