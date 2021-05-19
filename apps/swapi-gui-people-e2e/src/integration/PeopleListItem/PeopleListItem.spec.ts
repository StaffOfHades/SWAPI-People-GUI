describe('swapi-gui-people: PeopleListItem component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=peoplelistitem--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to swapi-gui-people!');
    });
});
