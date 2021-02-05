import * as Validator from "class-validator";
export class EditUserDto {
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(6, 128)
    password: string;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(2, 64)
    forename: string;
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(2, 64)
    surname: string;
    @Validator.IsNotEmpty()
    @Validator.IsPhoneNumber(null)
    phoneNumber: string;
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(2, 32)
    city: string;
};