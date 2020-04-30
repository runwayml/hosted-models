# Changelog

## v0.3.0

- Add usage section in README.
- More descriptive error message for `NotFoundError`.
- Wake up model during `HostedModel` construction.
- Add optional `pollIntervalMillis` parameter to `HostedModel.waitUntilAwake()` method.

## v0.2.0

- Add CI/CD releases via CircleCI
- Fix infinite loop with `npm run build`.
- Add inline documentation with TypeDoc, generated in `docs/`.
- Add `InvalidArgumentError` type and throw it when invalid arguments are passed to public methods.

## v0.1.0

Initial release.
