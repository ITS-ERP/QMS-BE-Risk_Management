'use strict';

import * as fs from 'fs';
import * as path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
const basename = path.basename(__filename);
const env = process.env.NODE_ENV ?? 'development';
const config = require(path.resolve(__dirname, '..', 'config', 'config.js'))[
  env
];
const db: { [key: string]: any } = {};

let sequelize: Sequelize;
if (config.use_env_variable) {
  if (process.env[config.use_env_variable]) {
    sequelize = new Sequelize(
      process.env[config.use_env_variable] as string,
      config,
    );
  } else {
    throw new Error(
      `Environment variable '${config.use_env_variable}' not found.`,
    );
  }
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

fs.readdirSync(__dirname)
  .filter((file: string) => {
    return (
      !file.startsWith('.') &&
      file !== basename &&
      !fs.lstatSync(path.resolve(__dirname, file)).isDirectory() &&
      file.endsWith('.ts') &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach((file: any) => {
    const model = require(path.resolve(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
