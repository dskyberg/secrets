import { observable, action, asMap, useStrict, computed } from 'mobx';
import aws from '../aws/AWS';
useStrict(true);

export class S3State {
    @observable fetchingBuckets = false;
    @observable buckets = [];
    @observable bucket = "";
    @observable fetchingPrefixes = false;
    @observable prefixes = [];
    @observable prefix = "";
    @observable fetchingObjects = false;
    @observable s3Objects = asMap({});
    @observable path = "";

    @computed get bucketsCount() {
        return this.buckets.length;
    }

    @computed get prefixesCount() {
        return this.prefixes.length;
    }

    @computed get s3ObjectsCount() {
        return this.s3Objects.size;
    }

    @action
    toggleFetchingBuckets() {
        this.fetchingBuckets = !this.fetchingBuckets;
    }

    @action
    toggleFetchingPrefixes() {
        this.fetchingPrefixes = !this.fetchingPrefixes;
    }

    @action
    toggleFetchingObjects() {
        this.fetchingObjects = !this.fetchingObjects;
    }

    @action
    setBuckets(values) {
        if (!values || values === null) {
            this.buckets.clear();
        }
        this.buckets = values;
    }

    @action
    setBucketAndPrefix(bucket, prefix) {
        if (bucket && bucket === this.bucket && prefix && prefix === this.prefix) {
            return;
        }

        if (bucket && bucket !== null && bucket !== '') {
            this.bucket = bucket;
            const s3 = aws.getS3();
            s3.listPrefixes(bucket)
                .then((prefixes) => {
                    this.setPrefixes(prefixes);
                    if (prefix && prefix !== null) {
                        if (prefixes.includes(prefix)) {
                            this.setPrefix(prefix);
                        } else {
                            console.log('S3State.setBucketAndPrefix: prefix not in list of prefixes,', bucket, prefix, prefixes);
                        }
                    } else {
                        this.setPrefix('');
                    }
                });
        } else {
            this.bucket = '';
            this.setPrefixes([]);
            this.setPrefix('');
        }
    }

    @action
    setBucket(bucket) {
        this.setBucketAndPrefix(bucket);
    }

    @action
    setPrefixes(values) {
        if (values && values !== null && values.length > 0) {
            this.prefixes.replace(values);
        } else {
            this.prefixes.replace([]);
        }
    }

    @action
    setPrefix(value) {
        if (value && value === this.prefix) {
            return;
        }
        const self = this;
        this.prefix = value;
        this.setS3Objects([]);
        if (value !== null && value !== '') {
            const s3 = aws.getS3();
            s3.listObjects(this.bucket, this.prefix)
                .then((objects) => {
                    self.setS3Objects(objects);
                });
        } else {
            self.setS3Objects({});
        }
        this.setPath('');
    }

    @action
    setS3Objects(values) {
        if (!values) {
            return;
        }
        try {
            this.s3Objects.clear();
            this.s3Objects.merge(values);
        } catch (e) {
            if (e instanceof TypeError) {
                console.log('setS3Objects - TypeError: ', e, values, this);
            } else {
                console.log('setS3Objects - Error: ', e);
            }

        }

    }

    @action
    setS3Object(key, value) {
        this.s3Objects.set(key, value);
    }
    @action
    deleteS3Object(key) {
        this.s3Objects.delete(key);
    }

    @action
    setPath(value) {
        this.path = value;
    }
}

const s3State = new S3State();
export default s3State;