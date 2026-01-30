import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {API_URL }from '../constants/api';

export const useAuthStore = create((Set) => ({
  user: null,
  token: null,
  isLoading: false,
  isCheckingAuth:true,

  register: async (username, email, password) => {
    Set({ isLoading: true });
    try {
      const response = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "something went wrong");

      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);

      Set({ token: data.token, user: data.user, isLoading: false });

      return {
        success: true,
      };
    } catch (error) {
      Set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  login: async (email,password)=>{
    Set({isLoading: true});

    try {
       const response = await fetch(`${API_URL}/auth/login`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify({
            email,
            password,
        })
        })
        const data=await response.json();

        if(!response.ok) throw new Error(data.message || "something went wrong");

        await AsyncStorage.setItem("user",JSON.stringify(data.user));
        await AsyncStorage.setItem("token",data.token);

        Set({token:data.token, user: data.user, isLoading: false});
        return {success:true};

    } catch (error) {
        Set({isLoading: false});
        return {success:false, error:error.message};
    }
  },

 checkAuth: async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    const userJson = await AsyncStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;

    if (!token || !user) {
      Set({ token: null, user: null });
    } else {
      Set({ token, user });
    }
  } catch (error) {
    console.log("Auth check failed", error);
    Set({ token: null, user: null });
  } finally {
    Set({ isCheckingAuth: false });
  }
},


  logout: async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    Set({ token: null, user: null });
  },
}));
