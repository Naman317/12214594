import axios from 'axios';

const STACKS = ['frontend', 'backend'];
const LEVELS = ['info', 'warn', 'error', 'fatal'];
const PACKAGES = ['handler', 'db', 'middleware', 'api'];
const LOG_ENDPOINT = 'http://20.244.56.144/evaluation-service/logs';

let AUTH_TOKEN = null;

if (typeof window === 'undefined') {
  const dotenv = await import('dotenv');
  dotenv.config();
  AUTH_TOKEN = process.env.AUTH_TOKEN;
} else {
  AUTH_TOKEN = 'your-frontend-test-token-here';
}

export const Log = async (stack, level, pkg, message) => {
  try {
    if (!STACKS.includes(stack)) throw new Error('Invalid stack');
    if (!LEVELS.includes(level)) throw new Error('Invalid log level');
    if (!PACKAGES.includes(pkg)) throw new Error('Invalid package name');

    if (!AUTH_TOKEN) {
      console.error('[Logger] AUTH_TOKEN is missing');
      return;
    }

    if (message.length > 300) {
      message = message.slice(0, 297) + '...';
    }

    const payload = { stack, level, package: pkg, message };

    const response = await axios.post(LOG_ENDPOINT, payload, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(`[Log Success] ${stack}/${pkg}/${level}: ${message}`);
    return response.data;
  } catch (err) {
    console.error(`[Log Failure] ${stack}/${pkg}/${level}: ${message}`, err?.response?.data || err.message);
  }
};
