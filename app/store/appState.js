import { observable, action, useStrict } from 'mobx';
useStrict(true);

export class AppState {
    @observable showDrawer = false;
    @observable searchText = '';
    @observable fetching = false;
    @observable snackActive = false;
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

    @action('setSnackLabel')
    setSnackLabel(label) {
        this.snackLabel = label;
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