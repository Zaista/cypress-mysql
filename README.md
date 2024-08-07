# Introduction

Plugin that allows simple interactions with MySQL database using Cypress commands.

# Installation

run `npm install cypress-mysql`<br>
configure (see below)<br>
profit

# Usage

```javascript
const sql = 'select * from some_table';
cy.query(sql).then((res) => {
  cy.log(res); // outputs json array of selected rows
});

const sql = 'insert into some_table (column_1, column_2) values ?';
const values = [
  [
    [1, 'a'],
    [2, 'b'],
    [3, 'c'],
  ],
]; // yes, it's three square brackets, don't ask
cy.query(sql, values).then((res) => {
  cy.log(res.affectedRows); // outputs 3
});
```

Supported commands:

- create database
- create/drop table
- any kind of select/join/insert/delete statetments

# Environment setup

Add the following `env` properties in your `cypress.confing.js` file:

```javascript
  env: {
    db: {
      host: 'localhost',
      user: 'user',
      password: 'password',
      database: 'database'
    }
  }
```

# Plugin configuration - JavaScript

In your `cypress.config.js` add the following:

```javascript
const mysql = require('cypress-mysql');

module.exports = defineConfig({
  e2e: {
    env: {
      db: {
        host: 'localhost',
        user: 'cypress',
        password: 'cypress',
        database: 'cypress',
      },
    },
    async setupNodeEvents(on, config) {
      mysql.configurePlugin(on);
    },
  },
});
```

In your `cypress/support/e2e.js` add the following:

```javascript
const mysql = require('cypress-mysql');
mysql.addCommands();
```

# Plugin configuration - TypeScript

In your `cypress.config.ts` add the following:

```typescript
import * as mysql from 'cypress-mysql';

const defineConfig({
    e2e: {
        env: {
            db: {
                host: 'localhost',
                user: 'cypress',
                password: 'cypress',
                database: 'cypress'
            },
        },
        setupNodeEvents(on, config) {
            mysql.configurePlugin(on);
        },
    },
)}
```

In your `cypress/support/e2e.ts` add the following:

```typescript
import * as mysql from 'cypress-mysql';
mysql.addCommands();
```

# Future development & support

Please create feature requests for things you'd like to see.<br>
Please raise issues for any problems you encounter.\*\*
