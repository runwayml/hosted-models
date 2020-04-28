export class PermissionDeniedError extends Error {
  constructor() {
    super(
      `Permission denied, this model is private. Did you include the correct token?`
    );
  }
}

export class NotFoundError extends Error {
  constructor() {
    super(
      `The model url you've provided is invalid. Make sure this value is correct and that the model is "active".`
    );
  }
}

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

export class NetworkError extends Error {
  constructor(code) {
    super(
      `A network error has ocurred${
        code ? `: ${code}` : ``
      }. Please check your internet connection is working properly and try again.`
    );
  }
}

export class UnexpectedError extends Error {
  constructor() {
    super(
      `An unexpected error has ocurred. Please try again later or contact support (https://support.runwayml.com).`
    );
  }
}
