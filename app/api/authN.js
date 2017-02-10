import aws from '../aws/AWS';
import authState from '../store/authState';
import awsState from '../store/awsState';
import credentials from './credentials.json';

export default function authN() {
    const { ElectronGoogleOAuth } = require('electron').remote.require('./electron_google_oauth');
    const auth = new ElectronGoogleOAuth();
    return auth.getAccessToken(
            authState.scope,
            credentials.google.client_id,
            credentials.google.client_secret
        )
        .then(token => {
            authState.setToken(token);
            const sts = aws.getSTS();
            sts.assumeRoleWithWebIdentity(token)
                .then(data => {
                    awsState.setCredentials(data.Credentials);
                    aws.init();
                    return true;
                });
        })
        .catch(err => {
            console.log('authN - failed to authenticate:', err);
            throw err;
        });
}