import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';

import { zApiRequest, formatPhoneNumber } from './GenericFunctions';

export class ZApi implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Z-API by @icarodev',
        name: 'zApi',
        icon: 'file:zapi.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Integração com Z-API WhatsApp - by @icarodev',
        defaults: {
            name: 'Z-API',
        },
        documentationUrl: 'https://www.npmjs.com/package/@icarodev/n8n-nodes-z-api',
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'zApiCredentialsApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    { name: 'Message', value: 'message' },
                    { name: 'Instance', value: 'instance' },
                    { name: 'Group', value: 'group' },
                    { name: 'Chat', value: 'chat' },
                    { name: 'Contact', value: 'contact' },
                    { name: 'Profile', value: 'profile' },
                    { name: 'Channel', value: 'channel' },
                    { name: 'Community', value: 'community' },
                    { name: 'Status', value: 'status' },
                    { name: 'Catalog', value: 'catalog' },
                    { name: 'Event', value: 'event' },
                ],
                default: 'message',
            },
            // MESSAGE OPERATIONS
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: { show: { resource: ['message'] } },
                options: [
                    { name: 'Send Text', value: 'sendText' },
                    { name: 'Send Image', value: 'sendImage' },
                    { name: 'Send Video', value: 'sendVideo' },
                    { name: 'Send Audio', value: 'sendAudio' },
                    { name: 'Send Document', value: 'sendDocument' },
                    { name: 'Send Location', value: 'sendLocation' },
                    { name: 'Send Contact', value: 'sendContact' },
                    { name: 'Send Link', value: 'sendLink' },
                    { name: 'Send Sticker', value: 'sendSticker' },
                    { name: 'Send List', value: 'sendList' },
                    { name: 'Send Poll', value: 'sendPoll' },
                    { name: 'Send Reaction', value: 'sendReaction' },
                    { name: 'Delete Message', value: 'deleteMessage' },
                    { name: 'Read Message', value: 'readMessage' },
                    { name: 'Forward Message', value: 'forwardMessage' },
                ],
                default: 'sendText',
            },
            // INSTANCE OPERATIONS
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: { show: { resource: ['instance'] } },
                options: [
                    { name: 'Get QR Code', value: 'getQrCode' },
                    { name: 'Get Status', value: 'getStatus' },
                    { name: 'Restart', value: 'restart' },
                    { name: 'Disconnect', value: 'disconnect' },
                    { name: 'Get Phone Info', value: 'getPhoneInfo' },
                ],
                default: 'getStatus',
            },
            // GROUP OPERATIONS
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: { show: { resource: ['group'] } },
                options: [
                    { name: 'Create', value: 'create' },
                    { name: 'Get Metadata', value: 'getMetadata' },
                    { name: 'Add Participant', value: 'addParticipant' },
                    { name: 'Remove Participant', value: 'removeParticipant' },
                    { name: 'Get Invite Link', value: 'getInviteLink' },
                    { name: 'Leave', value: 'leave' },
                ],
                default: 'getMetadata',
            },
            // CHAT OPERATIONS
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: { show: { resource: ['chat'] } },
                options: [
                    { name: 'Get Chats', value: 'getChats' },
                    { name: 'Archive', value: 'archive' },
                    { name: 'Delete', value: 'delete' },
                ],
                default: 'getChats',
            },
            // CONTACT OPERATIONS
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: { show: { resource: ['contact'] } },
                options: [
                    { name: 'Get Contacts', value: 'getContacts' },
                    { name: 'Get Profile Picture', value: 'getProfilePicture' },
                    { name: 'Check WhatsApp', value: 'checkWhatsApp' },
                ],
                default: 'getContacts',
            },
            // PROFILE OPERATIONS
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: { show: { resource: ['profile'] } },
                options: [
                    { name: 'Get Profile', value: 'getProfile' },
                    { name: 'Update Name', value: 'updateName' },
                    { name: 'Update Status', value: 'updateStatus' },
                    { name: 'Update Photo', value: 'updatePhoto' },
                ],
                default: 'getProfile',
            },
            // CHANNEL OPERATIONS (NEW)
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: { show: { resource: ['channel'] } },
                options: [
                    { name: 'Create', value: 'create' },
                    { name: 'List', value: 'list' },
                    { name: 'Search', value: 'search' },
                    { name: 'Follow', value: 'follow' },
                    { name: 'Unfollow', value: 'unfollow' },
                    { name: 'Get Metadata', value: 'getMetadata' },
                ],
                default: 'list',
            },
            // COMMUNITY OPERATIONS (NEW)
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: { show: { resource: ['community'] } },
                options: [
                    { name: 'Create', value: 'create' },
                    { name: 'List', value: 'list' },
                    { name: 'Get Metadata', value: 'getMetadata' },
                    { name: 'Link Group', value: 'linkGroup' },
                    { name: 'Unlink Group', value: 'unlinkGroup' },
                ],
                default: 'list',
            },
            // STATUS OPERATIONS (NEW)
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: { show: { resource: ['status'] } },
                options: [
                    { name: 'Send Text', value: 'sendText' },
                    { name: 'Send Image', value: 'sendImage' },
                    { name: 'Send Video', value: 'sendVideo' },
                ],
                default: 'sendText',
            },
            // CATALOG OPERATIONS (NEW)
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: { show: { resource: ['catalog'] } },
                options: [
                    { name: 'Send Product', value: 'sendProduct' },
                    { name: 'Send Catalog', value: 'sendCatalog' },
                    { name: 'Send Order Status', value: 'sendOrderStatus' },
                ],
                default: 'sendProduct',
            },
            // EVENT OPERATIONS (NEW)
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: { show: { resource: ['event'] } },
                options: [
                    { name: 'Send Event', value: 'sendEvent' },
                    { name: 'Edit Event', value: 'editEvent' },
                    { name: 'Respond Event', value: 'respondEvent' },
                ],
                default: 'sendEvent',
            },
            // COMMON FIELDS
            {
                displayName: 'Phone Number',
                name: 'phone',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['message'],
                        operation: ['sendText', 'sendImage', 'sendVideo', 'sendAudio', 'sendDocument', 'sendLocation', 'sendContact', 'sendLink', 'sendSticker', 'sendList', 'sendPoll', 'sendReaction'],
                    },
                },
                description: 'Phone number with country code (e.g., 5511999999999)',
            },
            {
                displayName: 'Message',
                name: 'message',
                type: 'string',
                typeOptions: { rows: 4 },
                default: '',
                required: true,
                displayOptions: { show: { resource: ['message'], operation: ['sendText'] } },
                description: 'Text message to send',
            },
            {
                displayName: 'Image URL',
                name: 'imageUrl',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['message'], operation: ['sendImage'] } },
                description: 'URL of the image to send',
            },
            {
                displayName: 'Caption',
                name: 'caption',
                type: 'string',
                default: '',
                displayOptions: { show: { resource: ['message'], operation: ['sendImage', 'sendVideo', 'sendDocument'] } },
                description: 'Caption for the media',
            },
            {
                displayName: 'Video URL',
                name: 'videoUrl',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['message'], operation: ['sendVideo'] } },
                description: 'URL of the video to send',
            },
            {
                displayName: 'Audio URL',
                name: 'audioUrl',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['message'], operation: ['sendAudio'] } },
                description: 'URL of the audio to send',
            },
            {
                displayName: 'Document URL',
                name: 'documentUrl',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['message'], operation: ['sendDocument'] } },
                description: 'URL of the document to send',
            },
            {
                displayName: 'Document Name',
                name: 'documentName',
                type: 'string',
                default: '',
                displayOptions: { show: { resource: ['message'], operation: ['sendDocument'] } },
                description: 'Name of the document file',
            },
            {
                displayName: 'Latitude',
                name: 'latitude',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['message'], operation: ['sendLocation'] } },
            },
            {
                displayName: 'Longitude',
                name: 'longitude',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['message'], operation: ['sendLocation'] } },
            },
            {
                displayName: 'Location Name',
                name: 'locationName',
                type: 'string',
                default: '',
                displayOptions: { show: { resource: ['message'], operation: ['sendLocation'] } },
            },
            {
                displayName: 'Contact Name',
                name: 'contactName',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['message'], operation: ['sendContact'] } },
            },
            {
                displayName: 'Contact Phone',
                name: 'contactPhone',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['message'], operation: ['sendContact'] } },
            },
            {
                displayName: 'Link URL',
                name: 'linkUrl',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['message'], operation: ['sendLink'] } },
            },
            {
                displayName: 'Link Title',
                name: 'linkTitle',
                type: 'string',
                default: '',
                displayOptions: { show: { resource: ['message'], operation: ['sendLink'] } },
            },
            {
                displayName: 'Link Description',
                name: 'linkDescription',
                type: 'string',
                default: '',
                displayOptions: { show: { resource: ['message'], operation: ['sendLink'] } },
            },
            {
                displayName: 'Sticker URL',
                name: 'stickerUrl',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['message'], operation: ['sendSticker'] } },
            },
            {
                displayName: 'Message ID',
                name: 'messageId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['message'], operation: ['sendReaction', 'deleteMessage', 'readMessage', 'forwardMessage'] } },
                description: 'ID of the message',
            },
            {
                displayName: 'Reaction',
                name: 'reaction',
                type: 'string',
                default: '👍',
                required: true,
                displayOptions: { show: { resource: ['message'], operation: ['sendReaction'] } },
                description: 'Emoji reaction to send',
            },
            {
                displayName: 'Forward To Phone',
                name: 'forwardToPhone',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['message'], operation: ['forwardMessage'] } },
                description: 'Phone number to forward the message to',
            },
            // LIST OPTIONS
            {
                displayName: 'List Title',
                name: 'listTitle',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['message'], operation: ['sendList'] } },
            },
            {
                displayName: 'List Description',
                name: 'listDescription',
                type: 'string',
                default: '',
                displayOptions: { show: { resource: ['message'], operation: ['sendList'] } },
            },
            {
                displayName: 'List Button Text',
                name: 'listButtonText',
                type: 'string',
                default: 'Ver opções',
                displayOptions: { show: { resource: ['message'], operation: ['sendList'] } },
            },
            {
                displayName: 'List Sections (JSON)',
                name: 'listSections',
                type: 'json',
                default: '[]',
                required: true,
                displayOptions: { show: { resource: ['message'], operation: ['sendList'] } },
                description: 'Sections array in JSON format',
            },
            // POLL OPTIONS
            {
                displayName: 'Poll Question',
                name: 'pollQuestion',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['message'], operation: ['sendPoll'] } },
            },
            {
                displayName: 'Poll Options (comma-separated)',
                name: 'pollOptions',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['message'], operation: ['sendPoll'] } },
                description: 'Options separated by commas',
            },
            // GROUP FIELDS
            {
                displayName: 'Group ID',
                name: 'groupId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['group'], operation: ['getMetadata', 'addParticipant', 'removeParticipant', 'getInviteLink', 'leave'] } },
            },
            {
                displayName: 'Group Name',
                name: 'groupName',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['group'], operation: ['create'] } },
            },
            {
                displayName: 'Participants (comma-separated phones)',
                name: 'participants',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['group'], operation: ['create', 'addParticipant', 'removeParticipant'] } },
            },
            // CONTACT FIELDS
            {
                displayName: 'Phone Number',
                name: 'phone',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['contact'], operation: ['getProfilePicture', 'checkWhatsApp'] } },
            },
            // PROFILE FIELDS
            {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['profile'], operation: ['updateName'] } },
            },
            {
                displayName: 'Status Text',
                name: 'statusText',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['profile'], operation: ['updateStatus'] } },
            },
            {
                displayName: 'Photo URL',
                name: 'photoUrl',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['profile'], operation: ['updatePhoto'] } },
            },
            // CHANNEL FIELDS
            {
                displayName: 'Channel Name',
                name: 'channelName',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['channel'], operation: ['create'] } },
            },
            {
                displayName: 'Channel Description',
                name: 'channelDescription',
                type: 'string',
                default: '',
                displayOptions: { show: { resource: ['channel'], operation: ['create'] } },
            },
            {
                displayName: 'Channel ID',
                name: 'channelId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['channel'], operation: ['follow', 'unfollow', 'getMetadata'] } },
            },
            {
                displayName: 'Search Query',
                name: 'searchQuery',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['channel'], operation: ['search'] } },
            },
            // COMMUNITY FIELDS
            {
                displayName: 'Community Name',
                name: 'communityName',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['community'], operation: ['create'] } },
            },
            {
                displayName: 'Community ID',
                name: 'communityId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['community'], operation: ['getMetadata', 'linkGroup', 'unlinkGroup'] } },
            },
            {
                displayName: 'Group ID to Link',
                name: 'groupIdToLink',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['community'], operation: ['linkGroup', 'unlinkGroup'] } },
            },
            // STATUS FIELDS
            {
                displayName: 'Status Text',
                name: 'statusMessage',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['status'], operation: ['sendText'] } },
            },
            {
                displayName: 'Image URL',
                name: 'statusImageUrl',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['status'], operation: ['sendImage'] } },
            },
            {
                displayName: 'Video URL',
                name: 'statusVideoUrl',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['status'], operation: ['sendVideo'] } },
            },
            // CATALOG FIELDS
            {
                displayName: 'Phone Number',
                name: 'phone',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['catalog'] } },
            },
            {
                displayName: 'Product ID',
                name: 'productId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['catalog'], operation: ['sendProduct'] } },
            },
            {
                displayName: 'Order Status',
                name: 'orderStatus',
                type: 'options',
                options: [
                    { name: 'Pending', value: 'pending' },
                    { name: 'Processing', value: 'processing' },
                    { name: 'Shipped', value: 'shipped' },
                    { name: 'Completed', value: 'completed' },
                    { name: 'Canceled', value: 'canceled' },
                ],
                default: 'pending',
                displayOptions: { show: { resource: ['catalog'], operation: ['sendOrderStatus'] } },
            },
            // EVENT FIELDS
            {
                displayName: 'Event Name',
                name: 'eventName',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['event'], operation: ['sendEvent', 'editEvent'] } },
            },
            {
                displayName: 'Event Description',
                name: 'eventDescription',
                type: 'string',
                default: '',
                displayOptions: { show: { resource: ['event'], operation: ['sendEvent', 'editEvent'] } },
            },
            {
                displayName: 'Event Date',
                name: 'eventDate',
                type: 'dateTime',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['event'], operation: ['sendEvent', 'editEvent'] } },
            },
            {
                displayName: 'Group ID',
                name: 'eventGroupId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['event'], operation: ['sendEvent', 'editEvent', 'respondEvent'] } },
            },
            {
                displayName: 'Event ID',
                name: 'eventId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['event'], operation: ['editEvent', 'respondEvent'] } },
            },
            {
                displayName: 'Response',
                name: 'eventResponse',
                type: 'options',
                options: [
                    { name: 'Going', value: 'going' },
                    { name: 'Not Going', value: 'not_going' },
                    { name: 'Maybe', value: 'maybe' },
                ],
                default: 'going',
                displayOptions: { show: { resource: ['event'], operation: ['respondEvent'] } },
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];
        const resource = this.getNodeParameter('resource', 0) as string;
        const operation = this.getNodeParameter('operation', 0) as string;

        for (let i = 0; i < items.length; i++) {
            try {
                let responseData;

                if (resource === 'message') {
                    responseData = await executeMessageOperation.call(this, operation, i);
                } else if (resource === 'instance') {
                    responseData = await executeInstanceOperation.call(this, operation);
                } else if (resource === 'group') {
                    responseData = await executeGroupOperation.call(this, operation, i);
                } else if (resource === 'chat') {
                    responseData = await executeChatOperation.call(this, operation);
                } else if (resource === 'contact') {
                    responseData = await executeContactOperation.call(this, operation, i);
                } else if (resource === 'profile') {
                    responseData = await executeProfileOperation.call(this, operation, i);
                } else if (resource === 'channel') {
                    responseData = await executeChannelOperation.call(this, operation, i);
                } else if (resource === 'community') {
                    responseData = await executeCommunityOperation.call(this, operation, i);
                } else if (resource === 'status') {
                    responseData = await executeStatusOperation.call(this, operation, i);
                } else if (resource === 'catalog') {
                    responseData = await executeCatalogOperation.call(this, operation, i);
                } else if (resource === 'event') {
                    responseData = await executeEventOperation.call(this, operation, i);
                }

                returnData.push({ json: responseData });
            } catch (error: any) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: error.message } });
                    continue;
                }
                throw error;
            }
        }

        return [returnData];
    }
}

