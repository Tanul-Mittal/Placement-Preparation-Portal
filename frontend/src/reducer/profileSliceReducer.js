import { combineReducers } from "@reduxjs/toolkit";
import profileSliceReducer from "../slices/profileSlice";

const rootReducer=combineReducers({
    profile:profileSliceReducer
})

export default rootReducer;