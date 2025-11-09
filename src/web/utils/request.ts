import axios, { type AxiosResponse } from "axios"
import { wrapAxiosInterceptors, wrapAxiosRequest } from "./axios-request"
import { withoutAxiosResponse } from "./axios-request/interceptors"

export const createBaseRequest = () =>
    wrapAxiosRequest<true, "data", { code: number; message: string; raw: AxiosResponse }>(
        wrapAxiosInterceptors(axios.create(), [withoutAxiosResponse({ rawKey: "raw" })]),
    )

export const api = createBaseRequest()