async function executeMessageOperation(this: IExecuteFunctions, operation: string, i: number) {
    const phone = formatPhoneNumber(this.getNodeParameter('phone', i) as string);
    let body: any = { phone };

    switch (operation) {
        case 'sendText':
            body.message = this.getNodeParameter('message', i) as string;
            return zApiRequest.call(this, 'POST', '/send-text', body);

        case 'sendImage':
            body.image = this.getNodeParameter('imageUrl', i) as string;
            body.caption = this.getNodeParameter('caption', i, '') as string;
            return zApiRequest.call(this, 'POST', '/send-image', body);

        case 'sendVideo':
            body.video = this.getNodeParameter('videoUrl', i) as string;
            body.caption = this.getNodeParameter('caption', i, '') as string;
            return zApiRequest.call(this, 'POST', '/send-video', body);

        case 'sendAudio':
            body.audio = this.getNodeParameter('audioUrl', i) as string;
            return zApiRequest.call(this, 'POST', '/send-audio', body);

        case 'sendDocument':
            body.document = this.getNodeParameter('documentUrl', i) as string;
            body.fileName = this.getNodeParameter('documentName', i, '') as string;
            body.caption = this.getNodeParameter('caption', i, '') as string;
            return zApiRequest.call(this, 'POST', '/send-document-url', body);

        case 'sendLocation':
            body.latitude = this.getNodeParameter('latitude', i) as string;
            body.longitude = this.getNodeParameter('longitude', i) as string;
            body.name = this.getNodeParameter('locationName', i, '') as string;
            return zApiRequest.call(this, 'POST', '/send-location', body);

        case 'sendContact':
            body.contactName = this.getNodeParameter('contactName', i) as string;
            body.contactPhone = this.getNodeParameter('contactPhone', i) as string;
            return zApiRequest.call(this, 'POST', '/send-contact', body);

        case 'sendLink':
            body.message = this.getNodeParameter('linkUrl', i) as string;
            body.linkUrl = this.getNodeParameter('linkUrl', i) as string;
            body.title = this.getNodeParameter('linkTitle', i, '') as string;
            body.linkDescription = this.getNodeParameter('linkDescription', i, '') as string;
            return zApiRequest.call(this, 'POST', '/send-link', body);

        case 'sendSticker':
            body.sticker = this.getNodeParameter('stickerUrl', i) as string;
            return zApiRequest.call(this, 'POST', '/send-sticker', body);

        case 'sendList':
            body.title = this.getNodeParameter('listTitle', i) as string;
            body.description = this.getNodeParameter('listDescription', i, '') as string;
            body.buttonText = this.getNodeParameter('listButtonText', i) as string;
            body.sections = JSON.parse(this.getNodeParameter('listSections', i) as string);
            return zApiRequest.call(this, 'POST', '/send-option-list', body);

        case 'sendPoll':
            body.message = this.getNodeParameter('pollQuestion', i) as string;
            const optionsStr = this.getNodeParameter('pollOptions', i) as string;
            body.options = optionsStr.split(',').map((o) => o.trim());
            return zApiRequest.call(this, 'POST', '/send-poll', body);

        case 'sendReaction':
            const messageId = this.getNodeParameter('messageId', i) as string;
            body.messageId = messageId;
            body.reaction = this.getNodeParameter('reaction', i) as string;
            return zApiRequest.call(this, 'POST', '/send-reaction', body);

        case 'deleteMessage':
            return zApiRequest.call(this, 'DELETE', '/delete-message', {
                phone,
                messageId: this.getNodeParameter('messageId', i) as string,
            });

        case 'readMessage':
            return zApiRequest.call(this, 'POST', '/read-message', {
                phone,
                messageId: this.getNodeParameter('messageId', i) as string,
            });

        case 'forwardMessage':
            return zApiRequest.call(this, 'POST', '/forward-message', {
                phone: formatPhoneNumber(this.getNodeParameter('forwardToPhone', i) as string),
                messageId: this.getNodeParameter('messageId', i) as string,
            });
    }
}

