export class Product {
    //This class behaves like a DTO-- class properties matches to all the JSON properties  
    constructor(
        public id: number,
        public sku: string,
        public name: string,
        public description: string,
        public unitPrice: number,
        public imageUrl: string,
        public active: boolean,
        public unitsInStock: number,
        public dataCreated: Date,
        public lasUpdated: Date,
    ) { }
}
