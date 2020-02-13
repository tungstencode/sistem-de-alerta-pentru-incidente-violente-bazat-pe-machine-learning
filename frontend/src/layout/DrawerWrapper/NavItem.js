import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {NavLink} from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  icon: {
    color: 'black',
    marginLeft: theme.spacing(1),
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.primary.inactive,
    backgroundColor: theme.palette.primary.inactive,
    hover: theme.palette.primary.main,
  },
  activeLink: {
    backgroundColor: theme.palette.primary.main,
  },
}));

function NavItem({path, title, Icon, exact = false, ...rest}) {
  const classes = useStyles();
  return (
    <ListItem
      button
      component={NavLink}
      exact={exact}
      to={path}
      // hoverClassName={classes.activeLink}
      className={classes.link}
      activeClassName={classes.activeLink}
      {...rest}>
      {Icon && (
        <ListItemIcon>
          <Icon className={classes.icon} />
        </ListItemIcon>
      )}
      {/* <ListItemText primary={title} /> */}
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
