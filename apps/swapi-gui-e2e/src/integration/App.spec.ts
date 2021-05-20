describe('swapi-gui', () => {
  it('should load people page correctly', () => {
    cy.intercept('GET', 'http://swapi.dev/api/people/?page=1', {
      fixture: 'people-page-1.json',
    }).as('getPeoplePage1');

    cy.visit('/');

    cy.wait('@getPeoplePage1');

    cy.fixture('people-page-1.json').as('peoplePage1');

    cy.get('@peoplePage1').then((page) => {
      cy.get('.PeopleList_people-list__1_L3M > li').each((el, index) => {
        cy.wrap(el).should('contain', page.results[index].name);
      });
    });
  });
  it('should allow navigation people pages', () => {
    cy.intercept('GET', 'http://swapi.dev/api/people/?page=1', {
      delay: 100,
      fixture: 'people-page-1.json',
    }).as('getPeoplePage1');
    cy.intercept('GET', 'http://swapi.dev/api/people/?page=2', {
      delay: 100,
      fixture: 'people-page-2.json',
    }).as('getPeoplePage2');

    cy.visit('/');

    cy.wait('@getPeoplePage1');

    cy.fixture('people-page-2.json').as('peoplePage2');

    cy.get(':nth-child(3) > button').click().click();

    cy.get('.PeopleList_people-list__1_L3M > :nth-child(1)').should('contain', 'Loading');

    cy.wait('@getPeoplePage2');

    cy.get(':nth-child(3) > button').click();

    cy.get('@peoplePage2').then((page) => {
      cy.get('.PeopleList_people-list__1_L3M > li').each((el, index) => {
        cy.wrap(el).should('contain', page.results[index + 2].name);
      });
    });
  });
  it('should allow searching for a people by name', () => {
    cy.intercept('GET', 'http://swapi.dev/api/people/?page=1&search=Skywalker', {
      delay: 100,
      fixture: 'people-search-skywalker-page-1.json',
    }).as('getPeopleSearchSkywalkerPage1');
    cy.intercept('GET', 'http://swapi.dev/api/people/?page=1', {
      delay: 100,
      fixture: 'people-page-1.json',
    }).as('getPeoplePage1');

    cy.visit('/');

    cy.wait('@getPeoplePage1');

    cy.fixture('people-search-skywalker-page-1.json').as('peopleSearchSkywalkerPage1');

    cy.get('input').type('Skywalker{enter}');

    cy.get('.PeopleList_people-list__1_L3M > :nth-child(1)').should('contain', 'Loading');

    cy.wait('@getPeopleSearchSkywalkerPage1');

    cy.get('@peopleSearchSkywalkerPage1').then((page) => {
      cy.get('.PeopleList_people-list__1_L3M > li').each((el, index) => {
        cy.wrap(el).should('contain', page.results[index]?.name ?? '\u00a0');
      });
    });
  });
  it('should allow clearing search query and return default results', () => {
    cy.intercept('GET', 'http://swapi.dev/api/people/?page=1&search=Skywalker', {
      delay: 100,
      fixture: 'people-search-skywalker-page-1.json',
    }).as('getPeopleSearchSkywalkerPage1');
    cy.intercept('GET', 'http://swapi.dev/api/people/?page=1', {
      delay: 100,
      fixture: 'people-page-1.json',
    }).as('getPeoplePage1');

    cy.visit('/');

    cy.wait('@getPeoplePage1');

    cy.fixture('people-page-1.json').as('peoplePage1');

    cy.get('input').type('Skywalker{enter}');

    cy.get('.PeopleList_people-list__1_L3M > :nth-child(1)').should('contain', 'Loading');

    cy.wait('@getPeopleSearchSkywalkerPage1');

    cy.get('.PeopleSearchbar_people-searchbar__2wZLf > [type="button"]').click();

    cy.get('.PeopleList_people-list__1_L3M > :nth-child(1)').should('contain', 'Loading');

    cy.wait('@getPeoplePage1');

    cy.get('input').should('be.empty');

    cy.get('@peoplePage1').then((page) => {
      cy.get('.PeopleList_people-list__1_L3M > li').each((el, index) => {
        cy.wrap(el).should('contain', page.results[index].name);
      });
    });
  });
});
