import './App.css';
import React from 'react';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import CartIcon from '@material-ui/icons/ShoppingCart';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import HelpIcon from '@material-ui/icons/Help';
import MailIcon from '@material-ui/icons/Mail';
import EventIcon from '@material-ui/icons/Event';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {withStyles} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
const BlackCheckbox = withStyles({
    root: {
        color: "black",
        '&$checked': {
            color: "black",
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);
const RedHeartCheckbox = withStyles({
    root: {
        color: "crimson",
        '&$checked': {
            color: "crimson",
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} icon={<FavoriteBorderIcon />} checkedIcon={<FavoriteIcon />} name="checkedH" />);
const CostSlider = withStyles({
    root: {
        color: 'black',
        height: 5
    },
    thumb: {
        height: 15,
        width: 15,
        backgroundColor: 'black',
        border: '1px solid currentColor'
    },
    track: {
        height: 5,
    },
    rail: {
        color: 'white',
        opacity: 1,
        height: 5
    },
    mark: {
        color: "transparent",
    },
})(Slider);
const marks = [
    {
        value: 1,
        label: '$',
    },
    {
        value: 2,
        label: '$$',
    },
    {
        value: 3,
        label: '$$$',
    },
    {
        value: 4,
        label: '$$$$',
    },
];

const DAY_PARTS =
    [{pid: 1, name: "Morning"},
        {pid: 2, name: "Afternoon"},
        {pid: 3, name: "Evening"},
        {pid: 4, name: "Overnight"}];
const FAKE_IDEAS =
    [{
        did: 1,
        name: "Obtain kites and fly them.",
        dayPartIds: [1, 2],
        cost: 2,
        ldr_alternative: "Attend a virtual kite festivals. Get crafty and make kites over video call. Learn about different types of kites or kite history.",
        selected: false
    }];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            morning: false, 
            afternoon: false,
            evening: false,
            overnight: false,
            selectedIdeas: [],
            cartItems: [],
            yourName: "Karmen Lu",
            yourEmail: "kl@example.com",
            recipientName: "Eve Apple",
            recipientEmail: "eve@example.com",
            costSlideValue: null,
        }
    }
    
    renderFilter() {
        return (
            <div className="filter rounded blackOutline component">
                <h3>Filter By:</h3>
                <div>
                    {this.renderDayPartCheckboxes()}
                    {this.renderCostSlider()}
                </div>
                <div className="componentActionButtons">
                    <button>reset all filters</button>
                    <button>apply filters</button>
                </div>
            </div>
        )
    }
    
    renderCostSlider() {
        return (
            <div className="costSlider">
                <Typography id="discrete-slider" gutterBottom>
                    Cost
                </Typography>
                <CostSlider
                    defaultValue={[2,4]}
                    marks={marks}
                    getAriaValueText={(value) => `${value} dollar signs`}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="off"
                    step={1}
                    min={1}
                    max={4}
                />
            </div>
        )
    }
    handleDayPartChange = (event) => {
        this.setState({[event.target.name]: event.target.checked})
    };
    
    renderDayPartCheckboxes() {
        return (
            <div className="dayPartCheckboxes">
                <Typography>
                    Choose desired part(s) of day.
                </Typography>
                <FormControl component="fieldset" className="">
                    <FormGroup>
                        <FormControlLabel
                            control={<BlackCheckbox checked={this.state.morning} onChange={this.handleDayPartChange} name="morning" />}
                            label="Morning"
                        />
                        <FormControlLabel
                            control={<BlackCheckbox checked={this.state.afternoon} onChange={this.handleDayPartChange} name="afternoon" />}
                            label="Afternoon"
                        />
                        <FormControlLabel
                            control={<BlackCheckbox checked={this.state.evening} onChange={this.handleDayPartChange} name="evening" />}
                            label="Evening"
                        />
                        <FormControlLabel
                            control={<BlackCheckbox checked={this.state.overnight} onChange={this.handleDayPartChange} name="overnight" />}
                            label="Overnight"
                        />
                    </FormGroup>
                </FormControl>
            </div>
        );
    }
    renderIdeas() {
        return (
            <div className="ideaList">
                <FormGroup>
                    {FAKE_IDEAS.map((data) => {
                        return (
                            <div className="ideaCard">
                                <FormControlLabel className="favoriteCheckbox" control={<RedHeartCheckbox/>}/>
                                <div className="ideaHeader">
                                    {data.name}
                                </div>
                                <div className="ideaBody">
                                    optimal for: {data.dayPartIds.map((pid) => DAY_PARTS.find(item => item.pid === pid).name + " ")}<br/>
                                    cost: {data.cost > 0 ? "$".repeat(data.cost) : ""}<br/>
                                    ldr alternative: {data.ldr_alternative}
                                </div>
                            </div>
                    );})}
                </FormGroup>
            </div>
        )
    }


    renderFAQs() {
        return (
            <div className="faqs rounded blackOutline component">
                <h3>FAQs</h3>
            </div>
        )
    }


    renderCart() {
        return (
            <div className="cart rounded blackOutline component">
                <h3>Your Cart</h3>
                <ul>
                    <li>
                        <div className="cartItem">
                            <span className="cartIdea">Scuba Dive.</span>
                            <button className="cartRemove">remove</button>
                        </div>
                    </li>
                    <li>
                        <div>
                            <span className="cartIdea">Build a sand fortress.</span>
                            <button className="cartRemove">remove</button>
                        </div>
                    </li>
                    <li>
                        <div>
                            <span className="cartIdea">Make pet rocks.</span>
                            <button className="cartRemove">remove</button>
                        </div>
                    </li>
                </ul>
                <div className="componentActionButtons">
                    <button><EventIcon/></button>
                    <button><MailIcon/></button>
                </div>
            </div>
        )
    }
    
    renderEventCreator() {
        return (
            <div className="eventCreator rounded blackOutline component">
                <h3>Make it an event.</h3>
                <div>Your name: {this.state.yourName}</div>
                <div>Your email: {this.state.yourEmail}</div>
                <div>Recipient name: {this.state.recipientName}</div>
                <div>Recipient email: {this.state.recipientEmail}</div>
                <h3>Event Details:</h3>
                <div className="preview">
                    Details:<br/>
                    So it’s a date! Drew Berry invites you to do the following:<br/>
                    Scuba Dive.<br/>
                    Make pet rocks.<br/>
                    Build a sand fortress.<br/><br/>
                    Attendees: You and Drew Berry<br/><br/>
                    Contact Drew:<br/>
                    db@mail.com<br/><br/>
                    Have fun, stay safe,<br/>
                    Developers at So It’s A Date
                </div>
                <div className="componentActionButtons">
                    <button>Mark that calendar!</button>
                </div>
            </div>
        )
    }

    renderEmailCreator() {
        return (
            <div className="emailCreator rounded blackOutline component">
                <h3>Email Away.</h3>
                <div>Your name: {this.state.yourName}</div>
                <div>Your email: {this.state.yourEmail}</div>
                <div>Recipient name: {this.state.recipientName}</div>
                <div>Recipient email: {this.state.recipientEmail}</div>
                <h3>Generated message:</h3>
                <div className="preview">
                    Hello Jorge Apricotseed,<br/><br/>
                    So it’s a date! Drew Berry invites you to do the following:<br/><br/>
                    Scuba Dive.<br/>
                    Make pet rocks.<br/>
                    Build a sand fortress.<br/><br/>
                    Follow up with a message:<br/>
                    db@mail.com<br/><br/>
                    Have fun, stay safe,<br/>
                    Developers at So It’s A Date
                </div>
                <div className="componentActionButtons">
                    <button>Send it!</button>
                </div>
            </div>
        )
    }

    render() {
        console.log(this.state);
        return (
            <React.Fragment>
                <div id="header">
                    <h1 id="headline">So It's A Date</h1>
                    <div id="headerTools">
                    </div>
                </div>
                <div id="main">
                    {this.renderFilter()}
                    {this.renderFAQs()}
                    {this.renderIdeas()}
                    {this.renderCart()}
                    {this.renderEmailCreator()}
                    {this.renderEventCreator()}
                </div>
                <BottomNavigation
                    className="stickToBottom"
                    showLabels>
                    <BottomNavigationAction label="Date Cart" value="dateCart" icon={<CartIcon/>}/>
                    <BottomNavigationAction label="FAQs" value="faqs" icon={<HelpIcon/>}/>
                </BottomNavigation>
            </React.Fragment>
        );
    }
}

export default App;
