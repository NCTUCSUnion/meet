import {
    AppBar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Link,
    TextField,
    Toolbar
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { withSnackbar } from 'notistack';
import React from 'react';
import { connect } from 'react-redux';
import { API_URL } from '../../constant';
import { checkIsAvailable, logout } from '../../Redux/Actions';

axios.defaults.withCredentials = true

const styles = (theme) => ({
    root: {
        flexGrow: 1,
        background: '#505050 !important'
    },
    title: {
        marginRight: theme.spacing(2),
        textAlign: "center",
        fontWeight: "bold",
    },
    menuItem: {
        marginRight: theme.spacing(1),
        color: "white",
        padding: "0px",
        "&:hover": {
            textDecoration: "none"
        },
    },
    space: {
        display: "flex",
        flex: "1 1 0"
    },
    linebreak: {
        display: "inline-block"
    },
    linkBtn: {
        cursor: "pointer",
    }
})

class Navbar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dialog: false,
            dialogGID: 0,
            dialogPts: 0
        }
    }

    componentDidMount() {
        this.props.act_check()
    }

    handlePost() {
        if (this.state.dialogGID && this.state.dialogPts) {
            axios.post(`${API_URL}/group_update`, {
                gid: parseInt(this.state.dialogGID.trim()),
                add: parseInt(this.state.dialogPts.trim())
            }).then(res => res.data).then(
                json => {
                    if (json.success) {
                        this.props.enqueueSnackbar("加分成功", {
                            variant: 'success',
                        })
                        this.handleClose()
                        if (window.location.pathname === '/group')
                            window.location.reload()
                    }
                    else {
                        this.props.enqueueSnackbar(json.error ? json.error : "加分失敗", {
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

    handleClose() {
        this.setState({
            dialog: false,
            dialogGID: 0,
            dialogPts: 0
        })
    }

    handleGIDChange(evt) {
        this.setState({
            dialogGID: parseInt(evt.target.value).toString()
        })
    }

    handlePtsChange(evt) {
        this.setState({
            dialogPts: parseInt(evt.target.value).toString()
        })
    }

    handleKeyPress(evt) {
        if (evt.key === 'Enter' && this.state.dialogGID && this.state.dialogPts)
            this.handlePost()
    }

    render() {
        const { classes, isSuper } = this.props
        return (
            <AppBar position="sticky" className={classes.root}>
                <Toolbar>
                    <Link href="/" variant="h6" className={[classes.title, classes.menuItem].join(' ')}>
                        <div className={classes.linebreak}>
                            <div className={classes.linebreak}>交大</div>
                            <div className={classes.linebreak}>資工</div>
                        </div>
                        <div className={classes.linebreak}>相見歡</div>
                    </Link>
                    {
                        isSuper &&
                        <Link href="/group" variant="subtitle2" className={classes.menuItem}>
                            <div className={classes.linebreak}>組別</div>
                            <div className={classes.linebreak}>管理</div>
                        </Link>
                    }
                    {
                        isSuper &&
                        <Link href="/poll" variant="subtitle2" className={classes.menuItem}>
                            <div className={classes.linebreak}>投票</div>
                            <div className={classes.linebreak}>管理</div>
                        </Link>
                    }
                    {
                        isSuper &&
                        <Link variant="subtitle2" className={[classes.menuItem, classes.linkBtn].join(' ')} onClick={evt => this.setState({ dialog: true })}>
                            <div className={classes.linebreak}>個別</div>
                            <div className={classes.linebreak}>加分</div>
                        </Link>
                    }
                    {
                        isSuper &&
                        <div className={classes.space}></div>
                    }
                    {
                        isSuper &&
                        <Button color="inherit" onClick={this.props.act_logout}>登出</Button>
                    }
                </Toolbar>
                <Dialog
                    open={this.state.dialog}
                    onClose={() => this.handleClose()}>
                    <DialogTitle>個別加分</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="group"
                            label="組別"
                            type="number"
                            fullWidth
                            value={this.state.dialogGID}
                            required
                            onChange={evt => this.handleGIDChange(evt)}
                            onKeyPress={evt => this.handleKeyPress(evt)}
                        />
                        <TextField
                            margin="dense"
                            id="point"
                            label="分數"
                            type="number"
                            fullWidth
                            value={this.state.dialogPts}
                            required
                            onChange={evt => this.handlePtsChange(evt)}
                            onKeyPress={evt => this.handleKeyPress(evt)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.handleClose()} color="secondary">
                            取消
                        </Button>
                        <Button onClick={() => this.handlePost()} color="primary">
                            確認
                        </Button>
                    </DialogActions>
                </Dialog>
            </AppBar>
        )
    }
}

const mapStateToProps = (state) => ({
    ...state
})

const mapDispatchToProps = (dispatch) => ({
    act_check: () => {
        dispatch(checkIsAvailable())
    },
    act_logout: () => {
        dispatch(logout())
    },
})

export default withSnackbar(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Navbar)))