# Secrets: Sneaker UI
**Sneaker** [go based app](https://github.com/codahale/sneaker), developed by [Coda Hale](https://github.com/codahale).

Per the `sneaker` README.md:

`sneaker` is a utility for storing sensitive information on AWS using S3
and the Key Management Service (KMS) to provide durability,
confidentiality, and integrity.

Secrets are stored on S3, encrypted with AES-256-GCM and single-use,
KMS-generated data keys.

`Secrets` is an [Electron](http://electron.atom.io/) app, based on `sneaker`. `Secrets`
does not directly use `sneaker`.  The agorithms have all be re-coded in javascript. 

`Secrets` is developed with [React](https://facebook.github.io/react/) and 
[Mobx](https://mobx.js.org/) using [Material Design](https://material.io/) via
[react-toolbox](http://react-toolbox.com/#/). So, it is light-weight, and highly
extensible.

## Steps to build

### 1. Install Node

This app requires Node 6.x. and has been successfully tested with Node 7.4.0.

### 2. Download the code
```
> git clone https://github.com/dskyberg/secrets.git
> cd secrets
```

### 3. Build the app

From the `secrets` folder, run the following to generate the production build
and to create the OS specific packages:

```
> yarn package
```
If successful, you should see several folders under `sneaker/release` with 
runnable executables.

## Steps to run

### Prerequisits

#### 1. Set your AWS Stuff
This app leverates the AWS STS (AssumeRoleWithWebIdentity).  As such, you must
set your AWS_ORG_ID as an env value before running:
```
> export AWS_ORG_ID=<your org id>
```
If you do not set AWS_REGION, then the app will default to us-west-2.  You can
change the region within the app.  To set a default region, use:
```
> export AWS_REGION=<your region>

#### 2. Set the default Sneaker environment
See 
[Setting Up the Environment](https://github.com/codahale/sneaker#setting-up-the-environment). 
If set, the app uses the `SNEAKER_MASTER_KEY`, `SNEAKER_MASTER_CONTEXT`, and `SNEAKER_S3_PATH`
as defaults.  But you can also set these from within the app.

### 1. Launch the app

