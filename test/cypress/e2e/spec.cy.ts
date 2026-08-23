describe('run cypress-mysql in cypress project', () => {
  before(() => {
    cy.query('create database cypress')
    cy.query('drop table if exists query')
    cy.query('create table query (int_column INT, str_column VARCHAR(20))')
    cy.query('insert into query (int_column, str_column) values ?',
    [
      [
        [1, 'one'],
        [2, 'two'],
        [3, 'three']
      ]
    ])
  })

  it('should run without errors', () => {
    cy.query('select * from query').then((rows: any) => {
      expect(rows).to.have.length(3)
      expect(rows[0]).to.deep.equal({ int_column: 1, str_column: 'one' })
    })
  })
})
