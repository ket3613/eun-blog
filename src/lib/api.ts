export async function api<T>(url: string, options?: RequestInit): Promise<T> {
    const method = options?.method?.toUpperCase() ?? "GET";
    const hasBody = method !== "GET" && method !== "HEAD";

    const res = await fetch(url, {
        ...options,
        headers: {
            ...(hasBody ? { "Content-Type": "application/json" } : {}),
            ...options?.headers,
        },
    });

    if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
    }

    return res.json();
}