async function executeInstanceOperation(this: IExecuteFunctions, operation: string) {
    switch (operation) {
        case 'getQrCode':
            return zApiRequest.call(this, 'GET', '/qr-code');
        case 'getStatus':
            return zApiRequest.call(this, 'GET', '/status');
        case 'restart':
            return zApiRequest.call(this, 'GET', '/restart');
        case 'disconnect':
            return zApiRequest.call(this, 'GET', '/disconnect');
        case 'getPhoneInfo':
            return zApiRequest.call(this, 'GET', '/phone');
    }
}

async function executeGroupOperation(this: IExecuteFunctions, operation: string, i: number) {
    switch (operation) {
        case 'create':
            const groupName = this.getNodeParameter('groupName', i) as string;
            const participantsStr = this.getNodeParameter('participants', i) as string;
            const phones = participantsStr.split(',').map((p) => formatPhoneNumber(p.trim()));
            return zApiRequest.call(this, 'POST', '/create-group', { groupName, phones });

        case 'getMetadata':
            const groupId = this.getNodeParameter('groupId', i) as string;
            return zApiRequest.call(this, 'GET', `/ group - metadata / ${groupId} `);

        case 'addParticipant':
            return zApiRequest.call(this, 'POST', '/add-participant', {
                groupId: this.getNodeParameter('groupId', i) as string,
                phones: (this.getNodeParameter('participants', i) as string).split(',').map((p) => formatPhoneNumber(p.trim())),
            });

        case 'removeParticipant':
            return zApiRequest.call(this, 'DELETE', '/remove-participant', {
                groupId: this.getNodeParameter('groupId', i) as string,
                phones: (this.getNodeParameter('participants', i) as string).split(',').map((p) => formatPhoneNumber(p.trim())),
            });

        case 'getInviteLink':
            return zApiRequest.call(this, 'GET', `/ group - invite - link / ${this.getNodeParameter('groupId', i)} `);

        case 'leave':
            return zApiRequest.call(this, 'POST', '/leave-group', {
                groupId: this.getNodeParameter('groupId', i) as string,
            });
    }
}

