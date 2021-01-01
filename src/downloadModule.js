import getFullModule from './api/fullModule.js';

import { brotliDecompressSync } from 'zlib';
import { readFileSync, mkdirSync, copyFileSync } from 'fs';
import { Readable } from 'stream';

import tar from 'tar';

const getBufferFromStream = async (stream) => {
  const chunks = [];
  
  stream.read();
  
  return await new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks)))
  });
};

export default async (dirBase, manifest, moduleName) => {
  const brotliData = await getFullModule(manifest, moduleName);
  const unbrotli = brotliDecompressSync(brotliData);

  console.log(unbrotli);

  const unbrotliStream = Readable.from(unbrotli);

  const extractPath = `${dirBase}/processing/${moduleName}`;

  mkdirSync(extractPath, { recursive: true });

  const extracingTar = unbrotliStream.pipe(
    tar.x({
      cwd: extractPath
    })
  );

  await new Promise((res) => {
    extracingTar.on('finish', () => res());
  });

  const deltaManifest = JSON.parse(readFileSync(`${extractPath}/delta_manifest.json`));

  console.log(deltaManifest);

  const finalDir = `${dirBase}/modules/${moduleName}-${manifest.modules[moduleName].full.module_version}/${moduleName}`;

  for (let f in deltaManifest.files) {
    const sha256 = deltaManifest.files[f].New.Sha256;

    // todo: check hash

    // console.log(f, sha256);

    console.log(f);

    mkdirSync(`${finalDir}/${f}`.split('/').slice(0, -1).join('/'), { recursive: true });

    copyFileSync(`${extractPath}/files/${f}`, `${finalDir}/${f}`);
  }
};