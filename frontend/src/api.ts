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