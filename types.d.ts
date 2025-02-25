import { locations } from "./src/Constants/locations";

export interface User {
    _id: string,
    email: string,
    nickname: string,
    role: string,
    createAt: number,
}

export interface Role {
    _id: string,
    color: string,
    createAt: number,
    creator: {
        _id: string,
        nickname: string,
        email: string,
    },
    level: number,
    name: string,
    tag: string,
}

export type AreaCode = keyof typeof locations;

export interface Customer {
    _id: string;
    areaCode: AreaCode;
    bookkeeping: string;
    customerName: string;
    deliveryAddress: string;
    contactPerson: string;
    contactMethod: string;
    invoiceTitle: string;
    taxId: string;
    creator: {
        _id: string;
        nickname: string;
        email: string;
    };
    createAt: number;
}