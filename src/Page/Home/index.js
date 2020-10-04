import React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import {
    Container,
    InputLabel,
    TextField,
    Button, 
    FormHelperText,
} from '@material-ui/core'
import { login } from '../../Redux/Actions'

const styles = (theme) => ({
    root: {
        flexGrow: 1,
        fontSize: '1.1em',
        fontWeight: 300
    },
    content: {
        display: 'flex',
        position: 'relative',
        flexGrow: 1,
        justifyContent: 'center',
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    title: {
        position: 'absolute',
        top: 'calc( 50vh - 2em )',
        left: '1.4em',
        fontSize: '4em',
        fontWeight: '500',
        color: '#666',
        paddingLeft: '0.3em',
        borderLeft: '10px solid #2196f3',
        userSelect: 'none',
    },
    button: {
        display: 'block',
        position: 'absolute',
        top: '52vh',
        right: '23vw',
        fontSize: '1.1em',
        padding: '1% 3%'
    },
    container: {
        margin: '0 auto',
        width: theme.isMobile ? '100%' : 'fit-content',
        backgroundColor: '#f5f5f5',
        boxShadow: '1px 1px 2px #999999',
        padding: '20px',
        borderRadius: '.7rem',
    },
    column: {
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        rowGap: '10px'
    },
    row: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        columnGap: '5px'
    },
    label: {
        minWidth: "70px",
        textAlign: "end"
    },
    textfield: {
        width: '100%'
    },
    btnStart: {
        width: "80%",
        height: "50px",
        fontWeight: 'bold',
        fontSize: '20px',
        backgroundColor: '#3BEE93',
        "&:hover": {
            backgroundColor: '#22BB6E',
        }
    },
    btnLogout: {
        width: "80%",
        height: "50px",
        fontWeight: 'bold',
        fontSize: '20px',
    },
    groupNumber: {
        fontSize: '50px',
        fontWeight: 'bolder'
    }
})

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            gid: '',
            password: ''
        }
    }

    tryLogin() {
        this.props.act_login(this.state.gid, this.state.password)
    }

    handleGIDChange(evt) {
        const password = this.state.password
        this.setState({
            gid: evt.target.value,
            password: password
        })
    }

    handlePasswordChange(evt) {
        const gid = this.state.gid
        this.setState({
            gid: gid,
            password: evt.target.value
        })
    }

    handleKeyPress(evt) {
        if (evt.key === 'Enter') {
            this.tryLogin()
        }
    }

    render() {
        const { classes, login, isSuper } = this.props
        return (
            <Container>
                {
                    !login &&
                    <div className={classes.root}>
                        <div className={classes.content}>
                            <div className={classes.container}>
                                <div className={classes.column}>
                                    <div className={classes.row}>
                                        <InputLabel className={classes.label} htmlFor="gid">組別號碼</InputLabel>
                                        <TextField className={classes.textfield} id="gid" name="group-id" aria-describedby="group-id"
                                            onChange={evt => this.handleGIDChange(evt)}
                                            onKeyPress={evt => this.handleKeyPress(evt)} autoFocus />
                                    </div>
                                    <div className={classes.row}>
                                        <InputLabel className={classes.label} htmlFor="password">密碼</InputLabel>
                                        <div>
                                            <TextField className={classes.textfield} id="password" name="password" aria-describedby="password-hint" type="password"
                                                onChange={evt => this.handlePasswordChange(evt)}
                                                onKeyPress={evt => this.handleKeyPress(evt)} />
                                        </div>
                                    </div>
                                    <div>
                                    <FormHelperText>密碼為大直屬學號後三碼+小直屬後三碼</FormHelperText>
                                    <FormHelperText>ex. 0816499 &amp; 109550599 -&gt; 499599</FormHelperText>
                                    </div>
                                    <Button type="button" variant="outlined" color="primary" onClick={() => this.tryLogin()}>
                                        登入
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {
                    login && !isSuper &&
                    <Redirect to={{
                        pathname: '/main',
                        state: { redirected: true }
                    }} />
                }
                {
                    isSuper &&
                    <Redirect to={{
                        pathname: '/group',
                        state: { redirected: true }
                    }} />
                }
            </Container>
        );
    }
}

const mapStateToProps = (state) => ({
    ...state
})

const mapDispatchToProps = (dispatch) => ({
    act_login: (gid, passwd) => {
        dispatch(login(gid, passwd))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Home))