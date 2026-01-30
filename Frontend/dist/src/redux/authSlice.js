import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utility/api';
import apiList from '../../api.json';

// =======================
// THUNKS
// =======================

// Send OTP
export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (phone, { rejectWithValue }) => {
     console.log("Sending OTP to phone:", phone);
    try {
      const response = await api.post(apiList.auth.sendOtp, { phone });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Verify OTP
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ phone, otp }, { rejectWithValue }) => {
    try {
      const response = await api.post(apiList.auth.verifyOtp, {
        phone,
        otp
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Signup
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(apiList.auth.signup, userData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// =======================
// SLICE
// =======================

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loading: false,
    otpSent: false,
    otpVerified: false,
    user: null,
    error: null
  },
  reducers: {
    resetAuthState: (state) => {
      state.loading = false;
      state.otpSent = false;
      state.otpVerified = false;
      state.user = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // SEND OTP
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // VERIFY OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpVerified = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // SIGNUP
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
