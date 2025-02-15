import express from 'express';
import { createUser, loginUser, logoutCurrentUser, getAllUsers, getCurrentUserProfile, updateCurrentUserProfile, deleteUserById, getUserById, updateUserById} from '../controllers/userController.js';
import { authenticate, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(createUser)
    .get(authenticate, admin, getAllUsers);
router.post("/auth", loginUser);
router.post("/logout", logoutCurrentUser);

router.route("/profile")
    .get(authenticate, getCurrentUserProfile)
    .put(authenticate, updateCurrentUserProfile);

// admin routes
router.route('/:id')
    .delete(authenticate, admin, deleteUserById)
    .get(authenticate, admin, getUserById)
    .put(authenticate, admin, updateUserById);

export default router;