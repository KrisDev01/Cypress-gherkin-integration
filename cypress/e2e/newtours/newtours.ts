import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("precondition", (): void  => {
    cy.visit("https://demo.guru99.com/test/newtours/")
})

When("action", (): void => {
    cy.title().should("eq", "Welcome: Mercury Tours")
})

Then("testable outcome", (): void  => {
    cy.title().should("eq", "Welcome: Mercury Tours")
})