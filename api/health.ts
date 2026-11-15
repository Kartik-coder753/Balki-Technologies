import { createVercelHandler } from './_lib/handler';

export const config = {
  api: {
    bodyParser: false
  }
};

export default createVercelHandler('/api/health');
