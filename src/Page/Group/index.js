import {
    Button,
    Container,
    Divider,
    Typography,
    withStyles,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@material-ui/core'
import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import GroupCard from '../../Component/GroupCard'
import AddGroupCard from '../../Component/GroupCard/Add'
import SettingCard from '../../Component/GroupCard/Setting'
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
        flexFlow: 'column nowrap',
        position: 'relative',
        flexGrow: 1,
        justifyContent: 'center',
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    cardContainer: {
        width: "fit-content",
        margin: "20px auto",
        padding: "5px 10px",
        backgroundColor: "#F3F3F3",
        display: "flex",
        flexFlow: "row wrap",
        justifyContent: 'center',
        boxShadow: "1px 1px 3px 2px rgba(20%, 20%, 20%, 0.5) inset",
    },
    hr: {
        margin: "12px 0px"
    },
    manualBlock: {
        margin: "6px 0px"
    },
    btn: {
        width: "100%"
    },
    manualSub: {
        color: "#8F8F8F",
        marginLeft: "10px"
    },
})

class Group extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sortByPts: false,
            searchGID: 0,
            dialog: false,
            dialogTargetID: undefined,
            groups: []
        }
    }

    componentDidMount() {
        axios.get(`${API_URL}/groups`).then(
            res => res.data
        ).then(
            json => {
                this.setState({ groups: json.groups })
            }
        )
    }

    handleDialog(id = undefined) {
        if (!this.state.dialog)
            this.setState({
                dialog: true,
                dialogTargetID: id
            })
    }

    handlePost() {
        const targetID = this.state.dialogTargetID
        if (targetID === 0) {
            axios.post(`${API_URL}/group_delall`).then(res => res.data).then(
                json => {
                    if (json.success) {
                        this.props.enqueueSnackbar("刪除成功", {
                            variant: 'success',
                        })
                        this.setState({
                            groups: []
                        })
                    }
                    else {
                        this.props.enqueueSnackbar(json.error ? json.error : "刪除失敗", {
                            variant: 'error',
                        })
                    }
                    this.handleClose()
                }
            ).catch(
                err => this.props.enqueueSnackbar(err.toString(), {
                    variant: 'error',
                })
            )
        }
        else {
            axios.post(`${API_URL}/group_del`, {
                gid: targetID
            }).then(res => res.data).then(
                json => {
                    if (json.success) {
                        this.props.enqueueSnackbar("刪除成功", {
                            variant: 'success',
                        })
                        const groups = this.state.groups.filter(item => item.gid !== targetID)
                        this.setState({
                            groups: groups
                        })
                    }
                    else {
                        this.props.enqueueSnackbar(json.error ? json.error : "刪除失敗", {
                            variant: 'error',
                        })
                    }
                    this.handleClose()
                }
            ).catch(
                err => this.props.enqueueSnackbar(err.toString(), {
                    variant: 'error',
                })
            )
        }
    }

    handleClose() {
        this.setState({
            dialog: false,
            dialogTargetID: undefined
        })
    }

    addCard(gid, id1, id2) {
        const groups = this.state.groups.concat([{ gid: gid, id1: id1, id2: id2, pts: 0 }])
        this.setState({
            groups: groups
        })
    }

    getName(id) {
        const {students} = this.props
        if (students && students[id])
            return students[id]
        return ' '
    }

    render() {
        const { classes, loading, isSuper, students } = this.props
        return (
            <Container>
                {
                    !loading && !isSuper &&
                    <Redirect to="/"></Redirect>
                }
                <div className={classes.root}>
                    <div className={classes.content}>
                        <div className={classes.cardContainer}>
                            <AddGroupCard students={students} addCard={(gid, id1, id2) => this.addCard(gid, id1, id2)} />
                            <SettingCard sortByPts={this.state.sortByPts} onToggle={evt => {
                                const groups = this.state.groups.map(item => ({ ...item }))
                                groups.sort((l, r) => (evt.target.checked ?
                                    (l.pts < r.pts ? 1 : -1) :
                                    (l.gid > r.gid ? 1 : -1)))
                                this.setState({ sortByPts: evt.target.checked, groups: groups })
                            }} search={this.state.searchGID} handler={evt => this.setState({searchGID: parseInt(evt.target.value)})}
                                id1={this.state.searchGID && this.state.groups.some(item => item.gid === this.state.searchGID) ?
                                    this.state.groups.filter(item => item.gid === this.state.searchGID)[0].id1 : ''}
                                id2={this.state.searchGID && this.state.groups.some(item => item.gid === this.state.searchGID) ?
                                    this.state.groups.filter(item => item.gid === this.state.searchGID)[0].id2 : ''} />
                            {
                                this.state.groups.map((item, index, array) =>
                                    <GroupCard key={item.gid.toString()} gid={item.gid.toString()} id1={item.id1.toString()} id2={item.id2.toString()} pts={item.pts.toString()}
                                        name1={this.getName(item.id1.toString())} name2={this.getName(item.id2.toString())} handler={() => this.handleDialog(item.gid)} />
                                )
                            }
                        </div>
                        <Divider className={classes.hr} />
                        <Typography variant="h4">
                            手動操作區域
                        </Typography>
                        <div className={classes.manualBlock}>
                            <Button className={classes.btn} variant="contained" color="secondary" size="large" onClick={() => this.handleDialog(0)}>
                                <Typography variant="h6">刪除所有組別</Typography>
                            </Button>
                            <Typography className={classes.manualSub} variant="subtitle2">將所有組別資訊清除</Typography>
                        </div>
                        <Divider className={classes.hr} />
                    </div>
                </div>
                <Dialog
                    open={this.state.dialog}
                    onClose={() => this.handleClose()}>
                    <DialogTitle>刪除組別 {this.state.dialogTargetID !== 0 ? this.state.dialogTargetID : "(全)"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            確認後，將無法再回朔資料！
                        </DialogContentText>
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

            </Container>
        )
    }
}

const mapStateToProps = (state) => ({
    ...state
})

export default withSnackbar(connect(mapStateToProps)(withStyles(styles)(Group)))