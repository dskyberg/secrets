import getSafeProp from '../utils/getSafeProp';

const principals = {
    ec2: { Action: '', Service: 'ec2.amazonaws.com' },
    lambda: { Action: 'sts:AssumeRole', Service: 'lambda.amazonaws.com' }
};
export class IamStatement {
    constructor() {
        this.action = null;
        this.effect = null;
        this.condition = null;
        this.principal = null;
    }
    withAction = (action) => { this.action = action; return this; }
    withEffect = (effect) => { this.effect = effect; return this; }
    withCondition = (condition) => { this.condition = condition; return this; }
    withPrincipal = (principal) => { this.principal = principal; return this; }
}
export class IamPolicyDoc {
    constructor() {
        this.version = null;
        this.statement = null;
    }
    withVersion = (version) => { this.version = version; return this; }
    withStatement = (statement) => { this.statement = statement; return this; }
}

export class IamRole {
    constructor() {
        this.id = null;
        this.name = null;
        this.statement = null;
        this.path = null;
        this.policy = null;
    }
    withId = (id) => { this.id = id; return this; }
    withName = (name) => { this.name = name; return this; }
    withStatement = (statement) => { this.statement = statement; return this; }
    withPath = (path) => { this.path = path; return this; }
    withPolicy = (policy) => { this.policy = policy; return this; }
}

export default class IAM {

    constructor(sdk) {
        this.sdk = sdk;
    }

    listRoles = () => {
        return new Promise((resolve, reject) => {
            const params = {

            };
            this.sdk.listRoles(params, (err, data) => {
                if (err) {
                    reject(err);
                }
                let roles = [];
                data.Roles.forEach((role) => {
                    roles.push(new IamRole()
                        .withId(getSafeProp(role, 'RoleId'))
                        .withName(getSafeProp(role, 'RoleName'))
                        .withPath(getSafeProp(role, 'Path'))
                        .withPolicy(IAM.parsePolicy(getSafeProp(role, 'AssumeRolePolicyDocument')))
                    );
                })
                resolve(roles);
            })
        });
    }

    static parseStatement(doc) {
        if (!doc || doc == null) {
            return null;
        }
        const action = getSafeProp(doc, 'Action');
        const effect = getSafeProp(doc, 'Effect');
        const condition = getSafeProp(doc, 'Condition');
        const principal = getSafeProp(doc, 'Principal');
        return new Statement()
            .withAction(action)
            .withEffect(effect)
            .withCondition(condition)
            .withPrincipal(principal)
    }

    static parseStatements(doc) {
        if (!doc || doc === null || getSafeProp(doc, 'Statement') === null) {
            return null;
        }

        const statements = [];
        if (Array.isArray(doc) === true) {
            doc.forEach((s) => { statements.push(IAM.parseStatement(s)) });
        } else {
            statemens.push(IAM.parseStatement(doc))
        }
        return stateents;
    }

    static parsePolicy(doc) {
        if (!doc || doc == null) {
            return null;
        }
        const version = getSafeProp(doc, 'Version');
        const statement = IAM.parseStatements(getSafeProp(doc, 'Statement'))
        return new IamPolicyDoc().withVersion(version).withStatement(statement);
    }
}