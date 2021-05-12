import {checkSchema, Schema, ParamSchema} from 'express-validator';

const createProductSchema = (isStrict: boolean, prefix?: string): Schema => {
    const nameSchema: ParamSchema = {
        isString: true,
        rtrim: {
            options: ' ',
        },
        isLength: {
            options: {
                min: 2
            }
        }, errorMessage: 'name must be a valid string whit at least 2 characters'
    };
    const yearSchema: ParamSchema = {
        isInt: true,
        isString: {negated: true},
        errorMessage: 'year must be an integer'
    };
    const priceSchema: ParamSchema = {
        isNumeric: true,
        isString: {negated: true},
        custom: {
            options: (value: number) => {
                return value > 0;
            }
        },
        errorMessage: 'price must be an numeric value > 0.00'
    };
    if (!isStrict) {
        const optional = {
            options: {
                nullable: true
            }
        };
        nameSchema.optional = optional;
        yearSchema.optional = optional;
        priceSchema.optional = optional;
    }
    if (prefix) {
        const result: Schema = {};
        result[prefix + '.name'] = nameSchema;
        result[prefix + '.year'] = yearSchema;
        result[prefix + '.price'] = priceSchema;
        return result;
    }
    return {
        name: nameSchema,
        year: yearSchema,
        price: priceSchema
    }
};

export const validateNewProductBody = checkSchema(createProductSchema(true));

export const validateDelete = checkSchema({
    productId: {
        in: 'params',
        isMongoId: true,
        errorMessage: 'id not is valide'
    }
});

export const validateProductNotify = checkSchema({
    productId: {
        in: 'params',
        isMongoId: true,
        errorMessage: 'id not is valide'
    }, email: {
        isEmail: true,
        in: 'body',
        errorMessage: 'email is not a email'
    },
    /*data: {
        isJSON: true,
        errorMessage: 'data is not a json'
    },*/
    ...createProductSchema(false,'data')
});