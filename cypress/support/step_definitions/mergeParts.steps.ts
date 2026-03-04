import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

let fromPartName = `AUTO-FROM-${Date.now()}`
let toPartName = `AUTO-TO-${Date.now()}`
let fromQty = 5
let toQty = 10

const sel = {
  // Part List selectors
  partMenuURL: '/inventory/parts',
  creatPartBtn: 'New Part',
  
  // Part Details selectors  
  partCode: 'input[name="number"]', 
  saveBtn: 'Save',
  stockedCheckbox: 'input[name="isTracked"]',
  adjustStockBtn: '#ut-adjust-stock',
  ModalWindow: '[role="dialog"]',

  // Merge Parts selectors
  mergeBtn: 'Merge',
  modalBody: '.ant-modal-body',
  MergeAndDeleteBtn: 'Merge & Delete',
  confirmMergeBtn: 'Yes, I want to proceed',

}

// ========================
// GIVEN
// ========================

Given('I am on the Parts page', () => {
  cy.loginUI()
  cy.visit(sel.partMenuURL)
  cy.intercept('GET', '**/api/job-mgmt/parts/**').as('getPart')
  cy.intercept('POST', '**/inventory-levels**').as('saveStock')
})

Given('I create two parts via UI', () => {

  cy.contains(sel.creatPartBtn).click()

  cy.get(sel.partCode).type(fromPartName)
  cy.get(sel.stockedCheckbox).click({ force: true }).should('be.checked')
  cy.contains(sel.saveBtn).click()
  cy.contains('Notes').should('be.visible') // Ensure part details page is loaded
  cy.wait('@getPart')

  
  cy.get(sel.adjustStockBtn).should('be.visible')
  .click()
  cy.contains('Stock Adjustment').should('be.visible') 
  cy.get(sel.ModalWindow).within(() => {
    cy.get('input[name="stockAdjustment.delta"]').clear().type(fromQty.toString())
    cy.get('input[name="stockAdjustment.notes"]').clear().type('test data setup')
    cy.contains('button', 'Confirm').click()
  })
  cy.wait('@saveStock') 
  cy.visit(sel.partMenuURL)

  cy.contains(sel.creatPartBtn).click()
  cy.get(sel.partCode).type(toPartName)
  cy.get(sel.stockedCheckbox).click({ force: true }).should('be.checked')
  cy.contains(sel.saveBtn).click()
  cy.contains('Notes').should('be.visible') 
  cy.wait('@getPart')

  
  cy.get(sel.adjustStockBtn).should('be.visible')
  .click()
  cy.contains('Stock Adjustment').should('be.visible') 
    cy.get(sel.ModalWindow).within(() => {
    cy.get('input[name="stockAdjustment.delta"]').clear().type(toQty.toString())
    cy.get('input[name="stockAdjustment.notes"]').clear().type('test data setup')
    cy.contains('button', 'Confirm').click()
  })
  cy.wait('@saveStock')
  cy.visit(sel.partMenuURL)
})

// ========================
// WHEN
// ========================

When('I merge the From part into the To part', () => {

  cy.selectPartCheckbox(fromPartName)

  cy.selectPartCheckbox(toPartName)
 
  cy.contains(sel.mergeBtn).click()

  cy.get(sel.modalBody)
  .contains(toPartName)
  .click()

  cy.contains(sel.MergeAndDeleteBtn).click()
  cy.contains(sel.confirmMergeBtn).click()
})

// ========================
// THEN
// ========================

Then('the From part should no longer exist', () => {

  cy.visit(sel.partMenuURL)

  cy.contains(fromPartName).should('not.exist')

})

Then('the quantity of the To part should increase', () => {

   const expectedQty = fromQty + toQty
   const formattedQty = expectedQty.toFixed(2)
   cy.contains('td', toPartName)
    .parents('tr')
    .find('div.text-right')
    .first()
    .should('have.text', formattedQty)

})