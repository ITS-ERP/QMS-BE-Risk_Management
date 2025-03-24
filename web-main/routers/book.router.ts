import { Router } from 'express';
import { BookController } from '../controllers/book.controller';

const router = Router();
const bookController = new BookController();

// Find methods
router.get('/', (req, res) => bookController.findAllBooks(req, res));
router.get('/search', (req, res) =>
  bookController.findBooksByCriteria(req, res),
);
router.get('/:pkid', (req, res) => bookController.findBookByID(req, res));
router.get('/exists', (req, res) => bookController.bookExists(req, res));

// Create methods
router.post('/', (req, res) => bookController.createBook(req, res));
router.post('/bulk', (req, res) => bookController.bulkCreateBooks(req, res));

// Update methods
router.put('/:pkid', (req, res) => bookController.updateBook(req, res));
router.put('/bulk', (req, res) => bookController.bulkUpdateBooks(req, res));

/// Delete methods
router.delete('/soft/:pkid', (req, res) =>
  bookController.softDeleteBook(req, res),
);
router.delete('/hard/:pkid', (req, res) =>
  bookController.hardDeleteBook(req, res),
);

// Restore methods
router.post('/restore/:pkid', (req, res) =>
  bookController.restoreBook(req, res),
);

export default router;
