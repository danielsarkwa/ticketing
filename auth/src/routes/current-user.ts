import express from 'express';

// middlewares
import { currentUser } from "@team-ticketing/common";

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
