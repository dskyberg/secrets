import KMS from '../aws/KMS';
import aws from '../aws/AWS';
import AesGcm from './aes_gcm';

export default class Envelope {

    /**
     * Seal generates a 256-bit data key using KMS and encrypts the given plaintext
     * with AES-256-GCM using a random nonce. The ciphertext is appended to the
     * nonce, which is in turn appended to the KMS data key ciphertext and returned.
     */
    static seal(plainText, context, keyId) {
        const kms = aws.getKMS();
        const encryptionContext = Envelope.mapToObject(context);
        return kms.generateDataKey(keyId, encryptionContext)
            .then((keyData) => {
                const keyBlob = keyData.CiphertextBlob;
                const inner_ciphertext = AesGcm.encrypt(keyData.Plaintext, plainText, new Buffer(keyData.KeyId));
                const cipherText = Envelope.join(keyBlob, inner_ciphertext);
                return cipherText;
            })
            .catch((err) => {
                console.log('Envelope.seal - kms.generateDataKey error:', err);
                return err;
            });
    }



    /**
     * Uses the KMS key to decrypt the AES key.  Then uses local crypto to
     * decrypt the cipher text.
     *
     * Decryption is a two step process:
     * 		The AES key ciphertextBlob is pulled from the ciphertext. AWS KMS is used to decrypt the ciphertextBlob. 
     *  	The AES key plaintext is then used to decrypt the document ciphertext.
     * 
     * @param ctxt Set of string values that act the KMS context
     * @param ciphertext The Sealed key
     * @return The fully decrypted plain text.
     */
    static open(cipherText, context) {
        const kms = aws.getKMS();
        const key_and_ciphertext = Envelope.split(cipherText);

        const keyBlob = key_and_ciphertext[0];
        const inner_ciphertext = key_and_ciphertext[1];

        // Use AWS KMS to decrypt the AES key
        return kms.decrypt(keyBlob, Envelope.mapToObject(context))
            .then((data) => {
                // Use AES_GCM to decrypt the data
                const plaintext = AesGcm.decrypt(data.Plaintext, inner_ciphertext, new Buffer(data.KeyId));
                return plaintext;
            })
            .catch((err) => {
                console.log('Envelope.open - kms.decrypt error:', err);
                return err;
            });
    }


    /**
     * Creates a buffer containing the key length + key + cipher text
     * @param key dynamic encryption key
     * @param cipher cipher text from encryption operation
     * @return byte[] with length 4 + key length + cipher length
     */
    static join(key, cipher) {
        const keySize = 4;
        const keyLen = key.length;
        const cipherLen = cipher.length;
        var data, dv;
        try {
            data = new Uint8Array(keySize + keyLen + cipherLen);
        } catch (e) {
            console.log('Envelope.join - failed creating Uint8Array:', keySize, keyLen, cipherLen, e);
            throw e;
        }
        try {
            dv = new DataView(data.buffer);
        } catch (e) {
            console.log('Envelope.join - failed creating DataView:', data, e);
            throw e;
        }
        try {
            dv.setUint32(0, keyLen);
        } catch (e) {
            console.log('Envelope.join - failed adding keyLen to DataView:', keyLen, e);
            throw e;
        }

        data.set(key, keySize);
        data.set(cipher, keySize + keyLen);
        return data;
    }

    /**
     * Splits the Envelope into key and cipher.  
     * 
     * The byte data is comprised of 3 peices:
     *   [0 - 3]: AES key Length (keyLen)
     *   [4 - (keyLen + 4)]: AES key
     *   [(keyLen + 4) - ]: cipher
     * 
     * @param data S3 data octets as Uint8Array
     * @return Array of 2 Uint8Arrays, 0: key, 1: cipher
     */
    static split(data) {
        // keySize is the first 4 bytes (big endian)
        const keySize = 4;
        const keyLen = new DataView(data.buffer).getUint32(0);

        // The key is the the next <keyLen> bytes 
        const key = data.slice(keySize, keyLen + keySize);

        // The remaining bytes are the cipher
        const cipher = data.slice(keyLen + keySize);

        return [key, cipher];
    }

    static mapToObject(context) {
        let map = {};
        context.forEach((value, key) => {
            map[key] = value;
        });
        return map;
    }
}