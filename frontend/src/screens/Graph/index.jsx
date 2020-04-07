/* eslint-disable react/prop-types */
import React, {useState, useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
// import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
// import {
//   Chart,
//   ArgumentAxis,
//   ValueAxis,
//   LineSeries,
//   Title,
//   Legend,
// } from '@devexpress/dx-react-chart-material-ui';
import {ArgumentScale, Animation} from '@devexpress/dx-react-chart';
import {curveCatmullRom, line} from 'd3-shape';
import {scalePoint} from 'd3-scale';
import moment from 'moment';
import axios from 'axios';
import {logs as test} from './data';

const datee = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

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
    minWidth: 240,
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
  const classes = useStyles();

  useEffect(() => {
    axios.get('/logs').then(({data}) => {
      console.log(data);

      // eslint-disable-next-line fp/no-mutation
      // eslint-disable-next-line no-plusplus
      // for (let i = 0; i < data.length; i++) {
      //   // eslint-disable-next-line fp/no-mutation
      //   // eslint-disable-next-line no-param-reassign
      //   data[i].dateTime = moment(data[0].dateTime, 'x').toDate();
      // }

      const logsC = data;

      // logsC.map(log => {
      //   // eslint-disable-next-line fp/no-mutation
      //   // eslint-disable-next-line no-param-reassign
      //   log.dateTime = moment(log.dateTime, 'x').format('YYYY-MM-DD');
      // });

      console.log(logsC);

      setLogs(logsC);
    });
  }, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={10}>
          <Paper className={classes.paper}>
            {logs.length ? (
              <LineChart
                width={500}
                height={300}
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
                        stroke="#8884d8"
                        activeDot={{r: 8}}
                      />
                    );
                  }
                  return null;
                })}
              </LineChart>
            ) : null}

            {/* 
            {logs.length ? (
              <Chart data={logs} className={classes.chart}>
                <ArgumentScale factory={scalePoint} />
                <ArgumentAxis />
                <ValueAxis />

                <LineSeries
                  name="Camera 1"
                  valueField="numberOfAccidents"
                  argumentField="dateTime"
                  seriesComponent={Line}
                />

                <Title
                  text="Violence Activity\n(Subtitle)"
                  textComponent={Text}
                />
                <Animation />
              </Chart>
            ) : null} */}
          </Paper>
        </Grid>

        <Grid item xs={2}>
          <Paper className={classes.paper}>
            <Typography>Filters</Typography>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
