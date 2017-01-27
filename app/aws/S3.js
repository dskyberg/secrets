import URL from 'url-parse';
import S3Vault from '../utils/s3_vault';
import s3State from '../store/s3State';

export class S3Bucket {
    constructor(uri) {
        this.protocol = '';
        this.bucket = '';
        this.prefix = '';
        this.path = '';
        this.contents = null;
        this.open = false;
        this.parseURI(uri);
    }

    /**
     * An S3 object uri should contain 4 parts:
     * bucket: Boot level S3 bucket
     * prefix: Bucket prefix
     * path:
     * object:
     * 
     * The URL parser returns
     * protocol: s3
     * hostname: 
     * pathname: 
     * 
     * The prefix is the first element of the pathname
     */
    parseURI(uri) {
        if (uri == null || uri.length == 0) {
            return;
        }
        let url = new URL(uri);
        this.protocol = url.protocol;
        this.bucket = url.hostname;
        // The pathname *should* have 2 or more parts, containing the prefix,
        // (optional) path, and object.  
        let pathName = url.pathname;
        if (pathName.startsWith('/')) {
            pathName = pathName.substr(1);
        }
        if (pathName.endsWith('/')) {
            pathName = pathName.substr(0, pathName.length);
        }
        let pathparts = pathName.split('/');
        this.prefix = pathparts[0];
        if (pathparts.length > 2) {
            this.object = pathparts[pathparts.length - 1];
        }
        if (pathparts.length > 4) {
            this.path = pathparts.slice(1, pathparts.length - 1).join('/');
        }
    }

    /**
     * Returns a string representing the s3 URI, such as is parsed by parseURI
     */
    getURI() {
            return `s3://${this.bucket}/${this.prefix}/${this.path}`;
        }
        /**
         * returns the joined prefix and path.
         */
    getKey() {
        return this.prefix + '/' + this.path;
    }
}


export default class S3 {

    constructor(s3_sdk) {
        this.s3_sdk = s3_sdk;
    }

    listBuckets() {
        var params = {};
        //s3State.toggleFetchingBuckets();
        return new Promise((resolve, reject) => {
            // Retrieves all keys
            this.s3_sdk.listBuckets(params, function(err, data) {
                if (err) {
                    console.log('S3.listBuckets error:', err);
                    //s3State.toggleFetchingBuckets();
                    reject(err);
                } else {
                    let buckets = [];
                    data.Buckets.forEach((bucket) => {
                            buckets.push(bucket.Name);
                        })
                        //s3State.toggleFetchingBuckets();
                    resolve(buckets);
                }
            });
        })
    }

    listPrefixes(bucket) {
        if (bucket === null || bucket === '') {
            return Promise.resolve(null);
        }
        s3State.toggleFetchingPrefixes();
        return new Promise((resolve, reject) => {
            const params = {
                Bucket: bucket,
                Delimiter: '/'
            };
            this.s3_sdk.listObjectsV2(params, function(err, data) {
                if (err) {
                    console.log('S3.listPrefixes error:', err);
                    s3State.toggleFetchingPrefixes();
                    reject(err);
                } else {
                    let prefixes = [];
                    data.CommonPrefixes.forEach((commonPrefix) => {
                        prefixes.push(commonPrefix.Prefix.substr(0, commonPrefix.Prefix.length - 1));
                    })
                    s3State.toggleFetchingPrefixes();
                    resolve(prefixes);
                }
            });
        })
    }

    listObjects(bucket, prefix) {
        if (bucket === null || bucket === '' ||
            prefix === null || prefix === '') {
            return Promise.resolve(null);
        }
        s3State.toggleFetchingObjects();
        return new Promise((resolve, reject) => {
            const params = {
                Bucket: bucket,
                Prefix: prefix
            };
            this.s3_sdk.listObjectsV2(params, function(err, data) {
                if (err) {
                    console.log('S3.listObjects error:', err);
                    s3State.toggleFetchingObjects();
                    reject(err);
                } else {
                    let vaults = {};
                    data.Contents.forEach((path) => {
                        const base = prefix + '/';
                        if (path.Key === base) {
                            return;
                        }
                        const p = path.Key.substr(base.length);
                        vaults[p] = new S3Vault(bucket, prefix, p, null);
                    })
                    s3State.toggleFetchingObjects();
                    resolve(vaults);
                }
            });
        })
    }

    /**
     * Returns a Uint8Array if the object is found.
     * The data structure that AWS returns in the data.Body has a 
     * Uint8Array prototype, rather than TypedArray.  So, we copy it
     * over into a new Uint8Array, so that stuff works down the line.
     */
    getObject(bucket, s3Key) {
        if (bucket === null || bucket === '' ||
            s3Key === null || s3Key === '') {
            return Promise.reject('S3.getObject: bad arguements');
        }
        return new Promise((resolve, reject) => {
            const params = { Bucket: bucket, Key: s3Key }
            this.s3_sdk.getObject(params, (err, data) => {
                if (err) {
                    console.log('S3.getObject error:', err);
                    reject(err);
                } else {
                    resolve(new Uint8Array(data.Body));
                }
            })
        });
    }

    /**
     * Saves an object to S3.
     */
    putObject(bucket, s3Key, body) {
        if (bucket === null || bucket === '' ||
            s3Key === null || s3Key === '' ||
            body === null || body.length === 0) {
            return Promise.reject(new Error('S3.putObject: bad arguements'));
        }
        return new Promise((resolve, reject) => {
            const params = {
                Bucket: bucket,
                Key: s3Key,
                Body: body
            }
            this.s3_sdk.putObject(params, (err, data) => {
                if (err) {
                    console.log('S3.putObject error:', err);
                    reject(err);
                } else {
                    resolve(true);
                }
            })
        });
    }

    deleteObject(bucket, s3Key) {
        if (bucket === null || bucket === '' ||
            s3Key === null || s3Key === '') {
            return Promise.reject('S3.deleteObject: bad arguements');
        }
        return new Promise((resolve, reject) => {
            const params = {
                Bucket: bucket,
                Key: s3Key
            }
            this.s3_sdk.deleteObject(params, (err, data) => {
                if (err) {
                    console.log('S3.deleteObject error:', err);
                    reject(err);
                } else {
                    resolve(true);
                }
            })
        });
    }
}