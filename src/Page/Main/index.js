import React from 'react'
import {
    Container,
    Fab,
    withStyles,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button, TextField, FormControl, InputLabel, Select, MenuItem
} from "@material-ui/core"
import CheckIcon from '@material-ui/icons/Check'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import RefreshIcon from '@material-ui/icons/Refresh'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { checkIsAvailable, logout } from '../../Redux/Actions'
import axios from 'axios'
import { withSnackbar } from 'notistack'
import { API_URL } from '../../constant'

axios.defaults.withCredentials = true

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
        width: '70%',
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
        justifyContent: 'center',
        marginBottom: '12px'
    },
    groupNumber: {
        fontSize: '72px',
        fontWeight: 'bolder'
    },
    groupID: {
        marginLeft: "14px"
    },
    score: {
        fontSize: '36px',
        fontWeight: 'bolder',
        marginLeft: "14px"
    },
    refresh: {
        position: 'fixed',
        bottom: theme.spacing(20),
        right: theme.spacing(2),
        backgroundColor: "#43A047",
        color: "white",
        "&:hover": {
            backgroundColor: "#218838",
        }
    },
    poll: {
        position: 'fixed',
        bottom: theme.spacing(11),
        right: theme.spacing(2),
    },
    logout: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    subtitle: {
        fontSize: "14px"
    },
    formControl: {
        width: "100%"
    }
})

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dialogPoll: false,
            dialogLogout: false,
            pollState: 'NONE',
            answer: 0
        }
    }

    handlePollClose() {
        this.setState({
            dialogPoll: false
        })
    }

    handlePollPost() {
        if (this.state.state === "NONE"){
            this.handlePollClose()
        }
        else {
            axios.post(`${API_URL}/event_poll`, {
                gid: this.props.group.gid,
                poll: this.state.answer
            }).then(res => res.data).then(
                json => {
                    if (json.success) {
                        this.handlePollClose()
                        this.props.enqueueSnackbar("成功", {
                            variant: 'success',
                        })
                    }
                    else {
                        this.props.enqueueSnackbar("失敗", {
                            variant: 'error',
                        })
                    }
                }
            ).catch(
                err => {
                    this.props.enqueueSnackbar(err.toString(), {
                        variant: 'error',
                    })
                }
            )
        }
    }

    handleLogoutClose() {
        this.setState({
            dialogLogout: false
        })
    }

    handleLogoutPost() {
        this.handleLogoutClose()
        this.props.act_logout()
    }

    openPoll() {
        axios.get(`${API_URL}/event_cont`).then(res => res.data).then(
            json => {
                if (json.success) {
                    this.setState({
                        dialogPoll: true,
                        state: json.state,
                        choices: json.choices
                    })
                }
            }
        )
    }

    handleTextChange(evt) {
        const ans = evt.target.value ? parseInt(evt.target.value) : 0
        this.setState({
            answer: ans
        })
    }

    handleSelectChange(evt) {
        this.setState({
            answer: evt.target.value
        })
    }

    render() {
        const { classes, login, isSuper, group, act_check } = this.props
        return (
            <Container>
                {
                    (!login || isSuper) &&
                    <Redirect to="/"></Redirect>
                }
                {
                    group &&
                    <div className={classes.root}>
                        <div className={classes.content}>
                            <div className={classes.column}>
                                <div className={classes.container}>
                                    <div className={classes.column}>
                                        <div className={classes.groupTitle}>組別</div>
                                        <div className={classes.groupNumber}>{group.gid}</div>
                                        <div className={classes.row}>
                                            <div>大直屬</div>
                                            <div className={classes.groupID}>{group.id1}</div>
                                        </div>
                                        <div className={classes.row}>
                                            <div>小直屬</div>
                                            <div className={classes.groupID}>{group.id2}</div>
                                        </div>
                                        <div className={classes.row}>
                                            <div>分數</div>
                                            <div className={classes.score}>{group.pts}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                <Fab color="primary" aria-label="poll" className={classes.poll} onClick={() => this.openPoll()}>
                    <CheckIcon />
                </Fab>
                <Fab color="secondary" aria-label="logout" className={classes.logout} onClick={() => { this.setState({ dialogLogout: true }) }}>
                    <ExitToAppIcon />
                </Fab>
                <Fab aria-label="refresh" className={classes.refresh} onClick={act_check}>
                    <RefreshIcon />
                </Fab>
                <Dialog
                    open={this.state.dialogPoll}
                    onClose={() => this.handlePollClose()}>
                    <DialogTitle>回答問題
                        <DialogContentText className={classes.subtitle}>
                            答對可以獲得分數！
                        </DialogContentText>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {
                                this.state.state === "NONE" ? "目前沒有進行中的答題活動" :
                                    this.state.choices === 0 ?
                                        this.state.state === "CLOSE" ? "回答一個數值(已關閉)" : "回答一個數值" :
                                        this.state.state === "CLOSE" ? "選擇一個選項(已關閉)" : "選擇一個選項"
                            }
                        </DialogContentText>
                        {
                            this.state.choices === 0 &&
                            <TextField autoComplete="off" type="number" label="答案" disabled={this.state.state === "CLOSE"} value={this.state.answer.toString()} onChange={evt => this.handleTextChange(evt)} />
                        }
                        {
                            this.state.choices > 0 &&
                            <FormControl className={classes.formControl} disabled={this.state.state === "CLOSE"}>
                                <InputLabel>選項</InputLabel>
                                <Select
                                    value={this.state.answer}
                                    onChange={evt => this.handleSelectChange(evt)}
                                >
                                    {
                                        Array(this.state.choices).fill(0).map((item, idx, arr) => (
                                            <MenuItem key={idx} value={idx + 1}>{idx + 1}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        }
                    </DialogContent>
                    <DialogActions>
                        {
                            this.state.state === "OPEN" &&
                            <Button onClick={() => this.handlePollClose()} color="secondary">
                                取消
                            </Button>
                        }
                        <Button onClick={() => {
                            if (this.state.state === "OPEN")
                                this.handlePollPost()
                            else 
                                this.handlePollClose()
                        }} color="primary">
                            確認
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={this.state.dialogLogout}
                    onClose={() => this.handleLogoutClose()}>
                    <DialogTitle>登出</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            確定要登出嗎？
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.handleLogoutClose()} color="secondary">
                            取消
                        </Button>
                        <Button onClick={() => this.handleLogoutPost()} color="primary">
                            確認
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        )
    }
}

const mapStateToProps = (state) => ({
    ...state
})

const mapDispatchToProps = (dispatch) => ({
    act_check: ()=>{
        dispatch(checkIsAvailable())
    },
    act_logout: () => {
        dispatch(logout())
    }
})

export default withSnackbar(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Main)))