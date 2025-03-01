import axios from "axios";


const BASE_URL = "http://localhost:";
export const PORT = 8080;
export const BASE_ROUTE = `${BASE_URL}${PORT}`;
const USER_ROUTE = `${BASE_ROUTE}/api/users`;
const GROUP_ROUTE = `${BASE_ROUTE}/api/groups`;

export const registerUser = async (email: string, name: string) => {
    try{
        const response = await axios.post(`${USER_ROUTE}/register`, {email, name});
        return response;
    }   catch (error : any) {
        console.error("Error logging in user:", error);
        throw new Error(error);
    }
};

export const getUserGroups = async (userId: string) => {
    try {
        const response = await axios.get(`${USER_ROUTE}/${userId}/joinedGroups`);
        return response.data.groups;
    } catch (error: any) {
        console.error("Error getting user groups:", error);
        throw new Error(error);
    }
}

export const getCreatedGroups = async (userId: string) => {
    try {
        const response = await axios.get(`${USER_ROUTE}/${userId}/createdGroups`);
        return response.data.groups;
    } catch (error: any) {
        console.error("Error getting created groups:", error);
        throw new Error(error);
    }
}