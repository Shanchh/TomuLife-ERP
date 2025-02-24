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

export const delete_user_profile = async (email: string) => {
    try {
        const res = await axios.post("/admin/delete_user_profile", { email });
        return res.data;
    }
    catch (err) {
        throw err;
    }
}