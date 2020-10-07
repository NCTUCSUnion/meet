import {
    AppBar,
    Button,
    CardMedia,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Link,
    Toolbar
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import React from 'react'
import { connect } from 'react-redux'
import { checkIsAvailable, logout } from '../../Redux/Actions'


const styles = (theme) => ({
    root: {
        flexGrow: 1,
        background: '#505050 !important'
    },
    toolbar: {
        padding: theme.isMobile ? "0px 8px" : "0px 16px"
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
    },
    btn_logout: {
        padding: theme.isMobile ? "6px 0px" : "6px 8px"
    },
    menu: {
        display: 'flex',
        alignItems: 'center',
        flexGrow: '1'
    }
})

class Navbar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dialogShare: false
        }
    }

    componentDidMount() {
        this.props.act_check()
    }

    render() {
        const { classes, isSuper } = this.props
        return (
            <AppBar position="sticky" className={classes.root}>
                <Toolbar className={classes.toolbar}>
                    <Link href="/" variant="h6" className={[classes.title, classes.menuItem].join(' ')}>
                        <div className={classes.linebreak}>
                            <div className={classes.linebreak}>交大</div>
                            <div className={classes.linebreak}>資工</div>
                        </div>
                        <div className={classes.linebreak}>相見歡</div>
                    </Link>
                    {
                        isSuper &&
                        <div className={classes.menu}>
                            <Link href="/group" variant="subtitle2" className={classes.menuItem}>
                                <div className={classes.linebreak}>組別</div>
                                <div className={classes.linebreak}>管理</div>
                            </Link>
                            <Link href="/poll" variant="subtitle2" className={classes.menuItem}>
                                <div className={classes.linebreak}>投票</div>
                                <div className={classes.linebreak}>管理</div>
                            </Link>
                            <Link href="/team" variant="subtitle2" className={classes.menuItem}>
                                <div className={classes.linebreak}>隊伍</div>
                                <div className={classes.linebreak}>管理</div>
                            </Link>
                            <Link variant="subtitle2" className={[classes.menuItem, classes.linkBtn].join(' ')} onClick={evt => this.setState({ dialogShare: true })}>
                                <div className={classes.linebreak}>分享</div>
                                <div className={classes.linebreak}>連結</div>
                            </Link>
                            <div className={classes.space}></div>
                            <Button color="inherit" className={classes.btn_logout} onClick={this.props.act_logout}>登出</Button>
                        </div>
                    }
                </Toolbar>
                <Dialog
                    open={this.state.dialogShare}
                    onClose={() => { this.setState({ dialogShare: false }) }}>
                    <DialogTitle>分享連結</DialogTitle>
                    <DialogContent>
                        <CardMedia
                            component="img"
                            alt="Share"
                            image="/qrcode.png"
                            title="share"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { this.setState({ dialogShare: false }) }} color="secondary">
                            完成
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
        dispatch(checkIsAvailable(() => {}))
    },
    act_logout: () => {
        dispatch(logout())
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Navbar))