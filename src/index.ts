import mysql from 'mysql2/promise';
import { ConnectionOptions } from 'mysql2';
import Chainable = Cypress.Chainable;

export type MySQLDetails = {
  db: ConnectionOptions;
  sql: string;
  values?: any;
};

export const configurePlugin = async (on: Cypress.PluginEvents) => {
  on('task', {
    query(args: MySQLDetails) {
      return execute_query(args).then((result: any) => {
        return result;
      });
    },
  });
};

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
