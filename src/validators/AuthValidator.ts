import { checkSchema } from "express-validator";


export const signup = checkSchema({
    name: {
        trim: true,
        isLength:{
            options: {min : 2}
        },
        errorMessage: "Nome invalido , precisa ter no mínimo 2 caractere"
    },
    email: {
        isEmail: true,
        normalizeEmail: true,
        errorMessage: "E-mail inválido"
    },
    password: {
        isLength: {
            options : {min: 8}
        },
        errorMessage: "Senha precisa ter no mínimo 8 caractere"
    },
    state: {
        notEmpty: true,
        errorMessage: "Estado precisa ser preenchido"
    }
})

export const signin = checkSchema({
    email: {
        isEmail: true,
        normalizeEmail: true,
        errorMessage: "E-mail inválido"
    },
    passwordHash: {
        isLength: {
            options : {min: 8}
        },
        errorMessage: "Senha precisa ter no mínimo 8 caractere"
    }
})