import * as Validator from "class-validator";
export class FlowerSearchDto{
    @Validator.IsOptional()
    @Validator.IsString()
    @Validator.Length(0,128)
    keywords: string;
    
    @Validator.IsPositive()
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 0,
    })
    @Validator.IsOptional()
    categoryId: number;

    @Validator.IsPositive()
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 0,
    })
    @Validator.IsOptional()
    userId: number;
    
    @Validator.IsOptional()
    @Validator.IsPositive()
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 2
        })
    priceMin: number;
    @Validator.IsOptional()
    @Validator.IsPositive()
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 2
        })
    priceMax: number;
    
    @Validator.IsOptional()
    @Validator.IsPositive()
    @Validator.IsNumber({
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 0
    })
    sizeMin: number;
    @Validator.IsOptional()
    @Validator.IsPositive()
    @Validator.IsNumber({
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 0
    })
    sizeMax: number;

    @Validator.IsOptional()
    @Validator.IsIn([ "seasonal", "annual", "perennial", ""])
    lifetime: "seasonal" | "annual" | "perennial" | "";

    @Validator.IsOptional()
    @Validator.IsString()
    @Validator.Length(0, 24)
    color: string;

    @Validator.IsOptional()
    createdAt: Date;
    @Validator.IsOptional()
    expiredAt: Date;

    @Validator.IsOptional()
    @Validator.IsIn([ "name", "price"])
    orderBy: 'name' | 'price';
    @Validator.IsOptional()
    @Validator.IsIn([ "ASC", "DESC"])
    orderDirection: 'ASC' | 'DESC';
    @Validator.IsOptional()
    @Validator.IsNumber({
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 0
    })
    page: number;
    @Validator.IsOptional()
    @Validator.IsIn([ 5 , 10 , 25 , 50 , 75])
    itemsPerPage: 5 | 10 | 25 | 50 | 75;
}