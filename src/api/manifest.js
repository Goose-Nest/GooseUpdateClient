import axios from 'axios';

const url = '/distributions/app/manifests/latest?channel=canary&platform=win&arch=x86';

export default async () => {
  const resp = await axios.get(url);

  return resp.data;
};