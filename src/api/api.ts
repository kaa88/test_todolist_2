import Axios, { AxiosError, AxiosResponse } from "axios";

export type ApiResponse<T = any, D = any> = AxiosResponse<T, D>
export class ApiError<T> extends AxiosError<T> {}
export type ApiMessage = {message: string}

const settings = {
	baseURL: process.env.REACT_APP_API_URL,
	timeout: 10000,
}

export const api = Axios.create(settings)
