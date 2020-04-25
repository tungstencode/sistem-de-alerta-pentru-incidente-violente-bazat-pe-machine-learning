import React, {useState, useEffect} from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';
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
// import {logs as test} from './data';

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

export default function Graph() {
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
    axios.get(`/logs/graph/${currentYear}`).then(({data}) => {
      setLogs(data);
    });
  }, []);

  const handleMonthChange = event => {
    setMonth(event.target.value);
    axios.get(`/logs/graph/${year}/${event.target.value}`).then(({data}) => {
      setLogs(data);
    });
  };
  const handleYearChange = event => {
    setYear(event.target.value);
    setMonth('');
    axios.get(`/logs/graph/${event.target.value}`).then(({data}) => {
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
              <InputLabel id="year-select-label">Year</InputLabel>
              <Select
                labelId="year-select-label"
                id="year-select"
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
              <InputLabel id="month-select-label">Month</InputLabel>
              <Select
                labelId="month-select-label"
                id="month-select"
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
