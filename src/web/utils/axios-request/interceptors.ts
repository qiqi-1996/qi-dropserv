import type { AxiosResponse, InternalAxiosRequestConfig } from "axios"
import { isNil, isObject } from "lodash"
import type { AxiosRequestInterceptorUse } from "node_modules/axios/index.d.cts"

type ReqInt = Parameters<AxiosRequestInterceptorUse<InternalAxiosRequestConfig>>
type ResInt = Parameters<AxiosRequestInterceptorUse<AxiosResponse>>
export type CompositeAxiosInterceptor<T extends "request" | "response" = "request" | "response"> = T extends "request"
    ? [type: "request", onConfig: ReqInt[0] | undefined, onError: ReqInt[1] | undefined, options: ReqInt[2] | undefined]
    : [type: "response", onResponse: ResInt[0] | undefined, onError: ResInt[1] | undefined]

/**
 * 创建 Axios 拦截器帮助函数
 */
export function createAxiosInterceptors(
    interceptor:
        | {
              /** 创建拦截器类型：请求 */
              type: "request"
              /** 拦截请求配置 */
              onConfig?: ReqInt[0]
              /** 拦截错误响应 */
              onError?: ReqInt[1]
              /** 其他配置 */
              options?: ReqInt[2]
          }
        | {
              /** 创建拦截器类型：响应 */
              type: "response"
              /** 拦截响应结果 */
              onResponse?: ResInt[0]
              /** 拦截错误响应 */
              onError?: ResInt[1]
          },
) {
    if (interceptor.type === "request") {
        return [
            "request",
            interceptor.onConfig,
            interceptor.onError,
            interceptor.options,
        ] as CompositeAxiosInterceptor<"request">
    } else {
        return ["response", interceptor.onResponse, interceptor.onError] as CompositeAxiosInterceptor<"response">
    }
}

/**
 * 移出 AxiosResponse 结构的响应拦截器
 * @description 让 axios 请求直接返回 response.data
 */
export const withoutAxiosResponse = (options?: {
    /**
     * 将 AxiosResponse 原始数据存储到额外的键名
     * @description 如果 response.data 是对象格式，则在对象内追加键名来存储 response 的原始数据 */
    rawKey?: string
}) =>
    createAxiosInterceptors({
        type: "response",
        onResponse(response) {
            return isObject(response.data)
                ? {
                      ...response.data,
                      ...(isNil(options?.rawKey) ? {} : { [options.rawKey]: response }),
                  }
                : response.data
        },
    })
