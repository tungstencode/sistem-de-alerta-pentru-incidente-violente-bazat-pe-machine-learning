import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import {NavLink} from 'react-router-dom';
import {AwesomeButton} from 'react-awesome-button';
import '../../styles/awesomeStyle.css';
// import AwesomeButtonStyles from '../../styles/awesomeStyle.css';

const useStyles = makeStyles(theme => ({
  icon: {
    color: 'black',
    marginLeft: theme.spacing(1),
  },
  link: {
    margin: theme.spacing(1, 0),
  },
  bottomLink: {
    margin: theme.spacing(1, 0),
    position: 'absolute',
    bottom: 0,
  },
}));

function NavItem({path, title, Icon, exact = false, bottom = false, ...rest}) {
  const classes = useStyles();
  return bottom ? (
    <AwesomeButton
      size="medium"
      element={NavLink}
      exact={exact}
      to={path}
      className={classes.bottomLink}
      ripple
      {...rest}>
      <Icon style={{fontSize: 40}} />
    </AwesomeButton>
  ) : (
    <AwesomeButton
      size="medium"
      element={NavLink}
      exact={exact}
      to={path}
      className={classes.link}
      ripple
      {...rest}>
      <Icon style={{fontSize: 40}} />
    </AwesomeButton>
  );
}

NavItem.propTypes = {
  path: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  // eslint-disable-next-line react/require-default-props
  exact: PropTypes.bool,

  // eslint-disable-next-line react/require-default-props
  bottom: PropTypes.bool,
  // eslint-disable-next-line react/require-default-props
  Icon: PropTypes.node,
};

export default NavItem;
