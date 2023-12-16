import AsyncStorage from "@react-native-async-storage/async-storage";

export async function authHeader() {
  const token = await AsyncStorage.getItem("FollowUpAccessToken");
  if (token) {
    return {
      Authorization: 'Bearer ' + token
    };
  }
  else {
    return { Authorization: '' };
  }
}

export function authHeaderFormData() {
  const token = AsyncStorage.getItem("FollowUpAccessToken");
  if (token) {
    return {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json',
      Authorization: 'Bearer ' + token,
    };
  }
  else {
    return { Authorization: '' };
  }
}