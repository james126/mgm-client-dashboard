import { ValidationErrors } from '@angular/forms'

export const formatErrors = (arr: Array<string>): ValidationErrors => {
        const errors: ValidationErrors = {}

        arr.forEach((err:string) => {
            switch (err){
                case 'invalidPassword':
                    errors['invalidPassword'] = true;
                    break;
                case 'requiresUppercase':
                    errors['requiresUppercase'] = true;
                    break;
                case 'requiresLowercase':
                    errors['requiresLowercase'] = true;
                    break;
                case 'requiresNumeric':
                    errors['requiresNumeric'] = true;
                    break;
                case 'requiresSpecial':
                    errors['requiresSpecial'] = true;
                    break;
            }
        })
        return errors
}
