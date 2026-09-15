import path from 'node:path';
import { SamModel, AutoProcessor, env } from '@huggingface/transformers';

env.cacheDir = path.join(process.cwd(), '.cache', 'sofa-models');
const modelId = 'Xenova/slimsam-77-uniform';
console.log('Preparing the local sofa selection model...');
const [model] = await Promise.all([
  SamModel.from_pretrained(modelId, { dtype: 'fp32', device: 'cpu', session_options: { intraOpNumThreads: 2, interOpNumThreads: 1 } }),
  AutoProcessor.from_pretrained(modelId),
]);
await model.dispose();
console.log('Sofa preview model is cached. Colour previews need no API key or per-image service.');
