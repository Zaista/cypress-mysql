import Chainable = Cypress.Chainable;
import { ConnectionOptions } from 'mysql2';
import { MySQLDetails } from './index';

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      query(sql: string, values?: Array<any>): Chainable<Subject>;
    }
  }
}

function query(sql: string, values?: Array<any>): Chainable {
  const db: ConnectionOptions = Cypress.expose().db;
  const args: MySQLDetails = {
    db,
    sql,
    values,
  };

  validateDetails(args);

  return cy.task('query', args).then((result: any) => {
    return result;
  });
}

function validateDetails(args: MySQLDetails) {
  if (!args.db) {
    throw new Error('Missing db environment variables');
  } else if (!args.db.host) {
    throw new Error('Missing db.host environment variable');
  } else if (!args.db.user) {
    throw new Error('Missing db.user environment variable');
  } else if (!args.db.password) {
    throw new Error('Missing db.password environment variable');
  } else if (!args.db.database) {
    throw new Error('Missing db.database environment variable');
  } else if (!args.sql) {
    throw new Error('Missing sql statement');
  }
}

export const addCommands = () => {
  Cypress.Commands.add('query', query);
  console.log('MySQL plugin configured');
};
