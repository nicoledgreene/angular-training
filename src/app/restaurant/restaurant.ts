export interface Restaurant {
    name: string;
    slug: string;
    images: Images;
    menu: Menu;
    address: Address;
    _id: string;
}

interface Item {
    name: string;
    price: number;
}

interface Menu {
    lunch: Array<Item>;
    dinner: Array<Item>;
}

interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
}

interface Images {
    thumbnail: string;
    owner: string;
    banner: string;
}