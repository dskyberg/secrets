/**
 * AES Encryption/Decryption with AES-256-GCM 
 */
import crypto from 'crypto';

const AES_KEY_SIZE = 256;
const GCM_NONCE_LENGTH = 12;
const GCM_TAG_LENGTH = 16;


export default class AesGcm {

    /**
     * Decrypts text by given key
     * @param Buffer key
     * @param String base64 encoded input data
     * @param String authentication data
     * @returns String decrypted (original) text
     */
    static decrypt(key, data, authData) {
        try {
            // convert data to buffers
            const nonce = data.slice(0, GCM_NONCE_LENGTH);
            const cipherText = data.slice(GCM_NONCE_LENGTH, data.length - GCM_TAG_LENGTH);
            const authTag = data.slice(-GCM_TAG_LENGTH);
            //console.log(`AesGcm.decrypt Key [${key.length}]:`, key);
            //console.log(`AesGcm.decrypt Nonce [${nonce.length}]:`, nonce);
            //console.log(`AesGcm.decrypt Auth Data [${authData.length}]:`, authData);
            //console.log(`AesGcm.decrypt Cipher Text [${cipherText.length}]:`, cipherText);
            //console.log(`AesGcm.decrypt Auth Tag [${authTag.length}]:`, authTag);

            const decipher = crypto.createDecipheriv('aes-256-gcm', key, nonce);
            decipher.setAutoPadding(false);
            decipher.setAuthTag(authTag);
            decipher.setAAD(authData);
            const decrypted = decipher.update(cipherText);
            decipher.final();
            return decrypted;

        } catch (e) {
            console.log('AesGcm.decrypt:', e);
            throw e;
        }

        // error
        return null;
    }

    /**
     * Encrypts text by given key
     * @param String text to encrypt
     * @param Buffer masterkey
     * @returns String encrypted text, base64 encoded
     */
    static encrypt(key, data, authData) {
        try {
            // random initialization vector
            var nonce = crypto.randomBytes(GCM_NONCE_LENGTH);

            // AES 256 GCM Mode
            const cipher = crypto.createCipheriv('aes-256-gcm', key, nonce);
            cipher.setAutoPadding(false);
            cipher.setAAD(authData);
            const update = cipher.update(data);
            const final = cipher.final();
            const authTag = cipher.getAuthTag();

            // generate output
            return Buffer.concat([nonce, update, final, authTag]);
        } catch (e) {
            console.log('AesGcm.encrypt:', key, data, authData, e);
            throw e;
        }

        // error
        return null;
    }

}