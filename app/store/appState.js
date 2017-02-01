import { observable, action, useStrict } from 'mobx';
useStrict(true);

export class AppState {
    @observable showDrawer = false;
    @observable searchText = '';
    @observable fetching = false;

    @observable snackActive = false;
    @observable snackAction = 'Dismiss';
    @observable snackType = 'accept';
    @observable snackTimeout = 2000;
    @observable snackLabel = '';

    @observable addObjectShow = false;
    @observable addObjectPath = '';
    @observable addObjectValue = '';

    @action('toggleDrawer')
    toggleDrawer() {
        this.showDrawer = !this.showDrawer;
    }

    @action
    setFetching(fetching) {
        this.fetching = fetching;
    }

    @action('setSearchText')
    setSearchText(value) {
        this.searchText = value;
    }

    @action('toggleSnack')
    toggleSnack() {
        this.snackActive = !this.snackActive;
    }

    @action('showSnack')
    showSnack(label, action, type, timeout) {
        this.snackLabel = label;
        this.snackAction = action && action || 'Dismiss';
        this.snackType = type && type || accept;
        this.snackTimeout = timeout && timeout || 2000;
        this.snackActive = true;
    }

    @action('toggleAddObject')
    toggleAddObject() {
        this.addObjectShow = !this.addObjectShow;
    }

    @action('setAddObjectPath')
    setAddObjectPath(value) {
        this.addObjectLabel = value;
    }

    @action('setAddObjectValue')
    setAddObjectValue(value) {
        this.addObectValue = value;
    }
}
const appState = new AppState();
export default appState;