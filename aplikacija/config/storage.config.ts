export const StorageConfig = {
    picture: {

        destination: '../storage/pictures/',
        urlPrefix: '/assets/pictures',
        maxAge: 1000 * 60 * 60 * 24 *7,// 7 dana
        fileSize: 10 * 1024 * 1024, //10MB in total
        resize: {

            small: {
                directory: 'small/',
                width: 320,
                height: 240,//automatski se preracunava
            },
        },
    },
};
