import axios from "axios";

const BASE_URL = "http://localhost:";
export const PORT = 8080;
export const BASE_ROUTE = `${BASE_URL}${PORT}`;
const USER_ROUTE = `${BASE_ROUTE}/api/users`;
const GROUP_ROUTE = `${BASE_ROUTE}/api/groups`;
const NOTIFICATION_ROUTE = `${BASE_ROUTE}/api/notifications`;

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
    
// ...existing code...

// Get user notifications
export const getUserNotifications = async (userId: string) => {
    try {
        const response = await axios.get(`${NOTIFICATION_ROUTE}/${userId}`);
        return response.data.notifications;
    } catch (error: any) {
        console.error("Error getting user notifications:", error);
        throw new Error(error);
    }
}

// Accept notification (for group invites)
export const acceptNotification = async (notificationId: string, userId: string) => {
    try {
        const response = await axios.post(`${NOTIFICATION_ROUTE}/accept`, {notificationId, userId});
        return response.data;
    } catch (error: any) {
        console.error("Error accepting notification:", error);
        throw new Error(error);
    }
}

// Delete notification
export const deleteNotification = async (notificationId: string) => {
    try {
        const response = await axios.delete(`${NOTIFICATION_ROUTE}/notifications/${notificationId}`);
        return response.data;
    } catch (error: any) {
        console.error("Error deleting notification:", error);
        throw new Error(error);
    }
}

export const sendNotification = async (userId: string, groupId: string) => {
    try {
        const response = await axios.post(`${NOTIFICATION_ROUTE}/send`, {userId, groupId});
        return response.data;
    } catch (error: any) {
        console.error("Error sending notification:", error);
        throw new Error(error);
    }
}