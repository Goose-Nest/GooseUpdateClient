// process command line arguments
import axios from 'axios';

const argv = process.argv.slice(2);
const apiBase = argv.shift() || 'https://discord.com/api/updates/'; // Base URL is the first argument
const dirBase = argv.shift() || './out'; // Dir base is the second, optional argument

console.log(`API Base: ${apiBase}`);
console.log(`Dir Base: ${dirBase}`);

axios.defaults.baseURL = apiBase;

import getManifest from './api/manifest.js';

const manifest = await getManifest();
console.log(manifest);

import downloadModule from './downloadModule.js';

for (let m of manifest.required_modules) {
  await downloadModule(dirBase, manifest, m);
}