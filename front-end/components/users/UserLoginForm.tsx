// import UserService from "@services/UserService";
// import { StatusMessage } from "@types";
// import { eventNames } from "process";
// import { useState } from "react";
// import { User } from "@types";



// const UserLoginForm: React.FC<> ({}) => {
//     const [statusMessage, setStatusMessage] = useState<StatusMessage>();
//     const handleSubmit = async (event) => {
//         event.preventDefault();

//         // clearErrors();

//         // if(!validate()){
//         //     return;
//         // }

//         const user = {phoneNumber, password};
//         const response = await UserService.loginUser(user);


//         if(response.status === 200) {
//             setStatusMessage([message: t('login succes'), type: 'succes'])
        
//             const user = await response.json
//             sessionStorage.setItem(
//                 'loggedInUser',
//                 JSON.stringify({
//                     token: user.token,
//                     firstname: user.firstname,
//                     phonenumber: user.phonenumber,
//                     role: user.role
//                 })
//             )
//         }
//     }
// }