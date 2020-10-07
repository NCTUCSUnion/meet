import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    TextField,
    Typography,
    withStyles
} from '@material-ui/core'
import React from 'react'
import axios from 'axios'
import DeleteIcon from '@material-ui/icons/Delete'
import { withSnackbar } from 'notistack'
import { API_URL } from '../../constant'

axios.defaults.withCredentials = true

const styles = (theme) => ({
    row: {
        width: 'fit-content',
        display: 'flex',
        flex: "1 0 1",
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        margin: "5px 0px",
        padding: "8px 12px",
        borderWidth: "1px",
        borderStyle: "solid !important",
        borderRadius: ".8rem",
        borderColor: "#DDDDDD"
    },
    hr: {
        margin: theme.isMobile ? "0px 4px" : "0px 10px"
    },
    btn: {
        padding: theme.isMobile ? "4px 8px" : "6px 16px",
        fontSize: theme.isMobile ? "0.8125rem" : "1rem"
    },
    btnAdd: {
        padding: theme.isMobile ? "4px 8px" : "6px 16px",
        fontSize: theme.isMobile ? "0.8125rem" : "1rem",
        backgroundColor: "#43A047",
        color: "white",
        "&:hover": {
            backgroundColor: "#218838",
        }
    },
    addGroup: {
        margin: "12px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    groups: {
        marginRight: "20px",
    },
    title: {
        display: 'flex',
        flexFlow: 'row wrap',
        alignItems: 'center',
        justifyContent: 'space-around',
        fontSize: theme.isMobile ? "0.8125rem" : "1.25rem"
    }
})

class TeamCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dialogAdd: false,
            score: 0,
            dialogEdit: false,
            dialogDel: false,
            groups: props.groups,
            groupsBak: undefined
        }
    }

    render() {
        const { classes, tid, score } = this.props
        return (
            <div className={classes.row}>
                <Typography className={classes.title} variant="h6">#{tid}</Typography>
                <Divider className={classes.hr} orientation="vertical" flexItem />
                <Typography className={classes.title} variant="h6">
                    <div>{score}</div>
                    <div>分</div>
                </Typography>
                <Divider className={classes.hr} orientation="vertical" flexItem />
                <Typography className={classes.title} variant="h6">
                    <div>{this.state.groups.length}</div>
                    <div>組</div>
                </Typography>
                <Divider className={classes.hr} orientation="vertical" flexItem />
                <Button className={classes.btnAdd} variant="contained" disableElevation onClick={() => this.setState({ dialogAdd: true })}>加分</Button>
                <Divider className={classes.hr} orientation="vertical" flexItem />
                <Button className={classes.btn} color="primary" variant="contained" disableElevation onClick={() => {
                    const groups = this.state.groups.slice().sort()
                    this.setState({ dialogEdit: true, groups: groups })
                }}>編輯</Button>
                <Divider className={classes.hr} orientation="vertical" flexItem />
                <Button className={classes.btn} color="secondary" variant="contained" disableElevation onClick={() => this.setState({ dialogDel: true })}>刪除</Button>

                <Dialog
                    open={this.state.dialogAdd}
                    onClose={() => this.handleAddClose()}>
                    <DialogTitle>隊伍加分</DialogTitle>
                    <DialogContent>
                        <TextField autoComplete="off" margin="dense" label="分數" type="number"
                            fullWidth value={this.state.score.toString()} required
                            onChange={evt => {
                                this.setState({
                                    score: parseInt(evt.target.value) ? parseInt(evt.target.value) : 0
                                })
                            }}
                            onKeyPress={evt => {
                                if (evt.key === 'Enter')
                                    this.handleAddPost()
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.handleAddClose()} color="secondary">
                            取消
                        </Button>
                        <Button onClick={() => this.handleAddPost()} color="primary">
                            確認
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={this.state.dialogDel}
                    onClose={() => this.handleDelClose()}>
                    <DialogTitle>刪除隊伍</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            確認後，將無法再回朔資料！
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.handleDelClose()} color="secondary">
                            取消
                        </Button>
                        <Button onClick={() => this.handleDelPost()} color="primary">
                            確認
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={this.state.dialogEdit}
                    onClose={() => this.handleEditClose()}>
                    <DialogTitle>編輯隊伍</DialogTitle>
                    <DialogContent>
                        {
                            this.state.groups.map((item, idx) =>
                                <div className={classes.row} key={idx}>
                                    <Button size="small" color="secondary" variant="contained" disableElevation
                                        onClick={() => {
                                            if (!this.state.groupsBak) {
                                                this.setState({ groupsBak: this.state.groups.slice() })
                                            }
                                            const groups = this.state.groups.filter(_item => _item !== item)
                                            this.setState({
                                                groups: groups
                                            })
                                        }}
                                    >
                                        <DeleteIcon />
                                    </Button>
                                    <Divider className={classes.hr} orientation="vertical" flexItem />
                                    <TextField autoComplete="off" margin="dense" type="number"
                                        value={item.toString()}
                                        onChange={evt => {
                                            if (!this.state.groupsBak) {
                                                this.setState({ groupsBak: this.state.groups.slice() })
                                            }
                                            const groups = this.state.groups.slice()
                                            groups[idx] = parseInt(evt.target.value) ? parseInt(evt.target.value) : 0
                                            this.setState({
                                                groups: groups
                                            })
                                        }}
                                    />
                                </div>
                            )
                        }
                        <div className={classes.addGroup}>
                            <Typography variant="h6" className={classes.groups}>共 {this.state.groups.length} 組</Typography>
                            <Button className={classes.btnAdd} variant="contained" disableElevation
                                onClick={() => {
                                    if (!this.state.groupsBak) {
                                        this.setState({ groupsBak: this.state.groups.slice() })
                                    }
                                    const groups = this.state.groups.slice()
                                    groups.push(0)
                                    this.setState({
                                        groups: groups
                                    })
                                }}
                                disabled={this.state.groups.length >= 30}
                            >新增</Button>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.handleEditClose()} color="secondary">
                            取消
                        </Button>
                        <Button onClick={() => this.handleEditPost()} color="primary">
                            確認
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

    handleAddClose() {
        this.setState({
            dialogAdd: false,
            score: 0
        })
    }

    handleAddPost() {
        if (this.state.score !== 0) {
            axios.post(`${API_URL}/team_score`, {
                tid: this.props.tid,
                score: parseInt(this.state.score),
                groups: this.state.groups
            }).then(res => res.data).then(
                json => {
                    if (json.success) {
                        this.props.enqueueSnackbar("加分成功", {
                            variant: 'success',
                        })
                        this.handleAddClose()
                        this.props.reload()
                    }
                    else {
                        this.props.enqueueSnackbar(json.error ? json.error : "加分失敗", {
                            variant: 'error',
                        })
                    }
                }
            ).catch(
                err => this.props.enqueueSnackbar(err.toString(), {
                    variant: 'error',
                })
            )
        }
    }

    handleDelClose() {
        this.setState({
            dialogDel: false
        })
    }

    handleDelPost() {
        axios.post(`${API_URL}/team_delete`, {
            tid: this.props.tid
        }).then(res => res.data).then(
            json => {
                if (json.success) {
                    this.props.enqueueSnackbar("刪除成功", {
                        variant: 'success',
                    })
                    this.handleDelClose()
                    this.props.reload()
                }
                else {
                    this.props.enqueueSnackbar(json.error ? json.error : "刪除失敗", {
                        variant: 'error',
                    })
                }
            }
        ).catch(
            err => this.props.enqueueSnackbar(err.toString(), {
                variant: 'error',
            })
        )
    }

    handleEditClose() {
        if (this.state.groupsBak) {
            this.setState({
                groups: this.state.groupsBak.slice(),
                groupsBak: undefined
            })
        }
        this.setState({
            dialogEdit: false
        })
    }

    handleEditPost() {
        axios.post(`${API_URL}/team_update`, {
            tid: this.props.tid,
            groups: JSON.stringify(this.state.groups.filter((item, pos) => this.state.groups.indexOf(item) === pos && item > 0).sort())
        }).then(res => res.data).then(
            json => {
                if (json.success) {
                    this.props.enqueueSnackbar("更新成功", {
                        variant: 'success',
                    })
                    this.setState({
                        groups: this.state.groups.filter((item, pos) => this.state.groups.indexOf(item) === pos && item > 0).sort(),
                        groupsBak: undefined
                    })
                    this.handleEditClose()
                    this.props.reload()
                }
                else {
                    this.props.enqueueSnackbar(json.error ? json.error : "更新失敗", {
                        variant: 'error',
                    })
                }
            }
        ).catch(
            err => this.props.enqueueSnackbar(err.toString(), {
                variant: 'error',
            })
        )
    }
}

export default withSnackbar(withStyles(styles)(TeamCard))