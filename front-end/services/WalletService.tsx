import { Wallet } from "@types";
import { METHODS } from "http";
import { headers } from "next/headers";

const getAllWallets = async () => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/wallets", {
    method: "GET",
    headers: {
      "Content-Type" : "application/json"
    }
  })
};

const getWalletById = async(walletId : number) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + `/wallets/${walletId}`, {
    method: "GET",
    headers: {
      "Content-Type" : "application/json"
    },
  });
}

const addWallet = async (newWallet : Wallet) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/wallets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({newWallet}),
      });
  
      const data = await response.json()
      if (data.status === "error") throw new Error(data.errorMessage);
      if (data.status === "unauthorized") throw new Error(data.errorMessage);  
      return data;
    } catch (error) {
      console.error("Error creating wallet:", error);
      throw error;
    }
  }
  
const WalletService = {
  getAllWallets,
  getWalletById,
  addWallet,

};

export default WalletService;