import {
    IAuthenticateGeneric,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class ZApiCredentialsApi implements ICredentialType {
    name = 'zApiCredentialsApi';
    displayName = 'Z-API Credentials';
    documentationUrl = 'https://developer.z-api.io/';
    properties: INodeProperties[] = [
        {
            displayName: 'Instance ID',
            name: 'instanceId',
            type: 'string',
            default: '',
            required: true,
            description: 'The Instance ID from your Z-API dashboard',
        },
        {
            displayName: 'Instance Token',
            name: 'instanceToken',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            required: true,
            description: 'The Token from your Z-API instance',
        },
        {
            displayName: 'Client Token',
            name: 'clientToken',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            required: true,
            description: 'The Client Token from your Z-API account security settings',
        },
    ];

    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                'Client-Token': '={{$credentials.clientToken}}',
            },
        },
    };

    test: ICredentialTestRequest = {
        request: {
            baseURL: '=https://api.z-api.io/instances/{{$credentials.instanceId}}/token/{{$credentials.instanceToken}}',
            url: '/status',
            method: 'GET',
        },
    };
}
