import axios from "axios";

export const get_customer_analyze = async (_id: string,) => {
    try {
        const res = await axios.post("/analyze/get_customer_analyze", { _id });
        return res.data.data;
    } catch (err) {
        throw err;
    }
};