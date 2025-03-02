import axios from "axios";

const BASE_URL = "http://localhost:";
export const PORT = 8080;
export const BASE_ROUTE = `${BASE_URL}${PORT}`;
const USER_ROUTE = `${BASE_ROUTE}/api/users`;
const GROUP_ROUTE = `${BASE_ROUTE}/api/groups`;
const CHALLENGE_ROUTE = `${BASE_ROUTE}/api/challenges`;
const NOTIFICATION_ROUTE = `${BASE_ROUTE}/api/notifications`;
const SHOP_ROUTE = `${BASE_ROUTE}/api/shop`;


export const registerUser = async (email: string, name: string) => {
    try{
        const response = axios.post(`${USER_ROUTE}/register`, {email, name});
        return response;
    }   catch (error : any) {
        console.error("Error logging in user:", error);
        throw new Error(error);
    }
};

export const getCreatedGroups = async (userId: string) => {
    try {
        const response = await axios.get(`${USER_ROUTE}/${userId}/createdGroups`);
        return response.data.groups;
    } catch (error: any) {
        console.error("Error getting created groups:", error);

    }
}

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
    

// Shop Endoints
export const getAllShopItemsByGroupId = async (groupId: string) => {
    try {
        const response = await axios.get(`${SHOP_ROUTE}/items/${groupId}`);
        return response.data.items;
    } catch (error: any) {
        console.error("Error getting shop items:", error);
        throw new Error(error);
    }
}

export const getShopItemById = async (id: string) => {
    try {
        const response = await axios.get(`${SHOP_ROUTE}/${id}`);
        return response.data.item;
    } catch (error: any) {
        console.error("Error getting shop item by id:", error);
        throw new Error(error);
    }
}

export const createShopItem = async (shopItemData: {
    name: string;
    description?: string;
    price: number;
    image?: string;
    groupId: string;
    availability: string;
    quantity: number;
}) => {
    try {
        const response = await axios.post(`${SHOP_ROUTE}/add-item`, shopItemData);
        return response.data.item;
    } catch (error: any) {
        console.error("Error creating shop item:", error);
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
        const response = await axios.get(`${CHALLENGE_ROUTE}/${challengeId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching challenge:", error);
        throw error;
    }
};

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
export const deleteNotification = async (notificationId: string, userId: string) => {
    try {
        const response = await axios.post(`${NOTIFICATION_ROUTE}/del`,  {notificationId, userId});
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

export const updateShopItem = async (shopItemData: {
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    groupId: string;
    quantity?: number;
    availability: string;
}) => {
    try {
        const response = await axios.post(`${SHOP_ROUTE}/update`, shopItemData);
        return response.data.item;
    } catch (error: any) {
        console.error("Error updating shop item:", error);
        throw new Error(error);
    }
};

export const purchaseShopItem = async (userId: string, groupId: string, itemId: string, quantity: number) => {
    try {
        const response = await axios.post(`${SHOP_ROUTE}/purchase`, {
            userId,
            groupId,
            itemId,
            quantity
        });
        return response.data;
    } catch (error: any) {
        console.error("Error purchasing item:", error);
        throw error;
    }
};

export const joinChallenge = async (userId: string, challengeCode: string, groupId: string) => {
    try {
        const response = await axios.post(`${CHALLENGE_ROUTE}/join`, {userId, challengeCode, groupId});
        return response.data;
    } catch (error: any) {
        console.error("Error joining challenge:", error);
        throw new Error(error);
    }
    
}
export const getJoinedChallenges = async (userId: string, groupId: string) => {
    try {
        const response = await axios.get(`${CHALLENGE_ROUTE}/getJoined/${userId}/${groupId}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching challenge:", error);
        throw error;
    }
}

export const approveChallenge = async (challengeId: string, userId: string, groupId: string) => {
    try {
        const response = await axios.post(`${CHALLENGE_ROUTE}/approve`, {challengeId, userId, groupId});
        return response.data;
    } catch (error: any) {
        console.error("Error approving challenge:", error);
        throw new Error(error);
    }
};
export const updateUser = async (id: string, name: string, profilePicture: string) => {
    try {
        const response = await axios.put(`${USER_ROUTE}/${id}`, {name, profilePicture});
        return response.data;
    } catch (error: any) {
        console.error("Error updating user:", error);
        throw new Error(error);
    }
}

export const updateRoles = async ( userIds: string[], groupId: string, newRole: string) => {
    try {
        const response = await axios.post(`${USER_ROUTE}/update-role`, { userIds, groupId, newRole});
        return response.data;
    } catch (error: any) {
        console.error("Error updating role:", error);
        throw new Error(error);
    }
}


export const getPurchasedItems = async (userId: string) => {
    try {
        const response = await axios.get(`${USER_ROUTE}/${userId}/purchasedItems`);
        return response.data.purchasedItems;
    } catch (error: any) {
        console.error("Error getting purchased items:", error);
        throw new Error(error);
    }
};


export const getUserDetailsWithChallenges = async (userId: string, groupId: string) => {
    try {
      const response = await axios.get(`${USER_ROUTE}/${userId}/details/${groupId}`);
      return response.data.data;
    } catch (error: any) {
      console.error("Error getting user details:", error);
      throw error;
    }
  };

export const updateQuantity = async (id: string, quantity: number) => {
    try {
        const response = await axios.post(`${SHOP_ROUTE}/updateQuantity`, {id, quantity});
        return response.data.item;
    } catch (error: any) {
        console.error("Error updating quantity:", error);
        throw new Error(error);
    }
}