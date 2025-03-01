import axios from "axios";

const BASE_URL = "http://localhost:";
export const PORT = 8080;
export const BASE_ROUTE = `${BASE_URL}${PORT}`;
const USER_ROUTE = `${BASE_ROUTE}/api/users`;
const GROUP_ROUTE = `${BASE_ROUTE}/api/groups`;
const CHALLENGE_ROUTE = `${BASE_ROUTE}/api/challenges`;

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

    }
}
export const getUserByEmail = async (email: string) => {
    try {
        const response = await axios.get(`${USER_ROUTE}/email/${email}`);
        console.log(response);
        return response.data.user;
    } catch (error: any) {
        console.error("Error getting user by email:", error);
        throw new Error(error);
    }
}

export const getCreatedGroups = async (userId: string) => {
    try {
        const response = await axios.get(`${USER_ROUTE}/${userId}/createdGroups`);
        return response.data.groups;
    } catch (error: any) {
        console.error("Error getting created groups:", error);

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

export const createGroup = async (name: string, description: string, coin: {name: string, image: string}, profilePic: string, userId: string) => {
    try {
        const response = await axios.post(`${GROUP_ROUTE}/create`, {name, description, coin, profilePic, userId});
        return response.data.data;
    } catch (error: any) {
        console.error("Error creating group:", error);
        throw new Error(error);
    }
}

export const getGroupById = async (id: string) => {
    try {
        const response = await axios.get(`${GROUP_ROUTE}/${id}`);
        return response.data.group;
    } catch (error: any) {
        console.error("Error getting group by id:", error);
        throw new Error(error);
    }
}

export const getGroupUsers = async (id: string) => {
    try {
        const response = await axios.get(`${GROUP_ROUTE}/${id}/users`);
        return response.data.users;
    } catch (error: any) {
        console.error("Error getting group users:", error);
        throw new Error(error);
    }
}
    
export const createChallenge = async (
    title: string,
    description: string,
    coinsValue: number,
    creatorId: string,
    groupId: string
) => {
    try {
        const response = await axios.post(`${BASE_ROUTE}/api/challenges/create`, {
            title,
            description,
            coinsValue,
            creatorId,
            groupId
        });
        return response.data;
    } catch (error) {
        console.error("Error creating challenge:", error);
        throw error;
    }
};

export const getCreatedChallenges= async (userId: string,groupId: string) => {
    try {
        const response = await axios.get(`${CHALLENGE_ROUTE}/${userId}/${groupId}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching challenge:", error);
        throw error;
    }
};

export const getChallengeById = async (challengeId: string) => {
    try {
        const response = await axios.get(`${CHALLENGE_ROUTE}/detail/${challengeId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching challenge:", error);
        throw error;
    }
};