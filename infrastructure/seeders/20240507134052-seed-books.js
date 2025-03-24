'use strict';

const baseSeeder = require('../interfaces/baseSeeder');

module.exports = {
  async up(queryInterface) {
    const books = [
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '9780743273565',
        publication_date: new Date('1925-04-10'),
        available_copies: 5,
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '9780061120084',
        publication_date: new Date('1960-07-11'),
        available_copies: 3,
      },
    ];

    const bookRecords = books.map((book) => baseSeeder.createRecord(book));

    await queryInterface.bulkInsert('books', bookRecords, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('books', null, {});
  },
};
