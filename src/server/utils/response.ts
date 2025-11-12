export const stdCode = {
    success: 0,
    error: 1,
} as const

export type StdResponse<T = any> = {
    code: number
    message: string
    data: any
}

export function stdResponse(
    data: any = null,
    message: string = "success",
    code: number = stdCode.success,
    headers: HeadersInit = {
        "Content-Type": "application/json",
    },
    status: number = 200,
    statusText: string = "OK",
) {
    return new Response(
        JSON.stringify({
            code,
            message,
            data,
        }),
        {
            headers,
            status,
            statusText,
        },
    )
}

export function stdErrorResponse(
    message: string,
    code: number = stdCode.error,
    status: number = 200,
    statusText: string = "OK",
) {
    return stdResponse(null, message, code, undefined, status, statusText)
}

export function stdStatusResponse(status: number = 200, statusText: string = "OK", headers?: HeadersInit) {
    return new Response(null, {
        status,
        statusText,
        headers,
    })
}

export function stdStatusMethodNotAllowed() {
    return stdStatusResponse(405, "Method Not Allowed")
}
