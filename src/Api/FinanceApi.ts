import axios from "axios";

export const purchase_orders = async (purchaseDate: number, products: any, totalAmount: number, remarks: string) => {
    try {
        const res = await axios.post("/finance/purchase_orders", { purchaseDate, products, totalAmount, remarks });
        return res.data;
    } catch (err) {
        throw err;
    }
};

export const get_purchase_orders = async () => {
    try {
        const res = await axios.get("/finance/get_purchase_orders");
        return res.data.data;
    } catch (err) {
        throw err;
    }
};

export const delete_purchase_orders = async (uid: string) => {
    try {
        const res = await axios.post("/finance/delete_purchase_orders", { uid });
        return res.data;
    }
    catch (err) {
        throw err;
    }
}

export const update_purchase_orders = async (dataId: string, purchaseDate: number, products: any, totalAmount: number, remarks: string) => {
    try {
        const res = await axios.post("/finance/update_purchase_orders", { dataId, purchaseDate, products, totalAmount, remarks });
        return res.data;
    } catch (err) {
        throw err;
    }
};