describe('swapi-gui-people: PeopleSearchbar component', () => {
  it('should only allow searching when user types', () => {
    cy.visit('/iframe.html?id=peoplesearchbar--primary');
    cy.get('[type="submit"]').should('be.disabled');
    cy.get('input').type('Skywalker');
    cy.get('[type="submit"]').click();
  });
  it('should clear input on button click', () => {
    cy.visit('/iframe.html?id=peoplesearchbar--primary');
    cy.get('input').type('Skywalker');
    cy.get('[type="button"]').click();
    cy.get('[type="submit"]').should('be.disabled');
    cy.get('input').should('be.empty');
  });
});
