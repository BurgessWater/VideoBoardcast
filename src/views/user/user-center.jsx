/**
 * Created by dz on 16/10/15.
 */

import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import WUserCenter from '../../vendors/wj/view/userCenter/userCenter';
import styles from './user-center.scss';
import AppConfig from '../../server/app-config';

const UserCenter = () =>
  <div styleName="user-center">
    <WUserCenter token={AppConfig.token} />
  </div>;

UserCenter.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default cssModules(UserCenter, styles, { errorWhenNotFound: false });
