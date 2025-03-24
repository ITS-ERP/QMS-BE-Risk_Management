'use strict';

const baseSeeder = require('../interfaces/baseSeeder');

module.exports = {
  async up(queryInterface) {
    const users = [
      {
        username: 'johndoe',
        full_name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'borrower',
        password: 'password123',
      },
      {
        username: 'janedoe',
        full_name: 'Jane Doe',
        email: 'jane.doe@example.com',
        role: 'staff',
        password: 'password123',
      },
    ];

    const userRecords = users.map((user) => baseSeeder.createRecord(user));

    await queryInterface.bulkInsert('users', userRecords, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
