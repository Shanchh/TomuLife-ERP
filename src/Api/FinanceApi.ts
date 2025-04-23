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

export const get_purchase_statistics = async (year: number) => {
    try {
        const res = await axios.post("/finance/get_purchase_statistics", { year });
        return res.data;
    } catch (err) {
        throw err;
    }
};

export const create_sales_reports = async (values: any) => {
    try {
        const res = await axios.post("/finance/create_sales_reports", { values });
        return res.data;
    } catch (err) {
        throw err;
    }
};

export const get_sales_report = async (page = 1, page_size = 10, query: any = {}) => {
    try {
        const res = await axios.post("/finance/get_sales_report", { page, page_size, query });
        return res.data;
    } catch (err) {
        throw err;
    }
};

export const delete_sales_report = async (_id: string) => {
    try {
        const res = await axios.post("/finance/delete_sales_report", { _id });
        return res.data;
    }
    catch (err) {
        throw err;
    }
};

export const update_sales_reports = async (dataId: string, values: any) => {
    try {
        const res = await axios.post("/finance/update_sales_reports", { dataId, values });
        return res.data;
    } catch (err) {
        throw err;
    }
};

export const get_sales_payment_summary = async (startTime: number, endTime: number) => {
    try {
        const res = await axios.post("/finance/get_sales_payment_summary", { startTime, endTime });
        return res.data;
    } catch (err) {
        throw err;
    }
};

export const get_payment_method_summary = async (startTime: number, endTime: number) => {
    try {
        const res = await axios.post("/finance/get_payment_method_summary", { startTime, endTime });
        return res.data;
    } catch (err) {
        throw err;
    }
};

export const get_products_sales_statistics = async (startTime: number, endTime: number) => {
    try {
        const res = await axios.post("/finance/get_products_sales_statistics", { startTime, endTime });
        return res.data.data;
    } catch (err) {
        throw err;
    }
};

export const add_activity_detail = async (values: any) => {
    try {
        const res = await axios.post("/finance/add_activity_detail", { values });
        return res.data;
    } catch (err) {
        throw err;
    }
};