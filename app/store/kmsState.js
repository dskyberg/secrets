import { observable, action, useStrict, computed } from 'mobx';
useStrict(true);

export class KmsState {
    @observable keys = [];
    @observable key = null;

    @computed get keysCount() {
        return this.keys.length;
    }

    @action
    setKey(value) {
        if (!value || value === this.key) {
            return;
        }
        this.key = value;
    }

    @action
    setKeys(values) {
        if (!values || values === null) {
            this.keys.clear();
        }
        this.keys = values;
    }

}

const kmsState = new KmsState();
export default kmsState;