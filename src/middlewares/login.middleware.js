import { body } from 'express-validator'

export const validationsLogin = [
    body('username').notEmpty().withMessage('El username es requerido'),
    body('pass').notEmpty().withMessage('El password es requerido')
]