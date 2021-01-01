import axios from 'axios';

export default async (manifest, moduleName) => {
  const resp = await axios.get(manifest.modules[moduleName].full.url, {
    responseType: 'arraybuffer'
  });

  return resp.data;
};