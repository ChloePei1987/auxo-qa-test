Feature: Merge Parts functionality

Scenario: Successfully merge one part into another
  Given I am on the Parts page
  Given I create two parts via UI
  When I merge the From part into the To part
  Then the From part should no longer exist
  And the quantity of the To part should increase