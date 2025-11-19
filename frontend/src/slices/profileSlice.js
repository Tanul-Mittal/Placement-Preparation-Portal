import { createSlice } from "@reduxjs/toolkit";

const TOKEN_EXPIRATION_HOURS = 18;
const tokenExpirationTime = localStorage.getItem(
    "Hire_Vision_token_expire"
);
const tokenValid = tokenExpirationTime
    ? new Date().getTime() < parseInt(tokenExpirationTime, 10)
    : false;

if(!tokenValid){
    localStorage.clear();
}

const initialState = {
    user: tokenValid
        ? localStorage.getItem("Hire_Vision_user")
            ? JSON.parse(localStorage.getItem("Hire_Vision_user"))
            : null
        : null,
    token: tokenValid
        ? localStorage.getItem("Hire_Vision_token")
            ? JSON.parse(localStorage.getItem("Hire_Vision_token"))
            : null
        : null,
    signUpData: null,
    lightMode:true,
};

export const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
            localStorage.setItem(
                "Hire_Vision_user",
                JSON.stringify(action.payload)
            );
        },
        setToken(state, action) {
            state.token = action.payload;
            localStorage.setItem(
                "Hire_Vision_token",
                JSON.stringify(action.payload)
            );
            localStorage.setItem(
                "Hire_Vision_token_expire",
                new Date().getTime() +TOKEN_EXPIRATION_HOURS * 60 * 60 * 1000
            );
        },
        setSignupData(state, action) {
            state.signUpData = action.payload;
        },
        setLightMode(state,action){
            state.lightMode=action.payload;
        },
        logout(state) {
            state.user = null;
            state.token = null;
            state.signUpData = null;
            localStorage.removeItem("Hire_Vision_user");
            localStorage.removeItem("Hire_Vision_token");
            localStorage.removeItem("Hire_Vision_token_expire");
        },
    },
});

export const { setUser, setToken, setSignupData, setLightMode, logout } = profileSlice.actions;
export default profileSlice.reducer;
