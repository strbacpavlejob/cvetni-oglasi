import * as Validator from "class-validator";
export class addFlowerDto {
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(2, 128)
    name: string;

    @Validator.IsPositive()
    @Validator.IsNotEmpty()
    @Validator.IsNumber({
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 0
    })
    size: number;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.IsIn([ "seasonal", "annual", "perennial" ])
    lifetime: "seasonal" | "annual" | "perennial";

    @Validator.IsPositive()
    @Validator.IsNotEmpty()
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 2
        })
    price: string;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(20, 10000)
    description: string;

    expiredAt: Date;

    categoryId: number;
    userId: number;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(2, 45)
    country: string;
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(3, 24)
    color: string;
};