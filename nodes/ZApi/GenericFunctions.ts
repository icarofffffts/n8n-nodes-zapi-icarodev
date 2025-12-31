import type {
    IDataObject,
    IExecuteFunctions,
    IHookFunctions,
    IHttpRequestMethods,
    IHttpRequestOptions,
    ILoadOptionsFunctions,
    IWebhookFunctions,
} from 'n8n-workflow';

export async function zApiRequest(
    this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions,
    method: IHttpRequestMethods,
    resource: string,
    body: IDataObject = {},
    qs: IDataObject = {},
): Promise<any> {
    const credentials = await this.getCredentials('zApiCredentialsApi');

    const baseUrl = `https://api.z-api.io/instances/${credentials.instanceId}/token/${credentials.instanceToken}`;

    const options: IHttpRequestOptions = {
        method,
        url: `${baseUrl}${resource}`,
        json: true,
        headers: {
            'Client-Token': credentials.clientToken as string,
            'Content-Type': 'application/json',
        },
    };

    if (Object.keys(body).length > 0) {
        options.body = body;
    }

    if (Object.keys(qs).length > 0) {
        options.qs = qs;
    }

    try {
        const response = await this.helpers.httpRequest(options);
        return response;
    } catch (error: any) {
        if (error.response) {
            const errorMessage = error.response.body?.message || error.response.body?.error || error.message;
            throw new Error(`Z-API Error: ${errorMessage}`);
        }
        throw error;
    }
}

export function formatPhoneNumber(phone: string): string {
    // Remove all non-numeric characters
    let cleaned = phone.replace(/\D/g, '');

    // If starts with +, remove it (already handled by regex above)
    // Ensure it doesn't start with 0
    if (cleaned.startsWith('0')) {
        cleaned = cleaned.substring(1);
    }

    return cleaned;
}

export function getMessageId(messageId: string): string {
    // Ensure messageId is properly formatted
    return messageId.trim();
}
