import React from 'react';
import {
  Typography,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import moment from 'moment';
import axios from 'axios';
import CoordTranslator from 'components/CoordTranslator';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  text: {
    maxWidth: 200,
  },
}));

export default function CustomListItem(props) {
  const classes = useStyles();
  const {log, camera} = props;
  React.useEffect(() => {}, []);
  const [accurate, setAccurate] = React.useState(log.accurate);

  const handleAccuracyChange = async (id, event) => {
    setAccurate(event.target.value);
    await axios.put(`/logs/${id}`, {accurate: event.target.value});
  };

  return (
    <ListItem key={`log-${log.id}`}>
      <ListItemText
        className={classes.text}
        primary={`${camera.name}, ${moment(parseInt(log.dateTime, 10)).format(
          'DD-MM-YYYY'
        )}`}
        secondary={<CoordTranslator location={camera.location} />}
      />
      <ListItemSecondaryAction>
        <FormControl className={classes.formControl}>
          <InputLabel id="accuracy-select-label">Accuracy</InputLabel>

          <Select
            labelId="accuracy-select-label"
            id="accuracy-select"
            value={accurate}
            onChange={event => handleAccuracyChange(log.id, event)}>
            <MenuItem value>
              <em>True</em>
            </MenuItem>
            <MenuItem value={false}>
              <em>False</em>
            </MenuItem>
          </Select>
        </FormControl>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

CustomListItem.propTypes = {
  log: PropTypes.shape({
    id: PropTypes.number,
    CameraId: PropTypes.number,
    dateTime: PropTypes.string,
    accurate: PropTypes.bool,
  }),
  camera: PropTypes.shape({
    id: PropTypes.number,
    url: PropTypes.string,
    name: PropTypes.string,
    location: PropTypes.string,
    UserCamera: PropTypes.array,
  }),
};

CustomListItem.defaultProps = {
  log: {},
  camera: {},
};
