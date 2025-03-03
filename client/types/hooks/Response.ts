import { AxiosResponse } from "axios";

export interface TikTokDownloadTypes {
    file_path: string;
    message: string
}

export interface TiktokDownloadResponse extends AxiosResponse {
    data: TikTokDownloadTypes
}

export interface LoginTypes {
    email: string;
    password: string
}

export interface AuthResponseTypes {
    success: boolean;
    message: string;
    token: string;
    emailHasAccount?: boolean
}

export interface LoginResponse extends AxiosResponse {
    data: AuthResponseTypes;
}

export interface RegisterTypes extends LoginTypes {
    firstName: string
    lastName: string
}

export interface RegisterResponse extends AxiosResponse {
    data: AuthResponseTypes;  // Use the correct response type
}




