describe('template spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login')
  })

  
  it('should register successfully', () => {
    cy.get('a.font-bold').click();
    cy.get('[name="email"]').click();
    cy.get('[name="email"]').type('user@gmail.com');
    cy.get('[name="password"]').click();
    cy.get('[name="password"]').type('12345');
    cy.get('[name="confirmPassword"]').click();
    cy.get('[name="confirmPassword"]').type('12345');
    cy.get('button.w-auto').click();
  });

  it('should login successfully', () => {
    cy.get('[name="email"]').click();
    cy.get('[name="email"]').type('user@gmail.com');
    cy.get('[name="password"]').click();
    cy.get('[name="password"]').type('12345');
    cy.get('button.w-auto').click();
  });


    it('should create a new garment', () => {
     
    });

    it('should edit an existing garment', () => {
      
    });

    it('should delete a garment', () => {
      
    });
    
  });



