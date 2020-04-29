import { HostedModel } from '../src/HostedModel';

async function main() {
  const model = new HostedModel({
    url: 'https://lotr.hosted-models.runwayml.cloud/v1/',
  });
  const result = await model.query({
    prompt: 'The one ring to',
    max_characters: 180,
  });
  console.log(result.generated_text);
}

main().catch(err => console.error(err));
