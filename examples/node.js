const { HostedModel } = require('@runwayml/hosted-models');

async function main() {
  const model = new HostedModel({
    url: 'https://my-model.hosted-models.runwayml.cloud/v1',
    token: 'my-private-hosted-model-token',
  });
  const result = await model.query({
    prompt: 'Hey text generation model, finish my sentence',
  });
  console.log(result.generated_text);
}

main().catch(err => console.error(err));
