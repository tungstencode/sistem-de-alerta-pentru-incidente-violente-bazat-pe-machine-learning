// import React, {useCallback, useState} from 'react';
// import Button from '@material-ui/core/Button';
// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import {
//   GoogleMap,
//   OverlayView,
//   Marker,
//   LoadScript,
//   useLoadScript,
// } from '@react-google-maps/api';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
// import PropTypes from 'prop-types';
// import DialogTitle from '@material-ui/core/DialogTitle';
// import Slide from '@material-ui/core/Slide';

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

// // const options = {
// //   zoomControlOptions: {
// //     position: google.maps.ControlPosition.RIGHT_CENTER, // ,
// //     // ...otherOptions
// //   },
// // };

// export default function MapDialog(props) {
//   const {open, onClose, camera} = props;
//   return (
//     <div>
//       <Dialog
//         open={open}
//         TransitionComponent={Transition}
//         keepMounted
//         onClose={onClose}
//         aria-labelledby="alert-dialog-slide-title"
//         aria-describedby="alert-dialog-slide-description">
//         <DialogTitle id="alert-dialog-slide-title">Confirm</DialogTitle>
//         <DialogContent>
//           <div>
//             <iframe
//               width="100%"
//               height="600"
//               src={`https://maps.google.com/maps?width=100%&amp;height=600&amp;hl=en&amp;coord=${camera.location}&amp;q=1%20Grafton%20Street%2C%20Dublin%2C%20Ireland+(My%20Business%20Name)&amp;ie=UTF8&amp;t=&amp;z=14&amp;iwloc=B&amp;output=embed`}
//               marginWidth="0">
//               <a href="https://www.maps.ie/coordinates.html">
//                 find my location
//               </a>
//             </iframe>
//           </div>
//           <br />
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// MapDialog.propTypes = {
//   open: PropTypes.bool,
//   onClose: PropTypes.func,
//   // eslint-disable-next-line react/forbid-prop-types
//   camera: PropTypes.object,
// };

// MapDialog.defaultProps = {
//   open: false,
//   onClose: () => {},
//   camera: null,
// };
