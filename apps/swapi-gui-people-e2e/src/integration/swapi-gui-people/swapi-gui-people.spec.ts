describe('swapi-gui-people: SwapiGuiPeople component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=swapiguipeople--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to swapi-gui-people!');
    });
});
