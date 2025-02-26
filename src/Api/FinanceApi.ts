import axios from "axios";

export const purchase_orders = async (purchaseDate: number, products: any, totalAmount: number, remarks: string) => {
    try {
        const res = await axios.post("/finance/purchase_orders", { purchaseDate, products, totalAmount, remarks });
        return res.data;
    } catch (err) {
        throw err;
    }
};