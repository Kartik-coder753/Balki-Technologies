import { getApiApp } from '../src/server/createApiApp';

export const config = {
  api: {
    bodyParser: false
  }
};

const app = getApiApp();

export default function handler(req: any, res: any) {
  if (req && typeof req.url === 'string' && !req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : `/${req.url}`);
  }
  return app(req, res);
}
