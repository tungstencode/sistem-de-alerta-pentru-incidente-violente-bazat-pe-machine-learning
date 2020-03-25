/* eslint-disable react/prop-types */
import React, {useState, useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
// import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {IconButton, Icon} from '@material-ui/core';
import SaveRoundedIcon from '@material-ui/icons/SaveRounded';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Divider from '@material-ui/core/Divider';
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  LineSeries,
  Title,
  Legend,
} from '@devexpress/dx-react-chart-material-ui';
import {ArgumentScale, Animation} from '@devexpress/dx-react-chart';
import {curveCatmullRom, line} from 'd3-shape';
import {scalePoint} from 'd3-scale';

import axios from 'axios';
import {energyConsumption as data} from './data';

const Line = props => (
  <LineSeries.Path
    {...props}
    path={line()
      .x(({arg}) => arg)
      .y(({val}) => val)
      .curve(curveCatmullRom)}
  />
);

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
const demoStyles = () => ({
  chart: {
    paddingRight: '30px',
  },
});

const useStyles = makeStyles(theme => ({
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

// export default function Graph(props) {
//   const classes = useStyles();

//   return (
//     <div className={classes.root}>
//       <Grid container spacing={3}>
//         <Grid item xs={8}>
//           <Paper className={classes.paper}>
//             <Typography>chart</Typography>
//             <Chart data={data} className={classes.chart}>
//               <ArgumentScale factory={scalePoint} />
//               <ArgumentAxis />
//               <ValueAxis />

//               <LineSeries
//                 name="Hydro-electric"
//                 valueField="hydro"
//                 argumentField="country"
//                 seriesComponent={Line}
//               />
//               <LineSeries
//                 name="Oil"
//                 valueField="oil"
//                 argumentField="country"
//                 seriesComponent={Line}
//               />
//               <LineSeries
//                 name="Natural gas"
//                 valueField="gas"
//                 argumentField="country"
//                 seriesComponent={Line}
//               />
//               <LineSeries
//                 name="Coal"
//                 valueField="coal"
//                 argumentField="country"
//                 seriesComponent={Line}
//               />
//               <LineSeries
//                 name="Nuclear"
//                 valueField="nuclear"
//                 argumentField="country"
//                 seriesComponent={Line}
//               />
//               <Legend
//                 position="bottom"
//                 rootComponent={Root}
//                 itemComponent={Item}
//                 labelComponent={Label}
//               />
//               <Title
//                 text="Energy Consumption in 2004\n(Millions of Tons, Oil Equivalent)"
//                 textComponent={Text}
//               />
//               <Animation />
//             </Chart>
//           </Paper>
//         </Grid>

//         <Grid item xs={4}>
//           <Paper className={classes.paper}>
//             <Typography>Alert settings</Typography>
//           </Paper>
//         </Grid>
//       </Grid>
//     </div>
//   );
// }

class Graph extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data,
    };
  }

  render() {
    const {data: chartData} = this.state;
    const {classes} = this.props;

    return (
      <Paper>
        <Chart data={chartData} className={classes.chart}>
          <ArgumentScale factory={scalePoint} />
          <ArgumentAxis />
          <ValueAxis />

          <LineSeries
            name="Hydro-electric"
            valueField="hydro"
            argumentField="country"
            seriesComponent={Line}
          />
          <LineSeries
            name="Oil"
            valueField="oil"
            argumentField="country"
            seriesComponent={Line}
          />
          <LineSeries
            name="Natural gas"
            valueField="gas"
            argumentField="country"
            seriesComponent={Line}
          />
          <LineSeries
            name="Coal"
            valueField="coal"
            argumentField="country"
            seriesComponent={Line}
          />
          <LineSeries
            name="Nuclear"
            valueField="nuclear"
            argumentField="country"
            seriesComponent={Line}
          />
          <Legend
            position="bottom"
            rootComponent={Root}
            itemComponent={Item}
            labelComponent={Label}
          />
          <Title
            text="Energy Consumption in 2004\n(Millions of Tons, Oil Equivalent)"
            textComponent={Text}
          />
          <Animation />
        </Chart>
      </Paper>
    );
  }
}

export default withStyles(demoStyles, {name: 'Demo'})(Graph);