async function executeChatOperation(this: IExecuteFunctions, operation: string) {
    switch (operation) {
        case 'getChats':
            return zApiRequest.call(this, 'GET', '/chats');
        case 'archive':
            return zApiRequest.call(this, 'POST', '/archive-chat');
        case 'delete':
            return zApiRequest.call(this, 'DELETE', '/delete-chat');
    }
}

async function executeContactOperation(this: IExecuteFunctions, operation: string, i: number) {
    switch (operation) {
        case 'getContacts':
            return zApiRequest.call(this, 'GET', '/contacts');
        case 'getProfilePicture':
            const phone = formatPhoneNumber(this.getNodeParameter('phone', i) as string);
            return zApiRequest.call(this, 'GET', `/ profile - picture / ${phone} `);
        case 'checkWhatsApp':
            const phoneCheck = formatPhoneNumber(this.getNodeParameter('phone', i) as string);
            return zApiRequest.call(this, 'GET', `/ phone - exists / ${phoneCheck} `);
    }
}

async function executeProfileOperation(this: IExecuteFunctions, operation: string, i: number) {
    switch (operation) {
        case 'getProfile':
            return zApiRequest.call(this, 'GET', '/profile');
        case 'updateName':
            return zApiRequest.call(this, 'PUT', '/update-profile-name', {
                name: this.getNodeParameter('name', i) as string,
            });
        case 'updateStatus':
            return zApiRequest.call(this, 'PUT', '/profile-status', {
                status: this.getNodeParameter('statusText', i) as string,
            });
        case 'updatePhoto':
            return zApiRequest.call(this, 'PUT', '/profile-picture', {
                image: this.getNodeParameter('photoUrl', i) as string,
            });
    }
}

