export default class KMS {

    constructor(kms_sdk) {
        this.kms_sdk = kms_sdk;
    }

    getKeys() {
        return new Promise((resolve, reject) => {
                // Retrieves all keys
                const params = {};
                this.kms_sdk.listKeys(params, function(err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data.Keys);
                    }
                });
            })
            .then((keys) => {
                return Promise.all(keys.map((key) => {
                    return new Promise((resolve, reject) => {
                        const params = { KeyId: key.KeyId };
                        this.kms_sdk.describeKey(params, function(err, data) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(data.KeyMetadata);
                            }
                        })
                    });
                }))
            });
    }

    generateDataKey(keyId, encryptionContext) {
        return new Promise((resolve, reject) => {
            const alias = KMS.usableKeyId(keyId);
            const params = {
                EncryptionContext: encryptionContext,
                KeyId: alias,
                KeySpec: "AES_256"
            };
            try {
                this.kms_sdk.generateDataKey(params, function(err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            } catch (e) {
                console.log('KMS.generateDataKey error:', e);
                reject(err);
            }
        })
    }

    encrypt(keyId, plainText, encryptionContext) {
        return new Promise((resolve, reject) => {
            // Retrieves all keys
            const alias = KMS.usableKeyId(keyId);
            const params = {
                KeyId: alias,
                PlainText: plainText,
                EncryptionContext: encryptionContext
            };
            this.kms_sdk.encrypt(params, function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.CiphertextBlob);
                }
            });
        })
    }

    decrypt(ciphertextBlob, encryptionContext) {
        return new Promise((resolve, reject) => {
            // Retrieves all keys
            const params = {
                CiphertextBlob: ciphertextBlob,
                EncryptionContext: encryptionContext
            };
            this.kms_sdk.decrypt(params, function(err, data) {
                if (err) {
                    console.log('KMS.decrypt - decrypt returned an error:', err);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        })
    }
    static usableKeyId(keyId) {
        // See if this is a standard keyId, like 1785ee53-aa42-438f-af76-b5504195eea6
        if (KMS.isId(keyId)) {
            return keyId;
        }
        // Must be an alias.  
        return keyId.startsWith('alias/') && keyId || 'alias/' + keyId;
    }

    static isId(keyId) {
        // 1785ee53-aa42-438f-af76-b5504195eea6
        const idPattern = /[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}/;
        const m = keyId.match(idPattern);
        return m !== null;
    }
}