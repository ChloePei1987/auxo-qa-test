Feature: Jobs Practical - Stability Exercise

  Background:
    Given Load Job data
    And I navigate to the Job List page

  Scenario: View job details from Job List
    When I select a created job
    And I click on View More to view the job details
    Then I should be redirected to the Job Detail page

  Scenario: Update customer details within a job
    When I select a created job
    And I update valid customer information and submit it
    Then On the Edit Job screen, the customer details popup should be closed

  Scenario: Print job card shows print icon on Job List
    When I mark a created job
    And I click on the Print Job Card button
    Then Checked Booking will have a print icon