async function executeChannelOperation(this: IExecuteFunctions, operation: string, i: number) {
    switch (operation) {
        case 'create':
            return zApiRequest.call(this, 'POST', '/create-newsletter', {
                name: this.getNodeParameter('channelName', i) as string,
                description: this.getNodeParameter('channelDescription', i, '') as string,
            });
        case 'list':
            return zApiRequest.call(this, 'GET', '/newsletters');
        case 'search':
            return zApiRequest.call(this, 'POST', '/search-newsletter', {
                text: this.getNodeParameter('searchQuery', i) as string,
            });
        case 'follow':
            return zApiRequest.call(this, 'POST', '/follow-newsletter', {
                id: this.getNodeParameter('channelId', i) as string,
            });
        case 'unfollow':
            return zApiRequest.call(this, 'DELETE', '/unfollow-newsletter', {
                id: this.getNodeParameter('channelId', i) as string,
            });
        case 'getMetadata':
            return zApiRequest.call(this, 'GET', `/ newsletter - metadata / ${this.getNodeParameter('channelId', i)} `);
    }
}

async function executeCommunityOperation(this: IExecuteFunctions, operation: string, i: number) {
    switch (operation) {
        case 'create':
            return zApiRequest.call(this, 'POST', '/create-community', {
                name: this.getNodeParameter('communityName', i) as string,
            });
        case 'list':
            return zApiRequest.call(this, 'GET', '/communities');
        case 'getMetadata':
            return zApiRequest.call(this, 'GET', `/ community - metadata / ${this.getNodeParameter('communityId', i)} `);
        case 'linkGroup':
            return zApiRequest.call(this, 'POST', '/link-group', {
                communityId: this.getNodeParameter('communityId', i) as string,
                groupId: this.getNodeParameter('groupIdToLink', i) as string,
            });
        case 'unlinkGroup':
            return zApiRequest.call(this, 'DELETE', '/unlink-group', {
                communityId: this.getNodeParameter('communityId', i) as string,
                groupId: this.getNodeParameter('groupIdToLink', i) as string,
            });
    }
}

