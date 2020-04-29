# Hosted Models JavaScript SDK

A small library for interfacing with RunwayML [Hosted Models](https://learn.runwayml.com/#/how-to/hosted-models) using only a few lines of code. Works in both Node.js and the Browser.

## Benefits

This library is a thin wrapper around the Hosted Models [HTTP API](https://learn.runwayml.com/#/how-to/hosted-models?id=http-api). It provides a few benefits:

- Abstracts the HTTP requests to the Hosted Model, so you don't have to make them directly.
- Simplifies authorization for private models, just provide your `token` in the `new HostedModels({ url, token })` constructor.
- Automatically retries failed requests if they timed out while the model wakes up or are blocked due to rate-limiting.
- Includes friendly error reporting with messages for humans, so you can better understand why something went wrong.

If your project is written in JavaScript, we encourage you to use this library!

## Examples

See the [`examples/`](examples) directory for a full list of examples.

### Node.js / Module Syntax

If you are using Node.js or packaging your front-end code via a bundler, you can install the module using `npm`.

```bash
npm install --save @runwayml/hosted-models
```

```javascript
const { HostedModel } = require('@runwayml/hosted-models');

const model = new HostedModel({
  url: 'https://my-model.hosted-models.runwayml.cloud/v1',
  token: 'my-private-hosted-model-token',
});

const prompt = 'Hey text generation model, finish my sentence';
model.query({ prompt }).then(result => console.log(result));
```

### Browser

If you prefer to access the library in the Browser using a `<script>` tag, you can include the code snippet below in your HTML files. Replace `hosted-models.js` with `hosted-models.min.js` if you prefer a minified build for production environments.

```html
<script src="https://cdn.jsdelivr.net/npm/@runwayml/hosted-models@latest/dist/hosted-models.js"></script>
```

This injects the library into the window and exposes it via the `rw` namespace.

```javascript
const model = new rw.HostedModel({
  url: 'https://my-model.hosted-models.runwayml.cloud/v1',
  token: 'my-private-hosted-model-token',
});

const prompt = 'Hey text generation model, finish my sentence';
model.query({ prompt }).then(result => console.log(result));
```

## Usage

This library is super simple to use; It exposes a single `HostedModels` class with only four methods:

- [`HostedModel`](#hostedmodels-constructor)
  - [`.info()`](#info-method)
  - [`.query()`](#query-method)
  - [`.isAwake()`](#isAwake-method)
  - [`.waitUntilAwake()`](#waitUntilAwake-method)

> Note: Be sure to use `rw.HostedModel()` if you are including the library via a `<script>` in the [Browser](#browser).

### `HostedModels` Constructor

The `HostedModel` constructor takes a configuration object with two properties, `url` and `token` (required only if the model is private).

```javascript
const model = new HostedModel({
  url: 'https://example-text-generator.hosted-models.runwayml.cloud/v1',
  token: 'my-private-hosted-model-token', // not required for public models
});
```

### `.info()` Method

This method returns the input/output spec expected by this model's `query()` method.

```javascript
const info = await model.info();
console.log(info);
//// Note: These values will be different for each model
// {
//   "description": "Generate text conditioned on prompt",
//   "name": "generate_batch",
//   "inputs": [
//     {
//       "default": "",
//       "description": null,
//       "minLength": 0,
//       "name": "prompt",
//       "type": "text"
//     },
//     ...
//   ],
//   "outputs": [
//     {
//       "default": "",
//       "description": null,
//       "minLength": 0,
//       "name": "generated_text",
//       "type": "text"
//     },
//     ...
//   ]
// }
```

### `.query()` Method

`query()` is used to trigger the model to process input, and return output.

```javascript
const result = await model.query({
  prompt: 'Hey text generation model, finish my sentence',
});
console.log(result);
//// Note: These values will be different for each model
// {
//   generated_text: 'Hey text generation model, finish my sentence please.',
//   encountered_end: true
// }
```

### `.isAwake()` Method

The `isAwake()` method returns `true` if the model is already awake and processing requests quickly, or `false` if it is still waking up. A model that is waking up can still process all requests (e.g. `info()` and `query()`), they just might take a bit longer to respond. Learn more about Hosted Model states [here](https://learn.runwayml.com/#/how-to/hosted-models?id=asleep-awakening-and-awake-states).

```javascript
if (!model.isAwake()) {
  showLoadingScreen(); // this is a fake function for demonstration
}

// A model doesn't have to be awake for you to make requests to it
await model.query(input);
```

> Note: A model that is waking up can still process all requests (e.g. `info()` and `query()`), they just might take a bit longer to respond. Learn more about Hosted Model states [here](https://learn.runwayml.com/#/how-to/hosted-models?id=asleep-awakening-and-awake-states).

### `.waitUntilAwake()` Method

The `.waitUntilAwake()` method returns a promise that will resolve as soon as the model is awake. This is useful if you'd prefer to wait to perform some action until after the model can be expected to process them quickly.

```javascript
setLoading(true); // this is a fake function for demonstration
await model.waitUntilAwake();
setLoading(false);

setProcessing(true); // this is also a fake function for demonstration
await model.query(input);
setProcessing(false);
```

> Note: A model that is waking up can still process all requests (e.g. `info()` and `query()`), they just might take a bit longer to respond. Learn more about Hosted Model states [here](https://learn.runwayml.com/#/how-to/hosted-models?id=asleep-awakening-and-awake-states).

## License

This library is released under the terms of the [MIT license](LICENSE).

## CHANGELOG

You can view a list of changes [here](CHANGELOG.md).
