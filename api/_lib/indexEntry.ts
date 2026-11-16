import { createVercelHandler } from './handler';

export const config = {
  api: {
    bodyParser: false
  }
};

const handler = createVercelHandler();

export default handler;
