import axios from "axios";

export const get_roles = async () => {
    try {
        const res = await axios.get("/admin/get_roles");
        return res.data.data;
    }
    catch (err) {
        throw err;
    }
}

export const get_user_list = async () => {
    try {
        const res = await axios.get("/admin/get_user_list");
        return res.data.data;
    }
    catch (err) {
        throw err;
    }
}