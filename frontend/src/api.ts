import axios from "axios";


const BASE_URL = "http://localhost:";
export const PORT = 8080;
export const BASE_ROUTE = `${BASE_URL}${PORT}`;
const USER_ROUTE = `${BASE_ROUTE}/api/users`;
const GROUP_ROUTE = `${BASE_ROUTE}/api/groups`;

export const registerUser = async (email: string, name: string) => {
    try{
        const response = axios.post(`${USER_ROUTE}/register`, {email, name});
        return response;
    }   catch (error : any) {
        console.error("Error logging in user:", error);
        throw new Error(error);
    }
};

export const getUserByEmail = async (email: string) => {
    try {
        const response = await axios.get(`${USER_ROUTE}/email/${email}`);
        return response.data.user;
    } catch (error: any) {
        console.error("Error getting user by email:", error);
        throw new Error(error);
    }
}

export const getUserById = async (id : string) => {
    try {
        const response = await axios.get(`${USER_ROUTE}/${id}`);
        return response.data.user;
    } catch (error: any) {
        console.error("Error getting user by id:", error);
        throw new Error(error);
    }
}