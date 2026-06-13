import { defineConfig } from 'cypress'
import { configurePlugin } from 'cypress-mysql';

export default defineConfig({
  allowCypressEnv: false,
  e2e: {
    expose: {
      db: {
        host: 'localhost',
        user: 'cypress',
        password: 'cypress',
        database: 'cypress'
      }
    },
    setupNodeEvents(on, config) {
      configurePlugin(on);
      return config;
    }
  }
})
