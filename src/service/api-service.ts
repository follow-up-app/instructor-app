import axios from "axios";
import moment from "moment";
import { authHeader, authHeaderFormData } from "./auth-header";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import FileSystem from "expo-file-system"
// import fs from 'react-native-fs';

// const API_URL = `${process.env.REACT_APP_API_URL}`;
const API_URL = 'http://18.231.183.182/';

export const getUrl = () => {
    return API_URL;
}

export const getCurrentUser = async () => {
    const response = await axios.get(API_URL + "auth/me", { headers: await authHeader() });
    return response.data;
};

export const login = async (username: string, password: string) => {
    const response = await axios.post(API_URL + 'auth/', {
        username,
        password
    });
    if (response.data.access_token) {
        const expireTimestamp = moment().add(response.data.expires_in, 'minutes').valueOf();
        AsyncStorage.setItem("FollowUpAccessToken", response.data.access_token);
        AsyncStorage.setItem("FollowUpExpiresIn", JSON.stringify(expireTimestamp));
    }
    return response.data;
};

export const logout = async () => {
    AsyncStorage.removeItem("FollowUpAccessToken");
    AsyncStorage.removeItem("FollowUpExpiresIn");
};

export const getUserAvatarId = async (id: string) => {
    return API_URL + 'users/' + id + '/avatar';
}

export const getStudentAvatarId = (id: string) => {
    return API_URL + 'students/avatar/' + id;
}

export const getEvents = async () => {
    const response = await axios.get(API_URL + 'schedules/avalible-instructor', { headers: await authHeader() });
    return response.data;
}

export const eventId = async (id: string) => {
    const response = await axios.get(API_URL + 'follow-up/mobile-schedule/' + id, { headers: await authHeader() });
    return response.data;
}

export const skill = async (id: string) => {
    const response = await axios.get(API_URL + 'skills/' + id, { headers: await authHeader() });
    return response.data;
}

export const eventProducedures = async (event_id: string, procedure_id: string) => {
    const response = await axios.get(API_URL + 'execution/' + event_id + '/' + procedure_id, { headers: await authHeader() });
    return response.data;
}

export const execute = async (data: any) => {
    const response = await axios.post(API_URL + 'execution/', data, { headers: await authHeader() });
    return response.data;
}

export const updateSchedule = async (id: string,data: any) => {
    const response = await axios.put(API_URL + 'schedules/' + id + '/update', data, { headers: await authHeader() });
    return response.data;
}