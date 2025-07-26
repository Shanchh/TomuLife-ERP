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

export interface Product {
    _id: string;
    number: number;
    productName: string;
    bottlesPerBox: number;
    retailPrice: number;
    costPerBox: number | null;
    costPerBottle: number | null;
    creator: {
        _id: string;
        nickname: string;
        email: string;
    };
    createAt: number;
}

export interface PurchaseProduct {
    productID: string;
    costPerBottle: number;
    purchaseQuantityBottles: number;
    costPerBox: number;
    purchaseQuantityBoxes: number;
    bottlesPerBox: number;
    itemAmount: number;
}

export interface PurchaseOrder {
    _id: string;
    purchaseAt: number;
    products: { [productID: string]: PurchaseProduct };
    totalAmount: number;
    remarks: string;
    creator: {
        _id: string;
        nickname: string;
        email: string;
    };
    createdAt: number;
}

export interface PurchaseStatisticsItem {
    productID: string;
    productName: string;
    count: number;
    boxes: number;
    bottles: number;
    subtotal: number;
}

export interface PurchaseStatistics {
    year: number;
    totalAmount: number;
    totalBoxes: number;
    totalBottles: number;
    ordersCount: number;
    productStats: PurchaseStatisticsItem[];
}

export interface SalesReport {
    _id: string;
    basicInfo: {
        purchaseDate: number;
        areaCode: string;
        customer: string;
        customerName: string;
        customerBookkeeping: string;
    };
    productSection: {
        remarks: string;
        products: {
            [productId: string]: {
                quantity: string;
                price: string;
            }
        }
    }
    billing: {
        paymentStatus: "unpaid" | "paid" | "gift";
        isTaxIncluded?: "included" | "excluded";
        receivableAmount?: number;
        invoiceNumber?: string;
        paymentDate?: number;
        paymentType?: "cash" | "eSunBank" | "yuantaBank" | "creditCard" | "linePay";
        remitCode?: string;
    };
    delivery: {
        deliveryMethod: "selfDelivery" | "hsinchuLogistics" | "customerCollect";
        deliveryBoxes?: number;
    };
    others: {
        remarks?: string;
    };
    creator: {
        _id: string;
        nickname: string;
        email: string;
    };
    createdAt: number;
}

export interface ActivityDetail {
    _id: string;
    time: {
        activityStartAt: number;
        activityEndAt: number;
    };
    activityName: string;
    incomes: {
        description: string;
        amount: number;
    }[];
    expenses: {
        description: string;
        amount: number;
    }[];
    sales: {
        [productId: string]: {
            quantity: number;
            discountQty: number;
            discountAmount: number;
            trialQty: number;
            giftQty: number;
            totalQty: number;
            totalPrice: number;
        };
    };
    costs: {
        [productId: string]: {
            unitCost: number;
            soldTotal: number;
            tastingQty: number;
            giftQty: number;
            totalQty: number;
            totalCost: number;
        };
    };
    summary: {
        totalProductRevenue: number;
        totalProductCost: number;
        totalManualIncome: number;
        totalManualExpense: number;
    };
    creator: {
        _id: string;
        nickname: string;
        email: string;
    };
    createAt: number;
}

export interface CustomerAnalyzeData {
    basic: {
        _id?: string;
        averageAmount: number;
        firstPurchase?: number;
        lastPurchase: number | null;
        totalAmount: number;
        orderCount: number;
        purchaseFrequencyDays: number | null;
    };
    calculateDiscount: number;
    monthlyData: {
        [month: string]: {
            total: number;
            items: {
                productId: string;
                name: string;
                quantity: number;
                unitPrice: number;
                subtotal: number;
            }[];
        };
    };
}

export interface CustomerTracking {
    _id: string;
    customer: string;
    customerName: string;
    contactDate: number;
    contactSubject: string;
    contactNote: string;
    creator: {
        _id: string;
        nickname: string;
        email: string;
    };
    createAt: number;
}

export interface InventoryData {
    inventoryQty: number;
    lastPurchaseDate: number;
    productId: string;
    productName: string;
    retailPrice: number;
}

export interface CustomerTierStats {
  _id: string;
  name: string;
  areaCode: string;
  bookkeeping: string;
  oneMonth: PeriodStats;
  threeMonth: PeriodStats;
  sixMonth: PeriodStats;
}

export interface PeriodStats {
  amount: number;
  count: number;
}