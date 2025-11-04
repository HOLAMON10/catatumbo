export { };

declare global {
    namespace NodeJS {
        interface Global {
            uploader: any;
        }
    }
}