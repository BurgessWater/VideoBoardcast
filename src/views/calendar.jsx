/**
 * Created by kiny on 16/10/2.
 */

import React from 'react';
import styles from './calendar.scss';
import Dialog from '../components/dialog';
import { insertComponent } from '../ultils/helper';

export default class Calendar extends React.Component {
  static show() {
    insertComponent(<Calendar />);
  }

  static onload() {
    console.log('onloading');
  }

  render() {
    return (
      <Dialog title="财经日历" styles={styles}>
        <iframe
          onLoad={Calendar.onload} width="100%" height="500" frameBorder={0}
          src={FINANCE_URL}
        />
      </Dialog>
    );
  }
}

