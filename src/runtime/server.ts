import { loadConfig } from '../config/env.js';
import { createApp } from '../composition/root.js';

const config = loadConfig();
const runtime = await createApp(config);

await runtime.start();
