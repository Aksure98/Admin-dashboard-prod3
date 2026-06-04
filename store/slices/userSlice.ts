import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: string;
  created_at?: string;
  logo: string;
}

const initialState: UserState = {
  full_name: "",
  email: "",
  role: "",
  status: "",
  id: "",
  created_at: "",
  logo: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
    clearUser: () => initialState,
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
