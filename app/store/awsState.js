import { observable, action, asMap, useStrict, computed } from 'mobx';
useStrict(true);

export class AwsState {
    @observable init = false;
    @observable region = 'us-west-2';
    @observable regions = [];
    @observable context = '';
    @observable expiration = 0;
    @observable credentials = null;

    @action setInit(value) {
        this.init = value;
    }

    @computed get regionsCount() {
        return this.regions.length;
    }

    @action
    setContext(value) {
        if (!value || value === this.context) {
            return;
        }
        this.context = value;
    }

    @action
    setRegion(value) {
        if (!value || value === this.region) {
            return;
        }
        this.region = value;
    }

    @action
    setRegions(values) {
        if (!values || values === null) {
            this.regions.clear();
        }
        this.regions = values;
    }

    @action
    setCredentials(token) {
        this.credentials = null;
        this.expiration = 0;
        if (!token || token === null) {
            console.log('AwsState.secCredentials - no token:', token);
            return;
        }
        this.credentials = token;
        this.expiration = token.Expiration.getTime();
    }

    @computed get config() {
        return {
            region: this.region,
            credentials: {
                accessKeyId: this.credentials.AccessKeyId,
                secretAccessKey: this.credentials.SecretAccessKey,
                sessionToken: this.credentials.SessionToken
            }
        };
    }

    @computed get expired() {
        return Date.now() >= this.expiration;
    }
}
const awsState = new AwsState();
export default awsState;