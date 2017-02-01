/**
 * Logging in with Google Sign-in
 * 
 * Google App Credentials
 * clientId
 * clientSecret
 * 
 * AWS Config
 * Role Trust Policy:
 * {
 *  "Version": "2012-10-17",
 *   "Id": "RoleForGoogle",
 *   "Statement": [{
 *     "Effect": "Allow",
 *     "Principal": {"Federated": "<FEDERATED_PRINCIPAL"},
 *     "Action": "sts:AssumeRoleWithWebIdentity",
 *     "Condition": {"StringEquals": {"accounts.google.com:aud": "666777888999000"}}
 *   }]
 * }
 * FEDEATED_PRINCIPAL:
 * Google: accounts.google.com
 * FaceBook: graph.facebook.com
 * Amazon Login: www.amazon.com
 * AWS Cognito: ognito-identity.amazonaws.com
 */
export default class STS {

    constructor(sdk) {
        this.sdk = sdk;
    }

    /*
        data = {
            AssumedRoleUser: {
                Arn: "arn:aws:sts::123456789012:assumed-role/FederatedWebIdentityRole/app1", 
                AssumedRoleId: "AROACLKWSDQRAOEXAMPLE:app1"
            }, 
            Audience: "client.5498841531868486423.1548@apps.example.com", 
            Credentials: {
                AccessKeyId: "AKIAIOSFODNN7EXAMPLE", 
                Expiration: <Date Representation>, 
                SecretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYzEXAMPLEKEY", 
                SessionToken: "AQoDYXdzEE0a8ANXXXXXXXXNO1ewxE5TijQyp+IEXAMPLE"
            }, 
            PackedPolicySize: 123, 
            Provider: "www.amazon.com", 
            SubjectFromWebIdentityToken: "amzn1.account.AF6RHO7KZU5XRVQJGXK6HEXAMPLE"
        }
    */
    assumeRoleWithWebIdentity(oidcToken) {
        const orgId = process.env.AWS_ORG_ID;
        const jwt = atob(oidcToken.id_token.split('.')[1]);
        const idToken = JSON.parse(jwt);

        /* Get the user's name from the email */
        const userName = idToken.email.split('@')[0];

        var params = {
            DurationSeconds: 3600,
            //ProviderId: "accounts.google.com",
            RoleArn: `arn:aws:iam::${orgId}:role/federated_oidc_google_${userName}`,
            RoleSessionName: "secrets1",
            WebIdentityToken: oidcToken.id_token
        };
        return new Promise((resolve, reject) => {
            this.sdk.assumeRoleWithWebIdentity(params, function(err, data) {
                if (err) {
                    console.log(err, err.stack); // an error occurred
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
}