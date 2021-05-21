describe('swapi-gui: /people/:id', () => {
  it('should allow navigating to an individual person page', () => {
    cy.intercept('GET', 'http://swapi.dev/api/people/?page=1', {
      delay: 100,
      fixture: 'people-page-1.json',
    }).as('getPeoplePage1');

    cy.fixture('people-page-1.json').then((page) => {
      const [person] = page.results;
      const { name, url } = person;
      cy.visit(`/people/${url}`);

      cy.wait('@getPeoplePage1');

      cy.url().should('include', url);
      cy.get('h2').should('contain', page.results[0].name);
    });
  });
});
