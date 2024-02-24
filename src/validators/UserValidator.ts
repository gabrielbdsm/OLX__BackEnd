import { checkSchema } from "express-validator";


export const editAction = checkSchema({
    token: {
        notEmpty : true
    },
    name: {
        optional: true,
        trim: true,
        isLength:{
            options: {min : 2}
        },
        errorMessage: "Nome invalido , precisa ter no mínimo 2 caractere"
    },
    email: {
        optional: true,
        isEmail: true,
        normalizeEmail: true,
        errorMessage: "E-mail inválido"
    },
    password: {
        optional: true,
        isLength: {
            options : {min: 8}
        },
        errorMessage: "Senha precisa ter no mínimo 8 caractere"
    },
    state: {
        optional: true,
        notEmpty: true,
        errorMessage: "Estado precisa ser preenchido"
    }
})
