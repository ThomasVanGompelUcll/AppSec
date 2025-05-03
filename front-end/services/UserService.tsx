import { User } from "@types";
import { METHODS } from "http";
import { headers } from "next/headers";

const getAllusers = async () => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/users", {
    method: "GET",
    headers: {
      "Content-Type" : "application/json"
    }
  })
};

const getUserById = async(id : number) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + `/users/${id}`, {
    method: "GET",
    headers: {
      "Content-Type" : "application/json"
    },
  });
}

const loginUser = (user : User) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + `/users/login`, {
    method: "POST",
    headers: {
      "Content-Type" : "application/json",
    },
    body: JSON.stringify(user)
  })
}


const UserService = {
    getAllusers,
    getUserById,
    loginUser
  };
  
  export default UserService;