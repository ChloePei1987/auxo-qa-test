/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />

Cypress.Commands.add('loginUI', () => {
  cy.session(
    'performLoginSequence',
    () => {
      cy.visit('/login')
      cy.get('input[type="email"], input[name="username"], input[autocomplete="username"]', { timeout: 20000 })
        .first()
        .clear()
        .type(Cypress.env('username'))
      cy.get('input[type="password"], input[name="password"], input[autocomplete="current-password"]')
        .first()
        .clear()
        .type(Cypress.env('password'), { log: false })
      cy.contains('button', /log\s*in/i).click()
      cy.url().should('contain', '/dashboard', { timeout: 10000 })
    },
    {
      validate() {
        cy.visit('/dashboard')
        cy.url().should('contain', '/dashboard')
      },
      cacheAcrossSpecs: true,
    }
  )
})

declare global {
  namespace Cypress {
    interface Chainable {
      loginUI(): Chainable<void>
    }
  }
}

export {}
