import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';

// models
import { User } from '../models/user';

// error handlers
import { BadRequestError } from '@team-ticketing/common';

// error handlers middlewares
import { validateRequest } from '@team-ticketing/common';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters')
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    const user = User.build({ email, password });
    await user.save();

    const userJwt = jwt.sign({
      id: user.id,
      email: user.email
    }, 
      process.env.JWT_KEY!
    );

    // in js; req.session.jwt = userJwt
    // to avoid type error
    req.session = { // this session will be modified by the cookieSession middleware before it reaches the browser
      // the data is stored in a session storage of the browser
      jwt: userJwt
    }

    res.status(201).send(user);
  }
);

export { router as signupRouter };
