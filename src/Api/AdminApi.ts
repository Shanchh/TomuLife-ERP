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

export const modify_role = async (uid: string, values: any) => {
    try {
        const res = await axios.post("/admin/modify_role", { uid, values });
        return res.data;
    }
    catch (err) {
        throw err;
    }
}

export const delete_role = async (uid: string) => {
    try {
        const res = await axios.post("/admin/delete_role", { uid });
        return res.data;
    }
    catch (err) {
        throw err;
    }
}

export const add_role = async (values: any) => {
    try {
        const res = await axios.post("/admin/add_role", { values });
        return res.data;
    }
    catch (err) {
        throw err;
    }
}

export const get_customers = async () => {
    try {
        const res = await axios.get("/admin/get_customers");
        return res.data.data;
    }
    catch (err) {
        throw err;
    }
}

export const modify_customer = async (uid: string, values: any) => {
    try {
        const res = await axios.post("/admin/modify_customer", { uid, values });
        return res.data;
    }
    catch (err) {
        throw err;
    }
}

export const delete_customer = async (uid: string) => {
    try {
        const res = await axios.post("/admin/delete_customer", { uid });
        return res.data;
    }
    catch (err) {
        throw err;
    }
}

export const add_customer = async (values: any) => {
    try {
        const res = await axios.post("/admin/add_customer", { values });
        return res.data;
    }
    catch (err) {
        throw err;
    }
}