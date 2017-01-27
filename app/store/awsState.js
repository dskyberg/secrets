import { observable, action, useStrict, computed } from 'mobx';
useStrict(true);

export class AwsState {
    @observable region;
    @observable regions = [];
    @observable context = '';

    constructor() {

    }

    @computed get regionsCount() {
        return this.regions.length;
    }

    @action
    setContext(value) {
        if (!value || value === this.context) {
            return;
        }
        this.context = value;
    }

    @action
    setRegion(value) {
        if (!value || value === this.region) {
            return;
        }
        this.region = value;
    }

    @action
    setRegions(values) {
        if (!values || values === null) {
            this.regions.clear();
        }
        this.regions = values;
    }
}
const awsState = new AwsState();
export default awsState;