import awsState from '../store/awsState';
import kmsState from '../store/kmsState';
import s3State from '../store/s3State';
import EC2 from './EC2';
import KMS from './KMS';
import S3, { S3Bucket } from './S3';
import IAM from './IAM';
import STS from './STS';

//import { requireTaskPool } from 'electron-remote';

//const aws_sdk = requireTaskPool(require.resolve('aws-sdk'));
class AWS {

    constructor() {
        this.aws_sdk = require('electron').remote.require('aws-sdk');
        awsState.setRegion(process.env.AWS_REGION);
    }

    init() {
        this.loadRegions();
        this.loadKeys();
        this.loadBuckets();
        this.loadContext();
    }

    loadContext() {
        const context = process.env.SNEAKER_MASTER_CONTEXT;
        if (context !== null) {
            awsState.setContext(context);
        }
    }

    loadRegions() {
        const ec2 = this.getEC2();
        ec2.getRegions().then((values) => {
                awsState.setRegions(values);
            })
            .catch(err => {
                console.log(err);
            });
    }

    loadKeys() {
        const kms = this.getKMS();
        kms.getKeys().then((values) => {
                kmsState.setKeys(values);
                const key = process.env.SNEAKER_MASTER_KEY;
                if (key !== null) {
                    kmsState.setKey(key);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    loadBuckets() {
        const s3 = this.getS3();
        s3.listBuckets()
            .then((buckets) => {
                s3State.setBuckets(buckets);
                const path = process.env.SNEAKER_S3_PATH;
                if (path !== null) {
                    const url = new S3Bucket(path);
                    s3State.setBucketAndPrefix(url.bucket, url.prefix);

                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    getEC2() {
        const sdk = new this.aws_sdk.EC2(awsState.config);
        return new EC2(sdk);
    }

    getS3() {
        const sdk = new this.aws_sdk.S3(awsState.config);
        return new S3(sdk);
    }

    getKMS() {
        const sdk = new this.aws_sdk.KMS(awsState.config);
        return new KMS(sdk);
    }

    getIAM() {
        const sdk = new this.aws_sdk.IAM(awsState.config);
        return new IAM(sdk);
    }

    getSTS() {
        const sdk = new this.aws_sdk.STS();
        return new STS(sdk);
    }
}
const aws = new AWS();
export default aws;