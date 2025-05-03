import { Transaction } from "@types";

const getAllTransactions = async () => {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    const token = loggedInUser ? JSON.parse(loggedInUser)?.token : null;
    
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/transactions", {
    method: "GET",
    headers: {
      "Content-Type" : "application/json",
      Authorization: `Bearer ${token}`
    }
  })
};

const addTransaction = async (newTrans : Transaction) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({newTrans}),
      });
  
      const data = await response.json()
      if (data.status === "error") throw new Error(data.errorMessage);
      if (data.status === "unauthorized") throw new Error(data.errorMessage);  
      return data;
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  }



const UserService = {
    getAllTransactions,
    addTransaction
  };
  
  export default UserService;