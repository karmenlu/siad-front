// import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import FormLabel from '@material-ui/core/FormLabel';
// import FormControl from '@material-ui/core/FormControl';
// import FormGroup from '@material-ui/core/FormGroup';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormHelperText from '@material-ui/core/FormHelperText';
// import Checkbox from '@material-ui/core/Checkbox';
//
// const useStyles = makeStyles((theme) => ({
//     root: {
//         display: 'flex',
//     },
//     formControl: {
//         margin: theme.spacing(3),
//     },
// }));
//
// export default function CheckboxesGroup() {
//     const classes = useStyles();
//     const [state, setState] = React.useState({
//         morning: true,
//         afternoon: false,
//         evening: false,
//         overnight: false, 
//     });
//
//     const handleChange = (event) => {
//         setState({ ...state, [event.target.name]: event.target.checked });
//         // console.log(state);
//     };
//
//     const { morning, afternoon, evening, overnight} = state;
//
//     return (
//         <div className={classes.root}>
//             <FormControl component="fieldset" className={classes.formControl}>
//                 <FormLabel component="legend">Choose desired part(s) of day.</FormLabel>
//                 <FormGroup>
//                     <FormControlLabel
//                         control={<Checkbox checked={morning} onChange={handleChange} name="morning" />}
//                         label="Morning"
//                     />
//                     <FormControlLabel
//                         control={<Checkbox checked={afternoon} onChange={handleChange} name="afternoon" />}
//                         label="Afternoon"
//                     />
//                     <FormControlLabel
//                         control={<Checkbox checked={evening} onChange={handleChange} name="evening" />}
//                         label="Evening"
//                     />
//                     <FormControlLabel
//                         control={<Checkbox checked={overnight} onChange={handleChange} name="overnight" />}
//                         label="Overnight"
//                     />
//                 </FormGroup>
//             </FormControl>
//         </div>
//     );
// }
