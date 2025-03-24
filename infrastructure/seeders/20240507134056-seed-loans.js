'use strict';

const baseSeeder = require('../interfaces/baseSeeder');

module.exports = {
  async up(queryInterface) {
    const loans = [
      {
        user_id: 1, // Assuming 'johndoe' has pkid = 1
        book_id: 1, // Assuming 'The Great Gatsby' has pkid = 1
        loan_date: new Date(),
        due_date: new Date(new Date().setDate(new Date().getDate() + 14)), // Two weeks from today
        status: 'borrowed',
      },
      {
        user_id: 2, // Assuming 'janedoe' has pkid = 2
        book_id: 2, // Assuming 'To Kill a Mockingbird' has pkid = 2
        loan_date: new Date(),
        due_date: new Date(new Date().setDate(new Date().getDate() + 14)), // Two weeks from today
        status: 'borrowed',
      },
    ];

    const loanRecords = loans.map((loan) => baseSeeder.createRecord(loan));

    await queryInterface.bulkInsert('loans', loanRecords, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('loans', null, {});
  },
};
