import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

/**
 * TECHNICAL TEST – CANDIDATE INSTRUCTIONS
 *
 * This test is intentionally written to mostly pass, but contains known issues.
 * Your task is NOT to add new features, but to improve test quality.
 * You may refactor freely, but the test must remain readable and reliable.
 */

let selectedJobText: string | undefined 

const sel = {
  // Job List selectors
  firstRow: 'tbody tr:not(.ant-table-measure-row):not([aria-hidden="true"])', 
  firstRowCheckbox:
    'tbody tr:not(.ant-table-measure-row):not([aria-hidden="true"]) input[type="checkbox"]',
  printBtn: '#ut-list-bulk-print',
  printedIcon: 'span[aria-label="printed"]',

  // Job Details selectors  
  viewMoreLink: 'a:contains("View More")', 

  customerMoreBtn: '#customer-more-action > .ant-btn',
  dropdownItem: '.ant-dropdown-menu-item', 

  // Customer Details Popup selectors
  firstName: 'div.ant-modal-wrap input[name$="firstName"]',
  lastName: 'div.ant-modal-wrap input[name$="lastName"]',
  mobileNumber: 'div.ant-modal-wrap input[name$="mobileNumber"]',
  phoneNumber: 'div.ant-modal-wrap input[name$="phoneNumber"]',
  email: 'div.ant-modal-wrap input[name$="email"]',
  saveBtn: 'div.ant-modal-wrap button:contains("Save")',
}

const Method = {
  GET: 'GET',
  PUT: 'PUT',
} as const

const webApiEndpoints = {
  job: {
    sortList: 'api/job-mgmt/odata/jobindex',
  },
}

Given('Load Job data', () => {
  cy.intercept(Method.GET, `**/${webApiEndpoints.job.sortList}*`).as('jobIndex')
  cy.intercept(Method.GET, '**/api/job-mgmt/jobs/**').as('getJob')
  cy.intercept(Method.PUT, '**/api/job-mgmt/jobs/**').as('updateJob')
})

Given('I navigate to the Job List page', () => {
  cy.loginUI()
  cy.visit('/job-management/jobs')
  cy.wait('@jobIndex')
})

When('I select a created job', () => {
  cy.get(sel.firstRow)
    .first()
    .invoke('text')
    .then((t) => {
      selectedJobText = t.trim()
    })
  cy.wait(300)
  cy.get(sel.firstRow).first().find('a').first().click()
  cy.wait(500)
})

When('I click on View More to view the job details', () => {
  cy.get(sel.viewMoreLink).click()
})

Then('I should be redirected to the Job Detail page', () => {
  cy.location('pathname').should('include', '/job-management/jobs')
})

When('I update valid customer information and submit it', () => {
  const updateCustomerData = {
    firstName: `Test${Date.now()}`,
    lastName: `User${Date.now()}`,
    mobileNumber: `021${Cypress._.random(1000000, 9999999)}`,
  }

  // Arbitrary wait
  cy.wait(1500)

  cy.get(sel.viewMoreLink).click()
  cy.get(sel.customerMoreBtn).first().click()
  cy.contains(sel.dropdownItem, 'Edit Customer Details').click()

  cy.get(sel.firstName).clear().type(updateCustomerData.firstName)
  cy.get(sel.lastName).clear().type(updateCustomerData.lastName)
  cy.get(sel.mobileNumber).clear().type(updateCustomerData.mobileNumber)

  cy.get(sel.saveBtn).click()
})

Then('On the Edit Job screen, the customer details popup should be closed', () => {
  cy.wait(500)
  cy.get('div.ant-modal-wrap').should('not.exist')
  cy.get('button:contains("More Actions")').should('be.visible')
})

When('I mark a created job', () => {
  cy.loginUI()
  cy.visit('/job-management/jobs')
  cy.wait('@jobIndex')
  cy.get(sel.firstRowCheckbox).first().click({ force: true })
  cy.get(sel.firstRow)
    .first()
    .invoke('text')
    .then((t) => {
      selectedJobText = t.trim()
    })
})

When('I click on the Print Job Card button', () => {
  cy.get(sel.printBtn).click()
  cy.wait(1000)
})

Then('Checked Booking will have a print icon', () => {
  cy.get(sel.firstRow)
    .first()
    .find('td')
    .eq(10)
    .find(sel.printedIcon)
    .should('exist')
})
