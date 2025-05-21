import axios from "axios";

export const get_customer_analyze = async (_id: string) => {
    try {
        const res = await axios.post("/analyze/get_customer_analyze", { _id });
        return res.data.data;
    } catch (err) {
        throw err;
    }
};

export const add_customer_trackings = async (values: any) => {
    try {
        const res = await axios.post("/analyze/add_customer_trackings", { values });
        return res.data;
    } catch (err) {
        throw err;
    }
};

export const get_customer_trackings = async (_id: string) => {
    try {
        const res = await axios.post("/analyze/get_customer_trackings", { _id });
        return res.data.data;
    } catch (err) {
        throw err;
    }
};

export const get_all_customer_tier = async () => {
    try {
        const res = await axios.get("/analyze/get_all_customer_tier");
        return res.data.data;
    } catch (err) {
        throw err;
    }
};