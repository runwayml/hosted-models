/**
 * A collection of Error objects which can be thrown by [[HostedModel]]'s methods.
 */

/**
 * Thrown by [[HostedModel]] methods if it is a private model and no token was provided
 * during construction, or if the token is invalid.
 */
export class PermissionDeniedError extends Error {
  constructor() {
    super(
      `Permission denied, this model is private. Did you include the correct token?`
    );
  }
}

/**
 * Thrown by [[HostedModel]] methods if the url doesn't match a model, or if that model is
 * not currently "active".
 */
export class NotFoundError extends Error {
  constructor() {
    super(
      `Model not found. Make sure the url is correct and that the model is "active".`
    );
  }
}

/**
 * Thrown by [[HostedModel.query]] if the underlying hosted model experienced an error,
 * likely due to malformed input.
 */
export class ModelError extends Error {
  constructor() {
    super(
      `The model experienced an error while processing your input. ` +
        `Double-check that you are sending properly formed input parameters in HostedModel.query(). ` +
        `You can use the HostedModel.info() method to check the input parameters the model expects. ` +
        `If the error persists, contact support (https://support.runwayml.com).`
    );
  }
}

/**
 * Thrown by [[HostedModel]] if the url provided during construction is in an invalid
 * format.
 */
export class InvlaidURLError extends Error {
  constructor() {
    super(
      `The url you've provided is not valid. Your Hosted Model your must be in the format https://my-model.hosted-models.runwayml.cloud/v1.`
    );
  }
}

/**
 * Thrown when arguments to function or constructors are invalid.
 */
export class InvalidArgumentError extends Error {
  constructor(argumentName: string) {
    super(`The required argument "${argumentName}" is invalid.`);
  }
}

/**
 * Thrown by [[HostedModel]]'s methods if an underlying network error occurred while
 * making an HTTP request. This likely indicates an error related to your internet
 * connection or configuration.
 */
export class NetworkError extends Error {
  constructor(code: string) {
    super(
      `A network error has ocurred${
        code ? `: ${code}` : ``
      }. Please check your internet connection is working properly and try again.`
    );
  }
}

/**
 * Thrown whenever an unexpected error occurs. If you experience this error, try again
 * later or [contact support](https://support.runwayml.com).
 */
export class UnexpectedError extends Error {
  constructor() {
    super(
      `An unexpected error has ocurred. Please try again later or contact support (https://support.runwayml.com).`
    );
  }
}
