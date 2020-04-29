const { HostedModel } = require('@runway/hosted-models');

async function main() {
  const model = new HostedModel({
    url: 'https://lotr.hosted-models.runwayml.cloud/v1/',
  });
  // await model.waitUntilAwake();
  const result = await model.query({
    prompt: 'The one ring to',
    max_characters: 180,
  });
  console.log(result.generated_text);
}

main().catch(err => console.error(err));
