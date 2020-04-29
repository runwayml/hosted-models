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

## License

This library is released under the terms of the [MIT license](LICENSE).

## CHANGELOG

You can view a list of changes [here](CHANGELOG.md).
