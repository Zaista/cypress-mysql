import * as mysql from 'mysql2/promise';
import Chainable = Cypress.Chainable;

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      query(sql: string, values?: Array<any>): Chainable<Subject>;
    }
  }
}

export interface MySQLDetails {
  db: {
    host: string;
    user: string;
    password: string;
    database: string;
  };
  sql: string;
  values?: any;
}

export const configurePlugin = async (on: Cypress.PluginEvents) => {
  on('task', {
    query(args: MySQLDetails) {
      return execute_query(args).then((result: any) => {
        return result;
      });
    },
  });
};

export const addCommands = async () => {
  Cypress.Commands.add('query', query);

  console.log('MySQL plugin configured');
};

function query(sql: string, values?: Array<any>): Chainable {
  let args: MySQLDetails = {
    db: Cypress.env('db'),
    sql: sql,
    values,
  };

  validateDetails(args);

  return cy.task('query', args).then((result: any) => {
    return result;
  });
}

export function execute_query(args: MySQLDetails) {
  return mysql.createConnection(args.db).then((connection) => {
    const result = connection.query(args.sql, args.values).then(([result]) => {
      return result;
    });
    return connection.end().then(() => {
      return result;
    });
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
