describe('swapi-gui-people: PeoplePaginator component', () => {
  it('should allow going back and forth', () => {
    cy.visit('/iframe.html?id=peoplepaginator--primary&args=&knob-Count=12&knob-Per Page=4');
    cy.get(':nth-child(3) > button').click().click().should('be.disabled');
    cy.get(':nth-child(2) > button').click().click().should('be.disabled');
  });
});
