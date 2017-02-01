import Sneaker from './sneaker';
import aws from '../aws/AWS';
import S3 from '../aws/S3';

export default class S3Vault {
    constructor(bucket, prefix, path, value = null) {
        this.bucket = bucket;
        this.prefix = prefix;
        this.path = path;
        this.value = value;
    }

    /**
     * Use Sneaker to encrypt data, and save in S3
     */
    save = (key, context, data) => {
        try {
            const sneaker = new Sneaker()
                .withS3(this.bucket, this.prefix, this.path)
                .withContext(context)
                .withKeyId(key);
            return sneaker.upload(data)
                .then((ok) => {
                    this.setValue(data);
                    return ok;
                })
                .catch((e) => {
                    console.log('S3Vault.save failed:', e);
                });
        } catch (e) {
            console.log('S3Vault.save failed:', e);
            throw (e);
        }
    }

    /**
     * Use Sneaker to get and decrypt an object from S3
     */
    open = (key, context) => {
        try {

            const sneaker = new Sneaker()
                .withS3(this.bucket, this.prefix, this.path)
                .withContext(context)
                .withKeyId(key);

            return sneaker.download()
                .then((buffer) => {
                    // Because Sneaker was running in the main process (remotely), we need
                    // to load the returned data into a normal TypedArray.
                    this.value = new Uint8Array(buffer);
                    return true;
                })
                .catch((e) => {
                    console.log('S3Vault.open failed:', e);
                });
        } catch (e) {
            console.log('S3Vault.open failed:', e);
            throw (e);
        }
    }

    text = (sEncoding = 'UTF-8') => {
        if (this.value !== null && !this.binary) {
            var StringView = require('./stringView');
            return new StringView(this.value, sEncoding).toString();
        }
        return null;
    }
    setValue = (vInput) => {
        typeSwitch: switch (typeof vInput) {
            case "string":
                this.value = new Uint8Array(vInput.length);
                for (var i = 0, j = vInput.length; i < j; ++i) {
                    this.value[i] = vInput.charCodeAt(i);
                }
                break typeSwitch;
            case "object":
                classSwitch: switch (vInput.constructor) {
                    case String:
                        this.value = new Uint8Array(vInput.length);
                        for (var i = 0, j = vInput.length; i < j; ++i) {
                            this.value[i] = vInput.charCodeAt(i);
                        }
                        break classSwitch;
                    case ArrayBuffer:
                    case Uint32Array:
                    case Uint16Array:
                    case Uint8Array:
                    default:
                        console.log('S3Vault.setValue - could not recognize class', vInput.constructor);
                        throw new Error('S3Vault.setValue - could not recognize class: ', vInput.constructor);
                }
                break typeSwitch;
            default:
                console.log('S3Vault.setValue - could not recognize type', typeof vInput);
                throw new Error('S3Vault.setValue - could not recognize type: ', typeof vInput);
        }
    }

    /**
     * Delete the object from S3
     */
    delete = () => {
        try {
            const s3 = aws.getS3();
            return s3.deleteObject(this.bucket, this.prefix + '/' + this.path)
                .then((ok) => {
                    return true;
                })
                .catch((err) => {
                    console.log('S3Vault.open failed:', err);
                });
        } catch (e) {
            console.log('S3Vault.delete failed:', e);
            throw (e);
        }
    }
}