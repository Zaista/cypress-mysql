# Introduction

Plugin that allows simple interactions with MySQL database using Cypress commands.

# Installation

run `npm install cypress-mysql`<br>
configure (see below)<br>
profit

# Usage

```
const sql = 'select * from some_table';
cy.query(sql).then(res => {
  cy.log(res); // outputs json array of selected rows 
});

const sql = 'insert into some_table (column_1, column_2) values ?';
const values = [[[1, 'a'], [2, 'b'], [3, 'c']]]; // yes, it's three square brackets, don't ask
cy.query(sql, values).then(res => {
  cy.log(res.affectedRows); // outputs 3
});

Supported commands:
    create database
    create/drop table
    any kind of select/join/insert/delete statetments
```

# Environment setup

Add the following `env` properties in your `cypress.json` file:
```
  "env": {
    "db": {
      "host": "localhost",
      "user": "user",
      "password": "password",
      "database": "database"
    }
  }
```

# Plugin configuration - JavaScript

In your `cypress/plugins/index.js` add the following:

```
const mysql = require('cypress-mysql');

module.exports = (on, config) => {
  mysql.configurePlugin(on);
}
```

In your `cypress/support/index.js` add the following:

```
const mysql = require('cypress-mysql');
mysql.addCommands();
```


# Plugin configuration - TypeScript

In your `cypress/plugins/index.ts` add the following:

```
import * as mysql from 'cypress-mysql';

/**
 * @type {Cypress.PluginConfig}
 */
export default (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {
    mysql.configurePlugin(on);
}
```

In your `cypress/support/index.ts` add the following:

```
import * as mysql from "cypress-mysql";
mysql.addCommands();
```

# Future development & support

Please create feature requests for things you'd like to see.<br>
Please raise issues for any problems you encounter.**