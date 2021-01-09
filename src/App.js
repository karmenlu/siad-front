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
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {withStyles} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";

const API_URL = process.env.REACT_APP_SIAD_API_URL;
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
})((props) => <Checkbox color="default" {...props} icon={<FavoriteBorderIcon/>} checkedIcon={<FavoriteIcon/>}
                        name="checkedH"/>);
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
const MAILJET = require ('node-mailjet')
    .connect(process.env.REACT_APP_MJ_APIKEY_PUBLIC, process.env.REACT_APP_MJ_APIKEY_PRIVATE);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            morning: false,
            afternoon: false,
            evening: false,
            overnight: false,
            selectedIdeas: [],
            ideas: [],
            yourName: "",
            yourEmail: "",
            recipientName: "",
            recipientEmail: "",
            costSlideValue: [1, 4]
        }
        this.fetchAllIdeas = this.fetchAllIdeas.bind(this)
        this.processIdea = this.processIdea.bind(this)
        this.submitEmailForm = this.submitEmailForm.bind(this)
    }

    componentDidMount() {
        this.fetchAllIdeas()
    }

    componentWillUnmount() {

    }

    fetchAllIdeas() {
        console.log('Fetching all ideas.')
        fetch(API_URL + '/ideas',
            {
                method: 'get',
                headers: {'Content-Type': 'application/json', 'ApiKey': process.env.REACT_APP_SIAD_API_KEY}
            })
            .then(response => response.json())
            .then((ideas) => {
                    this.setState({
                        isLoaded: true,
                        ideas: ideas.map((idea) => this.processIdea(idea))
                    });
                },
                (error) => {
                    this.setState({isLoaded: true, error});
                }
            )
    }

    processIdea(idea) {
        return ({
            ...idea, dayparts:
                [idea.morning ? 'Morning' : '', idea.afternoon ? 'Afternoon' : '', idea.evening ? 'Evening' : '', idea.overnight ? 'Overnight' : '']
                    .filter(daypartName => daypartName)
        })
    }

    applyFilters(e) {
        const {costSlideValue, morning, afternoon, evening, overnight} = this.state
        const filterParameters = [costSlideValue[0], costSlideValue[1], morning, afternoon, evening, overnight].join('/')
        fetch(API_URL + '/costdayparts/' + filterParameters,
            {
                method: 'get',
                headers: {'Content-Type': 'application/json', 'ApiKey': process.env.REACT_APP_SIAD_API_KEY}
            })
            .then(response => response.json())
            .then((ideas) => {
                    this.setState({
                        isLoaded: true,
                        ideas: ideas.map((idea) => this.processIdea(idea))
                    });
                },
                (error) => {
                    this.setState({isLoaded: true, error});
                }
            )
    }

    resetFilters(e) {
        this.setState({
            morning: false,
            afternoon: false,
            evening: false,
            overnight: false,
            costSlideValue: [1, 4]
        })
        this.fetchAllIdeas()
    }
    
    clearEmailForm() {
        this.setState({
            yourName: "",
            yourEmail: "",
            recipientName: "",
            recipientEmail: ""
        })
    }
    
    submitEmailForm() {
    }
    
    handleDayPartChange = (event) => {
        this.setState({[event.target.name]: event.target.checked})
    };

    handleIdeaSelectionChange = (event, idea) => {
        event.preventDefault()
        let oldSelected = this.state.selectedIdeas
        if (!oldSelected.includes(idea.ideaid)) {
            oldSelected.push(idea.ideaid)
            this.setState({selectedIdeas: oldSelected})
        } else {
            this.setState({selectedIdeas: oldSelected.filter(selectedIdeaId => selectedIdeaId !== idea.ideaid)})
        }
    }

    handleIdeaRemoval = (event, ideaid) => {
        event.preventDefault()
        this.setState({selectedIdeas: this.state.selectedIdeas.filter(selectedIdeaId => selectedIdeaId !== ideaid)})
    }

    handleEmptyCart = (event) => {
        event.preventDefault()
        this.setState({selectedIdeas: []})
    }

    handleTextFieldChange = (event) => {
        this.setState({[event.target.name]: event.target.value})
    };

    renderFilter() {
        return (
            <div className="filter rounded blackOutline component">
                <h3>Filter By:</h3>
                <div>
                    {this.renderDayPartCheckboxes()}
                    {this.renderCostSlider()}
                </div>
                <div className="componentActionButtons">
                    <button onClick={e => this.resetFilters(e)}>reset all filters</button>
                    <button onClick={e => this.applyFilters(e)}>apply filters</button>
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
                    onChange={(e, val) => this.setState({costSlideValue: val})}
                    value={this.state.costSlideValue}
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
    
    renderDayPartCheckboxes() {
        return (
            <div className="dayPartCheckboxes">
                <Typography>
                    Choose desired part(s) of day.
                </Typography>
                <FormControl component="fieldset" className="">
                    <FormGroup>
                        <FormControlLabel
                            control={<BlackCheckbox checked={this.state.morning} onChange={this.handleDayPartChange}
                                                    name="morning"/>}
                            label="Morning"
                        />
                        <FormControlLabel
                            control={<BlackCheckbox checked={this.state.afternoon} onChange={this.handleDayPartChange}
                                                    name="afternoon"/>}
                            label="Afternoon"
                        />
                        <FormControlLabel
                            control={<BlackCheckbox checked={this.state.evening} onChange={this.handleDayPartChange}
                                                    name="evening"/>}
                            label="Evening"
                        />
                        <FormControlLabel
                            control={<BlackCheckbox checked={this.state.overnight} onChange={this.handleDayPartChange}
                                                    name="overnight"/>}
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
                    {this.state.ideas.map((anIdea) => {
                        return (
                            <div className="ideaCard" key={anIdea.ideaid}>
                                <FormControlLabel className="favoriteCheckbox" control={<RedHeartCheckbox/>}
                                                  checked={this.state.selectedIdeas.includes(anIdea.ideaid)}
                                                  onClick={(event) => this.handleIdeaSelectionChange(event, anIdea)}/>
                                <div className="ideaHeader">
                                    {anIdea.name}
                                </div>
                                <div className="ideaBody">
                                    optimal for: {anIdea.dayparts.join(', ')}<br/>
                                    cost: {anIdea.cost > 0 ? "$".repeat(anIdea.cost) : ""}<br/>
                                    ldr alternative: {anIdea.ldr_alt}
                                </div>
                            </div>
                        );
                    })}
                </FormGroup>
            </div>
        )
    }

    renderCart() {
        const itemsInCart = this.state.ideas.filter((i) => this.state.selectedIdeas.includes(i.ideaid))
        return (
            <div className="cart rounded blackOutline component">
                <h3>Your Cart</h3>
                <ul>
                    {itemsInCart.map((cartItem) => {
                        return (
                            <li key={cartItem.ideaid}>
                                <div className="cartItem">
                                    <span className="cartIdea">{cartItem.name}</span>
                                    <button className="cartRemove"
                                            onClick={(event) => this.handleIdeaRemoval(event, cartItem.ideaid)}>remove
                                    </button>
                                </div>
                            </li>
                        )
                    })}
                </ul>
                <div className="componentActionButtons">
                    {!this.state.selectedIdeas.length ? null :
                        <button onClick={(event) => this.handleEmptyCart(event)}><RemoveShoppingCartIcon/></button>}
                    <button><EventIcon/></button>
                    <button><MailIcon/></button>
                </div>
            </div>
        )
    }

    renderEmailCreator() {
        const itemsInCart = this.state.ideas.filter((i) => this.state.selectedIdeas.includes(i.ideaid))
        return (
            <div className="emailCreator rounded blackOutline component">
                <h3>Email Away.</h3>
                <div className="emailForm">
                    <TextField label="Your Name" name="yourName" value={this.state.yourName} onChange={this.handleTextFieldChange} required helperText="required field"/>
                    <TextField label="Your Email" name="yourEmail" value={this.state.yourEmail} onChange={this.handleTextFieldChange} required helperText="required field"/>
                    <TextField label="Recipient Name" name="recipientName" value={this.state.recipientName} onChange={this.handleTextFieldChange} required helperText="required field"/>
                    <TextField label="Recipient Email" name="recipientEmail" value={this.state.recipientEmail} onChange={this.handleTextFieldChange} required helperText="required field"/>
                </div>
                <h3>Generated message:</h3>
                <div id="emailMessage" className="preview">
                    Hello {this.state.recipientName.length === 0 ? "Recipient" : this.state.recipientName},<br/><br/>
                    So it’s a date! {this.state.yourName.length === 0 ? "Sender" : this.state.yourName} invites you to do the following:<br/><br/>
                    {itemsInCart.length == 0 ? <div>Nothing.</div> :
                        itemsInCart.map((cartItem) => {
                            return (
                                <ul>
                                    <li key={cartItem.ideaid}>
                                        <div className="cartItemInEmail">{cartItem.name}</div>
                                    </li>
                                </ul>
                            )
                        })}
                    <br/>Send a follow up email to:<br/>
                    {this.state.yourEmail}<br/><br/>
                    Have fun & stay safe,<br/>
                    So It’s A Date Dev Team
                </div>
                <div className="componentActionButtons">
                    <button onClick={this.clearEmailForm}>Clear Form</button>
                    <button onClick={this.submitEmailForm}>Send it!</button>
                </div>
            </div>
        )
    }

    // renderEventCreator() {
    //     return (
    //         <div className="eventCreator rounded blackOutline component">
    //             <h3>Make it an event.</h3>
    //             <div>Your name: {this.state.yourName}</div>
    //             <div>Your email: {this.state.yourEmail}</div>
    //             <div>Recipient name: {this.state.recipientName}</div>
    //             <div>Recipient email: {this.state.recipientEmail}</div>
    //             <h3>Event Details:</h3>
    //             <div className="preview">
    //                 Details:<br/>
    //                 So it’s a date! Drew Berry invites you to do the following:<br/>
    //                 Scuba Dive.<br/>
    //                 Make pet rocks.<br/>
    //                 Build a sand fortress.<br/><br/>
    //                 Attendees: You and Drew Berry<br/><br/>
    //                 Contact Drew:<br/>
    //                 db@mail.com<br/><br/>
    //                 Have fun, stay safe,<br/>
    //                 Developers at So It’s A Date
    //             </div>
    //             <div className="componentActionButtons">
    //                 <button>Mark that calendar!</button>
    //             </div>
    //         </div>
    //     )
    // }
    //
    // renderFAQs() {
    //     return (
    //         <div className="faqs rounded blackOutline component">
    //             <h3>FAQs</h3>
    //         </div>
    //     )
    // }

    render() {
        console.log("rendering")
        const {error, isLoaded} = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <React.Fragment>
                    {console.log(this.state)}
                    <div id="header">
                        <h1 id="headline">So It's A Date</h1>
                        <div id="headerTools">
                        </div>
                    </div>
                    <div id="main">
                        {this.renderCart()}
                        {this.renderFilter()}
                        {this.renderIdeas()}
                        {this.renderEmailCreator()}
                        {/*{this.renderEventCreator()}*/}
                        {/*{this.renderFAQs()}*/}
                    </div>
                    <BottomNavigation
                        className="stickToBottom"
                        showLabels>
                        <BottomNavigationAction label="Date Cart" value="dateCart" icon={<CartIcon/>}/>
                        {/*<BottomNavigationAction label="FAQs" value="faqs" icon={<HelpIcon/>}/>*/}
                    </BottomNavigation>
                </React.Fragment>
            );
        }
    }

}

export default App;
