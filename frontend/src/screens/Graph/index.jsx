/* eslint-disable react/prop-types */
import React, {useState, useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
// import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import {MenuItem, FormControl, InputLabel, Select} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import moment from 'moment';
import axios from 'axios';
import randomColor from 'randomcolor';
import {logs as test} from './data';

// const Line = props => (
//   <LineSeries.Path
//     {...props}
//     path={line()
//       .x(({arg}) => arg)
//       .y(({val}) => val)
//       .curve(curveCatmullRom)}
//   />
// );

const titleStyles = {
  title: {
    textAlign: 'center',
    width: '100%',
    marginBottom: '10px',
  },
};
const Text = withStyles(titleStyles)(props => {
  const {text, classes} = props;
  const [mainText, subText] = text.split('\\n');
  return (
    <div className={classes.title}>
      <Typography component="h3" variant="h5">
        {mainText}
      </Typography>
      <Typography variant="subtitle1">{subText}</Typography>
    </div>
  );
});

const legendStyles = () => ({
  root: {
    display: 'flex',
    margin: 'auto',
    flexDirection: 'row',
  },
});
const legendLabelStyles = theme => ({
  label: {
    marginBottom: theme.spacing(1),
    whiteSpace: 'nowrap',
  },
});
const legendItemStyles = () => ({
  item: {
    flexDirection: 'column-reverse',
  },
});

const legendRootBase = ({classes, ...restProps}) => (
  <Legend.Root {...restProps} className={classes.root} />
);
const legendLabelBase = ({classes, ...restProps}) => (
  <Legend.Label className={classes.label} {...restProps} />
);
const legendItemBase = ({classes, ...restProps}) => (
  <Legend.Item className={classes.item} {...restProps} />
);
const Root = withStyles(legendStyles, {name: 'LegendRoot'})(legendRootBase);
const Label = withStyles(legendLabelStyles, {name: 'LegendLabel'})(
  legendLabelBase
);
const Item = withStyles(legendItemStyles, {name: 'LegendItem'})(legendItemBase);
// const demoStyles = () => ({
//   chart: {
//     paddingRight: '30px',
//   },
// });

const useStyles = makeStyles(theme => ({
  chart: {
    paddingRight: '30px',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  root: {
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  grow: {
    flexGrow: 1,
  },
  img: {
    borderRadius: 4,
    width: '100%',
  },
  paper: {
    padding: theme.spacing(2, 2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function Graph(props) {
  const [logs, setLogs] = useState([]);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const classes = useStyles();
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    new Array(20),
    (val, index) => index + currentYear - 10
  );

  useEffect(() => {
    setYear(currentYear);
    axios.get(`/logs/${currentYear}`).then(({data}) => {
      console.log(data);
      setLogs(data);
    });
  }, []);

  const handleMonthChange = event => {
    setMonth(event.target.value);
    axios.get(`/logs/${year}/${event.target.value}`).then(({data}) => {
      console.log(data);
      setLogs(data);
    });
  };
  const handleYearChange = event => {
    setYear(event.target.value);
    axios.get(`/logs/${event.target.value}`).then(({data}) => {
      console.log(data);
      setLogs(data);
    });
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={10}>
          <Paper className={classes.paper}>
            {logs.length ? (
              <ResponsiveContainer width="95%" height={600}>
                <LineChart
                  data={logs}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dateTime" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {Object.keys(logs[0]).map((keyName, keyIndex) => {
                    if (keyIndex > 0) {
                      return (
                        <Line
                          type="monotone"
                          dataKey={keyName}
                          stroke={randomColor()}
                          activeDot={{r: 8}}
                        />
                      );
                    }
                    return null;
                  })}
                </LineChart>
              </ResponsiveContainer>
            ) : null}
          </Paper>
        </Grid>

        <Grid item xs={2}>
          <Paper className={classes.paper}>
            <Typography>Filters</Typography>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">Year</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={year}
                onChange={handleYearChange}>
                <MenuItem value={currentYear}>
                  <em>Current</em>
                </MenuItem>
                {years.map(yearS => {
                  return <MenuItem value={yearS}>{yearS}</MenuItem>;
                })}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">Month</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={month}
                onChange={handleMonthChange}>
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {moment.months().map((monthS, key) => {
                  return <MenuItem value={key}>{monthS}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
