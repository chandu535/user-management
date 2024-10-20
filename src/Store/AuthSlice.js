import { createSlice } from "@reduxjs/toolkit";

export const SigninSlice = createSlice({
  name: "Signin",
  initialState: {
    user_details: {},
    access_token: "",
    refresh_token: "",
  },
  reducers: {
    setUserDetails(state, data) {
      state.user_details = data.payload;
    },
  },
});
export const { setUserDetails } = SigninSlice.actions;

export default SigninSlice.reducer;
