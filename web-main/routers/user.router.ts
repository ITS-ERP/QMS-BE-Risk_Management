import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();
const userController = new UserController();

// Find methods
router.get('/', (req, res) => userController.findAllUsers(req, res));
router.get('/search', (req, res) =>
  userController.findUsersByCriteria(req, res),
);
router.get('/:pkid', (req, res) => userController.findUserByID(req, res));
router.get('/exists', (req, res) => userController.userExists(req, res));

// Create methods
router.post('/', (req, res) => userController.createUser(req, res));
router.post('/bulk', (req, res) => userController.bulkCreateUsers(req, res));

// Update methods
router.put('/:pkid', (req, res) => userController.updateUser(req, res));
router.put('/bulk', (req, res) => userController.bulkUpdateUsers(req, res));

// Delete methods
router.delete('/soft/:pkid', (req, res) =>
  userController.softDeleteUser(req, res),
);
router.delete('/hard/:pkid', (req, res) =>
  userController.hardDeleteUser(req, res),
);

// Restore methods
router.post('/restore/:pkid', (req, res) =>
  userController.restoreUser(req, res),
);

export default router;
