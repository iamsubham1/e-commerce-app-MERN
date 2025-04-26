import { createSlice } from "@reduxjs/toolkit";
import { getUserDetails, updateAddress } from "../apis/api";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: {},
    loading: false,
    errors: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.loading = false;
      state.errors = null;
    },
    setUserDataloading: (state, action) => {
      state.loading = action.payload;
    },

    setUserDataErrors: (state, action) => {
      state.errors = action.payload;
      state.loading = false;
    },
  },
});

export const { setUserData, setUserDataloading, setUserDataErrors } =
  userSlice.actions;

//thunk middleware
export const getUserData = (cookie) => async (dispatch) => {
  dispatch(setUserDataloading(true));
  try {
    const userData = await getUserDetails(cookie);
    dispatch(setUserData(userData));
  } catch (error) {
    dispatch(setUserDataErrors(error.message));
  } finally {
    dispatch(setUserDataloading(false));
  }
};

// Thunk action to update user address
export const updateUserAddress =
  (addressId, addressData) => async (dispatch) => {
    dispatch(setUserDataloading(true));
    try {
      const response = await updateAddress(addressId, addressData);

      // Log the response to see what we're getting back
      console.log("Update address response:", response);

      if (response && response.user) {
        // The server returns the updated user object
        dispatch(setUserData(response.user));
        return true;
      } else if (
        response &&
        response.message === "Address updated successfully"
      ) {
        // If we got a success message but no user object, fetch the latest user data
        const userData = await getUserDetails();
        if (userData) {
          dispatch(setUserData(userData));
          return true;
        } else {
          dispatch(setUserDataErrors("Failed to get updated user data"));
          return false;
        }
      } else {
        dispatch(setUserDataErrors("Failed to update address"));
        return false;
      }
    } catch (error) {
      console.error("Error in updateUserAddress:", error);
      dispatch(setUserDataErrors(error.message));
      return false;
    } finally {
      dispatch(setUserDataloading(false));
    }
  };

export default userSlice.reducer;
