import aws from '../aws/AWS';
import Envelope from './Envelope';

export default class Sneaker {
    constructor() {
        this.bucket = '';
        this.prefix = '';
        this.path = '';
        this.context = '';
        this.keyId = '';
    }

    withS3(bucket, prefix, path) {
        this.bucket = bucket;
        this.prefix = prefix;
        this.path = path;
        return this;
    }

    withContext(context) {
        this.context = context;
        return this;
    }

    withKeyId(keyId) {
        this.keyId = keyId;
        return this;
    }

    /** 
     * Encrypt and save to S3
     * 
     */
    upload(plainText) {
        const s3 = aws.getS3();
        const s3Key = this.prefix + '/' + this.path;
        const context = this.getEncryptionContext();
        return Envelope.seal(plainText, context, this.keyId)
            .then((cipherText) => {
                return s3.putObject(this.bucket, s3Key, cipherText)
            })
            .catch((e) => {
                console.log('Sneaker.upload - Envelop.seal failed:', e);
            })
    }

    /**
     * Download the object from S3, and decrypt it.
     */
    download() {
        const s3 = aws.getS3();
        const s3Key = this.prefix + '/' + this.path;
        const context = this.getEncryptionContext();
        return s3.getObject(this.bucket, s3Key)
            .then((cipherText) => {
                return Envelope.open(cipherText, context);
            })
            .catch((e) => {
                console.log('Sneaker.download - Envelop.open failed:', e);
            })
    }

    /**
     * Combines the context provided in the ctor with the S3 path.  This forms
     * the final context used for encryption and decryption.
     */
    getEncryptionContext() {
        const ctx = this.contextToMap();
        ctx.set('Path', this.getS3Path());
        return ctx;
    }

    /**
     * Turns the bucket, prefix, and path into a valid S3 path,
     * such as s3://<bucket>/<prefix>/<path>.  
     * 
     * The S3 path is used as part of the KMS encryption context.
     */
    getS3Path() {
        return `s3://${this.bucket}/${this.prefix}/${this.path}`;
    }

    /**
     * Local method to turn the context provided in the ctor into an
     * ordered map.
     */
    contextToMap() {
        let ctx = new Map();
        if (this.context === null || this.context === '') {
            return ctx;
        }
        console.log('Sneaker.contextToMap - context:', this.context);
        this.context.split('.').forEach((part) => {
            const parts = part.split('=');
            ctx.set(parts[0].trim(), parts[1].trim());
        });
        return ctx;
    }

}