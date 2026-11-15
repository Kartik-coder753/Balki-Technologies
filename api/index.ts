import { getApiApp } from '../src/server/createApiApp';

export const config = {
  api: {
    bodyParser: false
  }
};

const app = getApiApp();

export default app;
