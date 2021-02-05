import * as Validator from "class-validator";
export class EditPrimaryPictureDTO {
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(1, 128)
    imagePath: string;
};