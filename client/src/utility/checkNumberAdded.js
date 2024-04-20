import { getUserDetails } from "../apis/api";

export const hasPhoneNumber = async () => {
    try {
        console.log("Fetching user details... from check number");
        const userDetails = await getUserDetails();
        console.log("User details:", userDetails);

        // Check if userDetails is not null and contains a phoneNumber field
        if (userDetails && userDetails.phoneNumber) {
            console.log("User has a phone number");
            return true; // User has a phone number
        } else {
            console.log("User does not have a phone number");
            return false; // User does not have a phone number
        }
    } catch (error) {
        console.error("Error fetching user details:", error);
        throw new Error(error.message);
    }
}
