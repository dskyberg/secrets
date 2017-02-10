const { stringify } = require('querystring');
const google = require('googleapis');
const fetch = require('node-fetch');
// eslint-disable-next-line import/no-extraneous-dependencies
const { BrowserWindow } = require('electron');

/* eslint-disable camelcase */

export class ElectronGoogleOAuth {
    constructor(browserWindowParams, httpAgent) {
        this.browserWindowParams = browserWindowParams;
        this.httpAgent = httpAgent;
    }

    getAuthorizationCode(scopes, clientId, clientSecret, redirectUri = 'urn:ietf:wg:oauth:2.0:oob') {
        const url = ElectronGoogleOAuth.getAuthenticationUrl(scopes, clientId, clientSecret, redirectUri);
        return ElectronGoogleOAuth.authorizeApp(url, this.browserWindowParams);
    }

    async getAccessToken(scopes, clientId, clientSecret, redirectUri = 'urn:ietf:wg:oauth:2.0:oob') {
        const authorizationCode = await this.getAuthorizationCode(scopes, clientId, clientSecret, redirectUri);

        const data = stringify({
            code: authorizationCode,
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri
        });

        const response = await fetch('https://accounts.google.com/o/oauth2/token', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data,
            agent: this.httpAgent
        })
        return response.json();
    }

    static getAuthenticationUrl(scopes, clientId, clientSecret, redirectUri = 'urn:ietf:wg:oauth:2.0:oob') {
        const oauth2Client = new google.auth.OAuth2(
            clientId,
            clientSecret,
            redirectUri
        );
        const url = oauth2Client.generateAuthUrl({
            access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
            scope: scopes // If you only need one scope you can pass it as string
        });
        return url;
    }

    static authorizeApp(url, browserWindowParams) {
        return new Promise((resolve, reject) => {
            const win = new BrowserWindow(browserWindowParams || {
                'alwaysOnTop': true,
                'resizable': false,
                'title': 'Secrets Login',
                'use-content-size': true
            });

            win.loadURL(url);

            win.on('closed', () => {
                reject(new Error('User closed the window'));
            });

            win.on('page-title-updated', () => {
                setImmediate(() => {
                    const title = win.getTitle();
                    if (title.startsWith('Denied')) {
                        reject(new Error(title.split(/[ =]/)[2]));
                        win.removeAllListeners('closed');
                        win.close();
                    } else if (title.startsWith('Success')) {
                        resolve(title.split(/[ =]/)[2]);
                        win.removeAllListeners('closed');
                        win.close();
                    }
                });
            });
        });
    }
}