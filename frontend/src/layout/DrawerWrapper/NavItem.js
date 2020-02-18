import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import {NavLink} from 'react-router-dom';
import {AwesomeButton} from 'react-awesome-button';
import '../../styles/awesomeStyle.css';

const useStyles = makeStyles(theme => ({
  icon: {
    color: 'black',
    marginLeft: theme.spacing(1),
  },
  link: {
    backgroundColor: 'black',
    // firstChild:
  },
  activeLink: {
    backgroundColor: 'white',
  },
}));

// 'aws-btn--middle',

function NavItem({path, title, Icon, exact = false, ...rest}) {
  const classes = useStyles();
  return (
    // <ListItem
    //   button
    //   component={NavLink}
    //   className={classes.link}
    //   activeClassName={classes.activeLink}
    //   exact={exact}
    //   to={path}>
    //   <Icon style={{fontSize: 40}} />
    // </ListItem>

    // <ListItem
    //   button
    //   component={AwesomeButton}
    //   element={NavLink}
    //   className={classes.link}
    //   activeClassName={classes.activeLink}
    //   exact={exact}
    //   to={path}>
    //   {/* <AwesomeButton
    //     size="medium"
    //     element={NavLink}

    //     ripple> */}
    //   <Icon style={{fontSize: 40}} />
    //   {/* </AwesomeButton> */}
    // </ListItem>

    // <AwesomeButton
    //   size="medium"
    //   element={NavLink}
    //   component={ListItem}
    //   exact={exact}
    //   to={path}
    //   ripple
    //   className={classes.link}
    //   activeClassName={classes.activeLink}
    //   {...rest}>
    //   <Icon style={{fontSize: 40}} />
    // </AwesomeButton>

    <ListItem
      // className={classes.link}
      // activeClassName={classes.activeLink}
      // activeClassName={classes.activeLink}
      // button
      exact={exact}
      to={path}
      component={NavLink}>
      <AwesomeButton
        size="medium"
        // light
        activeClassName={classes.activeLink}
        element={NavLink}
        exact={exact}
        to={path}
        // className="active"
        // activeClassName={classes.activeLink}
        // ripple
        {...rest}>
        <Icon style={{fontSize: 40}} />
      </AwesomeButton>
    </ListItem>
  );
}

NavItem.propTypes = {
  path: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  // eslint-disable-next-line react/require-default-props
  exact: PropTypes.bool,
  // eslint-disable-next-line react/require-default-props
  Icon: PropTypes.node,
};

export default NavItem;
