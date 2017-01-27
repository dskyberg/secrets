import { observable, action, useStrict, computed } from 'mobx';

useStrict(true);

export class IamState {
    @observable roles = [];

    @computed get rolesCount() {
        return this.roles.length;
    }

    @action
    setRoles(values) {
        if (!values || values === null) {
            this.roles.clear();
        }
        this.roles = values;
    }

}

const iamState = new IamState();
export default iamState;