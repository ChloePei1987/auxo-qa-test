import { defineConfig } from 'cypress'
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor'
import createEsbuildPlugin from '@badeball/cypress-cucumber-preprocessor/esbuild'
import createBundler from '@bahmutov/cypress-esbuild-preprocessor'

export default defineConfig({
  video: false,
  retries: 0,
  defaultCommandTimeout: 15000,
  requestTimeout: 15000,

  e2e: {
    viewportWidth: 1920,
    viewportHeight: 1080,
    chromeWebSecurity: false,
    fixturesFolder: 'cypress/fixtures',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.feature',
    excludeSpecPattern: ['**/*.md', '**/*.js'],
    baseUrl: 'https://tst.workshop.auxosoftware.com',

    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config)

      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      )

      return config
    },
  },
})
