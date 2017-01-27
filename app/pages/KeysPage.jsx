import React, { Component } from 'react';
import { observer } from 'mobx-react';
import aws from '../aws/AWS';
import IAM from '../aws/IAM';
import iamState from '../store/iamState';
import theme from './KeysPage.scss';


@observer
export default class KeysPage extends Component {

  constructor(props, context) {
    super(props, context);
    this.loadRoles();
  }

  
  render() {
    const roles = iamState.roles;
    let i = 1;
    const rolesP = roles.map((role) => {
        return <p key={i++}>{role.name}</p>
    });

    return (
      <section className={theme.section} >
        {rolesP}
      </section>
    );
  }
  loadRoles() {
    if (iamState.rolesCount > 0) {
      return;
    }
    const iam = aws.getIAM();
    iam.listRoles()
    .then((roles) => {
      iamState.setRoles(roles);
    })
    .catch((err) => {
      console.log('loadRoles - IAM.listRoles returned error:', err);
    });
  }
}
