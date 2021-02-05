export default interface ApiFlowerDto {
    flowerId: number;
    name: string;
    size: number;
    lifetime: "seasonal" | "annual" | "perennial";
    price: number;
    description: string;
    createdAt: Date;
    expiredAt: Date;
    categoryId: number;
    userId: number;
    country: string;
    color: string;

    pictures: {
        pictureId: number;
        imagePath: string;
        isPrimary: number;
        
    }[],
    user:{
        forename: string;
        surname: string;
        phoneNumber: string;
        city: string;
    },
    category?: {
        name: string;
    }
}

