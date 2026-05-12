import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

When("the user enters the Gherkin web page", (): void => {
    cy.visit("https://cucumber.io/docs/gherkin/")
})

Then("the home page should display", (): void  => {
    cy.title().should("eq", "Gherkin | Cucumber")
})