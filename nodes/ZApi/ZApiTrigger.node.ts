import {
    IHookFunctions,
    IWebhookFunctions,
    INodeType,
    INodeTypeDescription,
    IWebhookResponseData,
} from 'n8n-workflow';

export class ZApiTrigger implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Z-API Trigger',
        name: 'zApiTrigger',
        icon: 'file:zapi.svg',
        group: ['trigger'],
        version: 1,
        subtitle: '={{$parameter["event"]}}',
        description: 'Triggers workflow on Z-API webhook events',
        defaults: {
            name: 'Z-API Trigger',
        },
        inputs: [],
        outputs: ['main'],
        credentials: [
            {
                name: 'zApiCredentialsApi',
                required: true,
            },
        ],
        webhooks: [
            {
                name: 'default',
                httpMethod: 'POST',
                responseMode: 'onReceived',
                path: 'webhook',
            },
        ],
        properties: [
            {
                displayName: 'Event',
                name: 'event',
                type: 'options',
                options: [
                    {
                        name: 'All Events',
                        value: 'all',
                        description: 'Trigger on all webhook events',
                    },
                    {
                        name: 'Message Received',
                        value: 'ReceivedCallback',
                        description: 'Trigger when a message is received',
                    },
                    {
                        name: 'Message Sent',
                        value: 'MessageStatusCallback',
                        description: 'Trigger on message status updates',
                    },
                    {
                        name: 'Connection Status',
                        value: 'StatusInstanceCallback',
                        description: 'Trigger when connection status changes',
                    },
                    {
                        name: 'Chat Presence',
                        value: 'PresenceChatCallback',
                        description: 'Trigger when chat presence changes (online, typing, etc.)',
                    },
                    {
                        name: 'Disconnected',
                        value: 'DisconnectedCallback',
                        description: 'Trigger when instance is disconnected',
                    },
                    {
                        name: 'Connected',
                        value: 'ConnectedCallback',
                        description: 'Trigger when instance is connected',
                    },
                ],
                default: 'all',
                description: 'The event to listen for',
            },
            {
                displayName: 'Options',
                name: 'options',
                type: 'collection',
                placeholder: 'Add Option',
                default: {},
                options: [
                    {
                        displayName: 'Filter by Phone',
                        name: 'filterPhone',
                        type: 'string',
                        default: '',
                        description: 'Only trigger for messages from this phone number (leave empty for all)',
                    },
                    {
                        displayName: 'Filter by Group',
                        name: 'filterGroup',
                        type: 'boolean',
                        default: false,
                        description: 'Only trigger for group messages',
                    },
                    {
                        displayName: 'Ignore Status Messages',
                        name: 'ignoreStatus',
                        type: 'boolean',
                        default: true,
                        description: 'Ignore status/stories messages',
                    },
                    {
                        displayName: 'Only Text Messages',
                        name: 'onlyText',
                        type: 'boolean',
                        default: false,
                        description: 'Only trigger for text messages',
                    },
                ],
            },
        ],
    };

    webhookMethods = {
        default: {
            async checkExists(this: IHookFunctions): Promise<boolean> {
                // Webhook always exists for Z-API - managed externally
                return true;
            },
            async create(this: IHookFunctions): Promise<boolean> {
                // Z-API webhooks are configured in the Z-API dashboard
                // Return true as we don't need to create them programmatically
                return true;
            },
            async delete(this: IHookFunctions): Promise<boolean> {
                // Z-API webhooks are managed in the Z-API dashboard
                return true;
            },
        },
    };

    async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
        const req = this.getRequestObject();
        const body = req.body;
        const event = this.getNodeParameter('event') as string;
        const options = this.getNodeParameter('options', {}) as {
            filterPhone?: string;
            filterGroup?: boolean;
            ignoreStatus?: boolean;
            onlyText?: boolean;
        };

        // Determine the event type from the webhook payload
        const webhookEvent = body.event || body.type || 'unknown';

        // Filter by event type if not 'all'
        if (event !== 'all' && webhookEvent !== event) {
            return { workflowData: [] };
        }

        // Apply filters
        if (options.filterPhone) {
            const phone = body.phone || body.from || body.chatId || '';
            if (!phone.includes(options.filterPhone.replace(/\D/g, ''))) {
                return { workflowData: [] };
            }
        }

        if (options.filterGroup) {
            const isGroup = body.isGroup || (body.chatId && body.chatId.includes('@g.us'));
            if (!isGroup) {
                return { workflowData: [] };
            }
        }

        if (options.ignoreStatus) {
            const isStatus = body.isStatusReply || (body.chatId && body.chatId.includes('status@'));
            if (isStatus) {
                return { workflowData: [] };
            }
        }

        if (options.onlyText) {
            const messageType = body.type || body.messageType || '';
            if (messageType !== 'text' && messageType !== 'chat' && !body.text) {
                return { workflowData: [] };
            }
        }

        // Extract common fields for easier use
        const outputData = {
            ...body,
            _metadata: {
                receivedAt: new Date().toISOString(),
                eventType: webhookEvent,
                isGroup: body.isGroup || (body.chatId && body.chatId.includes('@g.us')) || false,
                phone: body.phone || body.from || body.chatId?.split('@')[0] || '',
                messageId: body.messageId || body.id?.id || body.ids?.[0] || '',
            },
        };

        return {
            workflowData: [[{ json: outputData }]],
        };
    }
}
