export interface IMyChallenges {
    challengeID: string; // MongoDB ObjectId as string
    status: 'pending' | 'completed'; // Status can only be 'pending' or 'completed'
  }
  
  export interface ICreatedChallenge {
    challengeID: string;
    users: string[]; // Array of user ObjectIds
    challengeCode: string;
  }
  
  export interface IUserGroup {
    GID: string; // Group ID
    coins: number;
    totalCoins: number;
    myChallenges: IMyChallenges[]; // Array of challenges
    role: 'admin' | 'moderator' | 'user' | 'guest'; // Restricted to valid roles
    createdChallenges: ICreatedChallenge[]; // Array of created challenges
  }
  
  export interface IUser {
    _id: string; // MongoDB ObjectId as string
    name: string;
    email: string;
    desc: string;
    profilePicture: string;
    groups: IUserGroup[]; // Array of user groups
  }
  
  export interface IGroup {
    _id: string; // MongoDB ObjectId as string
    name: string;
    users: string[]; // Array of user ObjectIds
    profilePic: string;
    description: string;
    coin: {
      name: string;
      image: string;
    };
    shopItems: string[]; // Array of ShopItem ObjectIds
  }
  
  export interface IChallenge {
    _id: string; // MongoDB ObjectId as string
    title: string;
    description: string;
    coinsValue: number;
    creator: string; // User ObjectId
    users: string[]; // Array of user ObjectIds
    code: string;
  }