import { axiosInstance } from "."

export const handleLogin =async(email,password)=>{
    const response = await axiosInstance.post('auth/login', {email,password});
    return response.data;
}