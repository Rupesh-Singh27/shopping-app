import { FormControl, ValidationErrors } from "@angular/forms";


//Making Custom Validators
export class Luv2ShopValidators {
    

    //whitespace validation
    static notOnlyWhitespace(control: FormControl): ValidationErrors {

        //check if string only has whitespace
        if ((control.value != null) && (control.value.trim().length === 0)) {

            //invalid, return error object. HTML template will check this key
            return { 'notOnlyWhitespace': true };
        } else {

            //valid, return null
            return null;
        }


    }
}
