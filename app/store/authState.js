import { observable, action, asMap, useStrict, computed } from 'mobx';

useStrict(true);

export class AuthState {
    @observable scope = 'openid email';
    @observable url = 'auth.google.com';
    @observable token = {};
    @observable idToken = {};
    @observable expiresAt = 0;

    @action setScope(value) {
        this.scopes = value;
    }
    @action setUrl(value) {
        this.url = value;
    }

    /**
     * Put the OIDC token in the token field.
     * Calculate the time to expiry based on the token's expires_in
     * attribute.  The expires_in value is seconds from time of issue.
     */
    @action setToken(value) {
        this.expiresAt = Date.now() + (value.expires_in * 1000) - 5;
        this.token = value;
        const idToken = AuthState.unpackIdToken(value);
        if (idToken) {
            this.idToken = idToken;
        } else {
            this.IdToken = {};
        }
    }

    /**
     * As a MobX computed method, expired will force re-calculation on any
     * observers.
     */
    @computed get expired() {
        if (this.expiresAt === 0) {
            return true;
        }
        return Date.now() >= this.expiresAt;
    }

    /**
     * The OIDC response from Google contains an id_token, which is a JWT. JWTs
     * are comprised of 3 Base64 encoded pieces, separated by a '.' The JSON
     * payload is the middle component.
     * 
     * Note: Amazon STS will always validate the id_token.  No need to do that
     * work here.  So, just unpack it and return the id_token as an object.
     * 
     */
    static unpackIdToken(token) {
        if (token === '' || token.hasOwnProperty('id_token') === false) {
            return;
        }
        return AuthState.unpackJWT(token.id_token);
    }

    static unpackJWT(jwt) {
        const jwt_parts = jwt.split('.');
        if (jwt_parts.length !== 3) {
            // bad OIDC token
            return;
        }
        let decoded;
        try {
            decoded = atob(jwt_parts[1]);
        } catch (e) {
            console.log('AuthState.idToken: Could not base64 decode id_token JWT payload.', e);
            return;
        }
        try {
            return JSON.parse(decoded);
        } catch (e) {
            console.log('AuthState.idToken: Malformed JSON in id_token JWT payload.', e);
        }
        return;
    }
}

const authState = new AuthState();
export default authState;