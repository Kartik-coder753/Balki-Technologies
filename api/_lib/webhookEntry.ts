import { createVercelHandler } from './handler';

export const config = {
  api: {
    bodyParser: false
  }
};

const handler = createVercelHandler('/api/razorpay/webhook');

export default handler;
