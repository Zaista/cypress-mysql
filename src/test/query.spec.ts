import * as assert from 'assert';
import { execute_query, MySQLDetails } from '../index';

const default_args: MySQLDetails = {
  db: {
    host: 'localhost',
    user: 'cypress',
    password: 'cypress',
    database: 'cypress',
  },
  sql: 'select * from query',
};

describe('Query tests', () => {
  before(async () => {
    const create_db_sql = 'create database cypress';
    await execute_query({ db: default_args.db, sql: create_db_sql }).catch(
      (err: any) => {
        if (err.toString().includes('; database exists')) {
          // ok, database already exists
        } else {
          throw err;
        }
      },
    );

    const drop_table_sql = 'drop table if exists query';
    await execute_query({ db: default_args.db, sql: drop_table_sql });

    const create_table_sql =
      'create table query (int_column INT, str_column VARCHAR(20))';
    await execute_query({ db: default_args.db, sql: create_table_sql });

    const insert_sql = 'insert into query (int_column, str_column) values ?';
    const values = [
      [1, 'one'],
      [2, 'two'],
      [3, 'three'],
    ];
    await execute_query({
      db: default_args.db,
      sql: insert_sql,
      values: [values],
    });

    const drop_join_table_sql = 'drop table if exists join_table';
    await execute_query({ db: default_args.db, sql: drop_join_table_sql });

    const create_join_table_sql =
      'create table join_table (int_column INT, str_column VARCHAR(20))';
    await execute_query({ db: default_args.db, sql: create_join_table_sql });

    const join_insert_sql =
      'insert into join_table (int_column, str_column) values ?';
    const join_values = [
      [1, 'join on one'],
      [2, 'join on two'],
    ];
    await execute_query({
      db: default_args.db,
      sql: join_insert_sql,
      values: [join_values],
    });
  });

  it('Should fail with missing user error', async () => {
    const args = {
      db: {
        host: 'localhost',
        user: '',
        password: 'cypress',
        database: 'cypress',
      },
      sql: 'select * from test',
    };
    await execute_query(args)
      .then(() => {
        throw new Error('Should not reach this point');
      })
      .catch((err: any) => {
        assert.match(err.toString(), /Error: Access denied for user/);
      });
  });

  it('Should fail with missing password error', async () => {
    const args = {
      db: {
        host: 'localhost',
        user: 'cypress',
        password: '',
        database: 'cypress',
      },
      sql: 'select * from query',
    };
    await execute_query(args)
      .then(() => {
        throw new Error('Should not reach this point');
      })
      .catch((err: any) => {
        assert.match(err.toString(), /Error: Access denied for user/);
      });
  });

  it('Should fail with missing database error', async () => {
    const args = {
      db: {
        host: 'localhost',
        user: 'cypress',
        password: 'cypress',
        database: '',
      },
      sql: 'select * from query',
    };
    await execute_query(args)
      .then(() => {
        throw new Error('Should not reach this point');
      })
      .catch((err: any) => {
        assert.equal(err.toString(), 'Error: No database selected');
      });
  });

  it('Should select', async () => {
    const result = [
      { int_column: 1, str_column: 'one' },
      {
        int_column: 2,
        str_column: 'two',
      },
      { int_column: 3, str_column: 'three' },
    ];
    await execute_query(default_args).then((res: any) => {
      assert.deepStrictEqual(res, result);
    });
  });

  it('Should select and order desc', async () => {
    const result = [
      { int_column: 3, str_column: 'three' },
      {
        int_column: 2,
        str_column: 'two',
      },
      { int_column: 1, str_column: 'one' },
    ];
    const sql = 'select * from query order by int_column desc';
    await execute_query({ db: default_args.db, sql }).then((res: any) => {
      assert.deepStrictEqual(res, result);
    });
  });

  it('Should select and limit', async () => {
    const result = [
      { int_column: 1, str_column: 'one' },
      {
        int_column: 2,
        str_column: 'two',
      },
    ];
    const sql = 'select * from query limit 2';
    await execute_query({ db: default_args.db, sql }).then((res: any) => {
      assert.deepStrictEqual(res, result);
    });
  });

  it('Should select where', async () => {
    const result = [{ str_column: 'two' }];
    const sql = 'select str_column from query where int_column = 2';
    await execute_query({ db: default_args.db, sql }).then((res: any) => {
      assert.deepStrictEqual(res, result);
    });
  });

  it('Should select where like', async () => {
    const result = [{ int_column: 3 }];
    const sql = 'select int_column from query where str_column like "%hree%"';
    await execute_query({ db: default_args.db, sql }).then((res: any) => {
      assert.deepStrictEqual(res, result);
    });
  });

  it('Should insert single', async () => {
    const sql =
      'insert into query (int_column, str_column) values (13, "new insert")';
    await execute_query({ db: default_args.db, sql }).then((res: any) => {
      assert.strictEqual(res.affectedRows, 1);
    });
  });

  it('Should update single', async () => {
    const sql =
      'update query set str_column = "updated insert" where int_column = 13';
    await execute_query({ db: default_args.db, sql }).then((res: any) => {
      assert.strictEqual(res.affectedRows, 1);
    });
    const select_sql = 'select str_column from query where int_column = 13';
    await execute_query({ db: default_args.db, sql: select_sql }).then(
      (res: any) => {
        assert.deepStrictEqual(res, [{ str_column: 'updated insert' }]);
      },
    );
  });

  it('Should insert multiple', async () => {
    const sql = 'insert into query (int_column, str_column) values ?';
    const values = [
      [
        [14, 'first of many'],
        [15, 'second of many'],
      ],
    ];
    await execute_query({ db: default_args.db, sql, values }).then(
      (res: any) => {
        assert.strictEqual(res.affectedRows, 2);
      },
    );
    await execute_query(default_args).then((res: any) => {
      assert.strictEqual(res.length, 6);
    });
  });

  it('Should delete single and afterwards select nothing', async () => {
    const sql = 'delete from query where int_column = 13';
    await execute_query({ db: default_args.db, sql }).then((res: any) => {
      assert.strictEqual(res.affectedRows, 1);
    });
    const select_sql = 'select * from query where int_column = 13';
    await execute_query({ db: default_args.db, sql: select_sql }).then(
      (res: any) => {
        assert.deepStrictEqual(res, []);
      },
    );
  });

  it('Should join', async () => {
    const result = [
      { int_column: 1, a: 'one', b: 'join on one' },
      {
        int_column: 2,
        a: 'two',
        b: 'join on two',
      },
    ];
    const sql =
      'select a.int_column, a.str_column as a, b.str_column as b from query as a join join_table as b on a.int_column = b.int_column';
    await execute_query({ db: default_args.db, sql }).then((res: any) => {
      assert.deepStrictEqual(res, result);
    });
  });
});
