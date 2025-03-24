import { Router } from 'express';
import { LoanController } from '../controllers/loan.controller';

const router = Router();
const loanController = new LoanController();

// Find methods
router.get('/', (req, res) => loanController.findAllLoans(req, res));
router.get('/search', (req, res) =>
  loanController.findLoansByCriteria(req, res),
);
router.get('/:pkid', (req, res) => loanController.findLoanByID(req, res));
router.get('/exists', (req, res) => loanController.loanExists(req, res));

// Create methods
router.post('/', (req, res) => loanController.createLoan(req, res));
router.post('/bulk', (req, res) => loanController.bulkCreateLoans(req, res));
router.post('/lend', (req, res) => loanController.lendBook(req, res));

// Update methods
router.put('/:pkid', (req, res) => loanController.updateLoan(req, res));
router.put('/bulk', (req, res) => loanController.bulkUpdateLoans(req, res));

// Delete methods for both soft and hard deleting
router.delete('/soft/:pkid', (req, res) =>
  loanController.softDeleteLoan(req, res),
);
router.delete('/hard/:pkid', (req, res) =>
  loanController.hardDeleteLoan(req, res),
);

// Restore methods
router.post('/restore/:pkid', (req, res) =>
  loanController.restoreLoan(req, res),
);

// Return book
router.post('/return/:pkid', (req, res) => loanController.returnBook(req, res));

export default router;
