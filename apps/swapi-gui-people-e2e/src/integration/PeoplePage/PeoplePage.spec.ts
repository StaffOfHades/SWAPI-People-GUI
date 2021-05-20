describe('swapi-gui-people: PeoplePage component', () => {
  it('should render & navigate the pages correctly', () => {
    const perPage = 1;
    const peopleNames = ['Luke Skywalker', 'C-3PO', 'R2-D2'];
    const peopleKnobs = peopleNames.map((name, index) => `knob-People[${index}]=${name}`).join('&');

    const maxPages = Math.round(peopleNames.length / perPage);

    cy.visit(`iframe.html?id=peoplepage--primary&${peopleKnobs}&knob-Per Page=${perPage}`);
    cy.get('.holWNvt-innPRNFUITZci > li').should('contain', peopleNames[0]);
    cy.get('._1VZJTJEQdzwUk1LUczy4Pz > :nth-child(1)').should('contain', `Page 1 of ${maxPages}`);
    cy.get(':nth-child(3) > button').click();
    cy.get('.holWNvt-innPRNFUITZci > li')
      .should('not.contain', peopleNames[0])
      .should('contain', peopleNames[1]);
    cy.get('._1VZJTJEQdzwUk1LUczy4Pz > :nth-child(1)').should('contain', `Page 2 of ${maxPages}`);
    cy.get(':nth-child(3) > button').click();
    cy.get('.holWNvt-innPRNFUITZci > li')
      .should('not.contain', peopleNames[1])
      .should('contain', peopleNames[2]);
    cy.get('._1VZJTJEQdzwUk1LUczy4Pz > :nth-child(1)').should('contain', `Page 3 of ${maxPages}`);
    cy.get(':nth-child(2) > button').click();
    cy.get('.holWNvt-innPRNFUITZci > li')
      .should('not.contain', peopleNames[2])
      .should('contain', peopleNames[1]);
    cy.get('._1VZJTJEQdzwUk1LUczy4Pz > :nth-child(1)').should('contain', `Page 2 of ${maxPages}`);
  });
  it.only('should allow searching & clearing search', () => {
    const lastname = 'Skywalker';
    const perPage = 1;
    const peopleWithoutLastname = ['C-3PO', 'R2-D2'];
    const peopleWithLastname = ['Luke', 'Lea'].map((name) => `${name} ${lastname}`);

    const peopleNames = peopleWithoutLastname.concat(peopleWithLastname);
    const maxPagesForSearch = Math.round(peopleWithLastname.length / perPage);

    const maxPages = Math.round(peopleNames.length / perPage);
    const peopleKnobs = peopleNames.map((name, index) => `knob-People[${index}]=${name}`).join('&');

    cy.visit(`iframe.html?id=peoplepage--primary&${peopleKnobs}&knob-Per Page=${perPage}`);
    cy.get('.holWNvt-innPRNFUITZci > li').should('contain', peopleNames[0]);
    cy.get('._1VZJTJEQdzwUk1LUczy4Pz > :nth-child(1)').should('contain', `Page 1 of ${maxPages}`);
    cy.get('input').type(lastname);
    cy.get('[type="submit"]').click();
    cy.get('.holWNvt-innPRNFUITZci > li')
      .should('not.contain', peopleNames[0])
      .should('contain', peopleWithLastname[0]);
    cy.get('._1VZJTJEQdzwUk1LUczy4Pz > :nth-child(1)').should(
      'contain',
      `Page 1 of ${maxPagesForSearch}`
    );
    cy.get('._3QicIp11CDxcjx3i1FwFbk > [type="button"]').click();
    cy.get('.holWNvt-innPRNFUITZci > li')
      .should('not.contain', peopleWithLastname[0])
      .should('contain', peopleNames[0]);
    cy.get('._1VZJTJEQdzwUk1LUczy4Pz > :nth-child(1)').should('contain', `Page 1 of ${maxPages}`);
  });
});
