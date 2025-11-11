import axios, { type AxiosResponse } from "axios"
import { wrapAxiosInterceptors, wrapAxiosRequest } from "./axios-request"
import { createAxiosInterceptors, withoutAxiosResponse } from "./axios-request/interceptors"

const failForCodeInterceptor = createAxiosInterceptors({
    type: "response",
    onResponse: (response) => {
        if (response.data.code !== 0) throw response.data.message
        return response
    },
})

export const createBaseRequest = () =>
    wrapAxiosRequest<true, "data", { code: number; message: string; raw: AxiosResponse }>(
        wrapAxiosInterceptors(axios.create(), [failForCodeInterceptor, withoutAxiosResponse({ rawKey: "raw" })]),
    )

export const api = createBaseRequest()
