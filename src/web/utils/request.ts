import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios"
import qs from "qs"

/**
 * 向 URL 中组装参数
 */
export function urlParams(url: string, params: Object) {
    return `${url}?${qs.stringify(params)}`
}

/**
 * Axios 包装器：提供快捷方法，类型改写
 * @typeParam WithoutAxiosResponse - 去除 AxiosRespnose 的结构类型，直接返回接口数据类型（此处只为了改变类型，你需要在拦截器中实际处理数据才能真正生效）
 * @typeParam ExtendData - 扩展接口数据类型（此处只为了改变类型，你需要在拦截器中实际处理数据才能真正生效）
 */
export function wrapAxiosRequest<WithoutAxiosResponse extends boolean = false, ExtendData extends any = {}>(
    axios: AxiosInstance,
) {
    type Response<T> = WithoutAxiosResponse extends true ? T & ExtendData : AxiosResponse<T & ExtendData>

    const request = <T = any>(config: AxiosRequestConfig) => axios.request(config) as Promise<Response<T>>

    const get = <T = any>(url: string, params?: any, config?: AxiosRequestConfig) =>
        axios(url, { ...config, method: "GET", params: params }) as Promise<Response<T>>

    const post = <T = any>(url: string, payload?: any, config?: AxiosRequestConfig) =>
        axios(url, { ...config, method: "POST", data: payload }) as Promise<Response<T>>

    const deletes = <T = any>(url: string, payload?: any, config?: AxiosRequestConfig) =>
        axios(url, { ...config, method: "DELETES", data: payload }) as Promise<Response<T>>

    const head = <T = any>(url: string, payload?: any, config?: AxiosRequestConfig) =>
        axios(url, { ...config, method: "HEAD", data: payload }) as Promise<Response<T>>

    const options = <T = any>(url: string, payload?: any, config?: AxiosRequestConfig) =>
        axios(url, { ...config, method: "OPTIONS", data: payload }) as Promise<Response<T>>

    const put = <T = any>(url: string, payload?: any, config?: AxiosRequestConfig) =>
        axios(url, { ...config, method: "PUT", data: payload }) as Promise<Response<T>>

    const patch = <T = any>(url: string, payload?: any, config?: AxiosRequestConfig) =>
        axios(url, { ...config, method: "PATCH", data: payload }) as Promise<Response<T>>

    return {
        axios,
        request,
        get,
        post,
        deletes,
        head,
        options,
        put,
        patch,
    }
}

export function wrapAxiosInterceptors() {}

const req = wrapAxiosRequest<true, { raw: AxiosResponse }>(axios.create())
const a = await req.get<{ name: string }>("")
