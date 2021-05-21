describe('swapi-gui-people: PeoplePage component', () => {
  it('should render & navigate the pages correctly', () => {
    const perPage = 1;
    const peopleNames = ['Luke Skywalker', 'C-3PO', 'R2-D2'];

    const peopleArgs = peopleNames.map((name, index) => `peopleNames[${index}]:${name}`).join(';');

    const maxPages = Math.ceil(peopleNames.length / perPage);

    cy.visit(`iframe.html?id=peoplepage--primary&args=perPage:${perPage};${peopleArgs}`);

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
  it('should allow searching & clearing search', () => {
    const lastname = 'Skywalker';
    const perPage = 1;
    const peopleWithoutLastname = ['C-3PO', 'R2-D2'];
    const peopleWithLastname = ['Luke', 'Lea'].map((name) => `${name} ${lastname}`);

    const peopleNames = peopleWithoutLastname.concat(peopleWithLastname);
    const maxPagesForSearch = Math.ceil(peopleWithLastname.length / perPage);

    const maxPages = Math.ceil(peopleNames.length / perPage);
    const peopleArgs = peopleNames.map((name, index) => `peopleNames[${index}]:${name}`).join(';');

    cy.visit(`iframe.html?id=peoplepage--primary&args=perPage:${perPage};${peopleArgs}`);
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
  it('should allow selecting a person to view their information', () => {
    const perPage = 1;
    const peopleNames = ['Luke Skywalker', 'C-3PO', 'R2-D2'];

    const peopleArgs = peopleNames.map((name, index) => `peopleNames[${index}]:${name}`).join(';');

    const maxPages = Math.ceil(peopleNames.length / perPage);

    cy.visit(`iframe.html?id=peoplepage--primary&args=perPage:${perPage};${peopleArgs}`);

    cy.get('._16okpVMjs9MxyzlDRog5UN').should('contain', peopleNames[0]).click();

    cy.get('._1VZJTJEQdzwUk1LUczy4Pz > :nth-child(1)').should('not.exist');
    cy.contains(`Page 1 of ${maxPages}`).should('not.exist');
    cy.get('h2').should('contain', peopleNames[0]);
  });
});
