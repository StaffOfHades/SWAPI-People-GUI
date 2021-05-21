describe('swapi-gui-people: PeoplePaginator component', () => {
  it('should allow going back and forth', () => {
    const count = 12;
    const perPage = 4;

    const pages = Math.ceil(count / perPage);

    cy.visit(`/iframe.html?id=peoplepaginator--primary&args=count:${count};perPage:${perPage}`);
    cy.get(':nth-child(3) > button').click().click().should('be.disabled');
    cy.get(':nth-child(2) > button').click().click().should('be.disabled');
  });
});
