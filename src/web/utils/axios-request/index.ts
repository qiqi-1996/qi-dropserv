import { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios"
import qs from "qs"
import type { CompositeAxiosInterceptor } from "./interceptors"

/**
 * 向 URL 中组装参数
 */
export function urlParams(url: string, params: Object) {
    return `${url}?${qs.stringify(params)}`
}

/**
 * Axios 包装器：提供快捷方法，类型改写
 * @typeParam WithoutAxiosResponse - 去除 AxiosRespnose 的结构类型，直接返回接口数据类型（此处只为了改变类型，你需要在拦截器中实际处理数据才能真正生效）
 * @typeParam DataKey - 数据（T）所在 key，支持 keypath（例如：a.b.c）
 * @typeParam ExtendData - 扩展接口数据类型（此处只为了改变类型，你需要在拦截器中实际处理数据才能真正生效）
 */
export function wrapAxiosRequest<
    WithoutAxiosResponse extends boolean = false,
    DataKey extends string = "data",
    ExtendData extends any = {},
>(axios: AxiosInstance) {
    type Response<T> = WithoutAxiosResponse extends true
        ? (DataKey extends "" ? T : SetDeepType<{}, DataKey, T>) & ExtendData
        : AxiosResponse<(DataKey extends "" ? T : SetDeepType<{}, DataKey, T>) & ExtendData>

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

export function wrapAxiosInterceptors(axios: AxiosInstance, interceptors: CompositeAxiosInterceptor[]) {
    interceptors.forEach((interceptor) => {
        if (interceptor[0] === "request") {
            axios.interceptors.request.use(interceptor[1], interceptor[2], interceptor[3])
        } else {
            axios.interceptors.response.use(interceptor[1], interceptor[2])
        }
    })
    return axios
}

type SetDeepType<
    Base = {},
    KeyPath extends string = "",
    T = unknown,
> = KeyPath extends `${infer FirstKey}.${infer RestKeyPath}`
    ? // 有剩余键路径：递归处理下一层
      {
          [K in keyof Base | FirstKey]: K extends FirstKey
              ? // 当前键是路径中的键：递归处理剩余路径
                SetDeepType<
                    K extends keyof Base ? Base[K] : {}, // 若基础类型已有该键，继承其类型；否则从空对象开始
                    RestKeyPath,
                    T
                >
              : // 保留基础类型中原有的其他键
                K extends keyof Base
                ? Base[K]
                : never
      }
    : // 无剩余键路径：设置最终节点类型
      {
          [K in keyof Base | KeyPath]: K extends KeyPath
              ? T // 目标键设置为 T 类型
              : K extends keyof Base
                ? Base[K]
                : never // 保留基础类型中原有的其他键
      }