async function executeStatusOperation(this: IExecuteFunctions, operation: string, i: number) {
    switch (operation) {
        case 'sendText':
            return zApiRequest.call(this, 'POST', '/send-text-status', {
                message: this.getNodeParameter('statusMessage', i) as string,
            });
        case 'sendImage':
            return zApiRequest.call(this, 'POST', '/send-image-status', {
                image: this.getNodeParameter('statusImageUrl', i) as string,
            });
        case 'sendVideo':
            return zApiRequest.call(this, 'POST', '/send-video-status', {
                video: this.getNodeParameter('statusVideoUrl', i) as string,
            });
    }
}

async function executeCatalogOperation(this: IExecuteFunctions, operation: string, i: number) {
    const phone = formatPhoneNumber(this.getNodeParameter('phone', i) as string);
    switch (operation) {
        case 'sendProduct':
            return zApiRequest.call(this, 'POST', '/send-product', {
                phone,
                productId: this.getNodeParameter('productId', i) as string,
            });
        case 'sendCatalog':
            return zApiRequest.call(this, 'POST', '/send-catalog', { phone });
        case 'sendOrderStatus':
            return zApiRequest.call(this, 'POST', '/send-order-status', {
                phone,
                status: this.getNodeParameter('orderStatus', i) as string,
            });
    }
}

async function executeEventOperation(this: IExecuteFunctions, operation: string, i: number) {
    switch (operation) {
        case 'sendEvent':
            return zApiRequest.call(this, 'POST', '/send-event', {
                groupId: this.getNodeParameter('eventGroupId', i) as string,
                name: this.getNodeParameter('eventName', i) as string,
                description: this.getNodeParameter('eventDescription', i, '') as string,
                dateTime: this.getNodeParameter('eventDate', i) as string,
            });
        case 'editEvent':
            return zApiRequest.call(this, 'PUT', '/edit-event', {
                groupId: this.getNodeParameter('eventGroupId', i) as string,
                eventId: this.getNodeParameter('eventId', i) as string,
                name: this.getNodeParameter('eventName', i) as string,
                description: this.getNodeParameter('eventDescription', i, '') as string,
                dateTime: this.getNodeParameter('eventDate', i) as string,
            });
        case 'respondEvent':
            return zApiRequest.call(this, 'POST', '/respond-event', {
                groupId: this.getNodeParameter('eventGroupId', i) as string,
                eventId: this.getNodeParameter('eventId', i) as string,
                response: this.getNodeParameter('eventResponse', i) as string,
            });
    }
}
