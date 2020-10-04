import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, MenuItem, Select, TextField, Typography, withStyles } from '@material-ui/core'
import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { PieChart } from 'react-minimal-pie-chart'
import ChoiceScore from '../../Component/ChoiceScore'
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
        padding: theme.isMobile ? "20px 0px" : "40px 5%",
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    title: {
        alignSelf: theme.isMobile ? "center" : "flex-start",
    },
    row: {
        width: '100%',
        display: 'flex',
        flex: "0 0 0",
        alignItems: 'center',
        justifyContent: 'center',
        columnGap: '5px',
    },
    hr: {
        margin: "12px 0px",
        width: "100%"
    },
    pie: {
        width: theme.isMobile ? "100%" : "75%",
        height: theme.isMobile ? "100%" : "75%"
    },
    container: {
        display: 'flex',
        position: 'relative',
        flexFlow: "column nowrap",
        flexGrow: 1,
        alignItems: "center",
    },
    rowFlexEnd: {
        display: 'flex',
        alignSelf: 'flex-end'
    }
})

const piecolor = ['#F47378', '#FFB27D', '#FFF766', '#C7E469', '#98E0AD', '#63E3C5', '#46CEEA', '#638BE3', '#AAAEEB', '#BC91DD', '#DAAADB', '#E65DA4']

class PollManage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            evtState: 'NONE',
            result: [],
            score: [],
            eventIsChoice: false,
            eventChoices: 4,
            dialogClose: false,
            dialogArchive: false
        }
    }

    getEventData() {
        axios.post(`${API_URL}/event_info`).then(res => res.data).then(
            json => {
                if (json.success) {
                    this.setState({
                        evtState: json.state,
                        result: json.result ? json.result.slice().sort((l, r) => l.poll > r.poll ? 1 : -1) : [],
                        score: json.result ? Array(json.result.length).fill(0) : []
                    })
                    if (json.state !== 'NONE') {
                        this.setState({
                            eventChoices: json.choices,
                            eventIsChoice: json.choices > 0,
                        })
                    }
                }
                else {
                    this.props.enqueueSnackbar("獲取資料失敗", {
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

    componentDidMount() {
        this.getEventData()
    }

    onEventTypeChange(evt) {
        const isChoice = evt.target.value > 0
        this.setState({
            eventIsChoice: isChoice,
            eventChoices: !isChoice ? 0 : this.state.eventChoices
        })
    }

    onTextChange(evt, index) {
        const score = this.state.score.slice()
        score[index] = evt.target.value ? parseInt(evt.target.value) : 0
        this.setState({
            score: score
        })
    }

    handlePost() {
        switch (this.state.evtState) {
            case 'NONE':
                axios.post(`${API_URL}/event_add`, {
                    choices: this.state.eventIsChoice ? parseInt(this.state.eventChoices) : 0
                }).then(res => res.data).then(json => {
                    if (json.success) {
                        this.props.enqueueSnackbar("新增成功", {
                            variant: 'success',
                        })
                        this.setState({
                            evtState: 'OPEN'
                        })
                    }
                    else {
                        this.props.enqueueSnackbar(json.error ? json.error : "新增失敗", {
                            variant: 'error',
                        })
                    }
                }).catch(err => {
                    this.props.enqueueSnackbar(err.toString(), {
                        variant: 'error',
                    })
                })
                break;
            case 'OPEN':
                this.setState({
                    dialogClose: true
                })
                break;
            case 'CLOSE':
                this.setState({
                    dialogArchive: true
                })
                break;
            default:
                this.getEventData()
                break;
        }
    }

    handleClose_close() {
        this.setState({
            dialogClose: false
        })
    }

    handlePost_close() {
        axios.post(`${API_URL}/event_close`).then(res => res.data).then(
            json => {
                if (json.success) {
                    this.props.enqueueSnackbar("關閉成功", {
                        variant: 'success',
                    })
                    this.setState({
                        evtState: 'CLOSE'
                    })
                    this.handleClose_close()
                    window.location.reload()
                }
                else {
                    this.props.enqueueSnackbar(json.error ? json.error : "關閉失敗", {
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

    handleClose_post() {
        this.setState({
            dialogArchive: false
        })
    }

    handlePost_post() {
        axios.post(`${API_URL}/event_archive`,{
            scores: this.state.result.slice().sort((l, r) => l.poll > r.poll ? 1 : -1).map((item, index) => ({
                poll: item.poll,
                score: this.state.score[index]
            })).filter(item => item.score !== 0)
        }).then(res => res.data).then(
            json => {
                if (json.success) {
                    this.props.enqueueSnackbar("封存成功", {
                        variant: 'success',
                    })
                    this.setState({
                        evtState: 'NONE'
                    })
                    this.handleClose_post()
                }
                else {
                    this.props.enqueueSnackbar(json.error ? json.error : "封存失敗", {
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

    handleChoiceChange(evt) {
        const choices = evt.target.value ? parseInt(evt.target.value) : 0
        this.setState({
            eventChoices: choices
        })
    }

    render() {
        const { classes, loading, isSuper } = this.props
        return (
            <Container>
                {
                    !loading && !isSuper &&
                    <Redirect to="/"></Redirect>
                }
                <div className={classes.root}>
                    <div className={classes.content}>
                        <Container>
                            <Container className={classes.container}>
                                <Typography variant="h4" className={classes.title}>答題事件</Typography>
                                <div className={classes.row}>
                                    <Select className={classes.rowFlexEnd}
                                        value={this.state.eventIsChoice ? 1 : 0}
                                        onChange={evt => this.onEventTypeChange(evt)} disabled={this.state.evtState !== 'NONE'}>
                                        <MenuItem value={0}>填空</MenuItem>
                                        <MenuItem value={1}>選擇</MenuItem>
                                    </Select>
                                    {
                                        this.state.eventIsChoice &&
                                        <TextField className={classes.rowFlexEnd} type="number" id="choice-count" label="選項數量"
                                            value={this.state.eventChoices.toString()} onChange={evt=>this.handleChoiceChange(evt)} disabled={this.state.evtState !== 'NONE'} />
                                    }
                                    <Button variant="contained" color="primary" onClick={evt => this.handlePost()}>{
                                        this.state.evtState === 'NONE' ? "新增" :
                                            this.state.evtState === 'OPEN' ? "關閉" :
                                                "加分並封存"
                                    }</Button>
                                </div>
                            </Container>
                            {   // Price
                                this.state.evtState === 'CLOSE' && this.state.result &&
                                <Container className={classes.container}>
                                    <Divider className={classes.hr}></Divider>
                                    <Typography variant="h4" className={classes.title}>答題配分</Typography>
                                    {
                                        this.state.result.slice().sort((l, r) => l.poll > r.poll ? 1 : -1).map((item, index) =>
                                            <ChoiceScore key={index} name={(this.state.eventIsChoice ? '#' : '') + item.poll}
                                                points={this.state.score[index]} handler={(evt) => this.onTextChange(evt, index)} />
                                        )
                                    }
                                </Container>
                            }
                            {   // Statistics
                                this.state.evtState !== 'NONE' && this.state.result &&
                                <Container className={classes.container}>
                                    <Divider className={classes.hr}></Divider>
                                    <Typography variant="h4" className={classes.title}>答題統計</Typography>
                                    <PieChart className={classes.pie} data={
                                        this.state.result.sort((l, r) => l.cnt < r.cnt ? 1 : -1).map((item, index) => ({
                                            title: (this.state.eventIsChoice ? '#' : '') + item.poll,
                                            value: item.cnt,
                                            color: piecolor[index % piecolor.length]
                                        }))
                                    } radius={48} label={({ dataEntry }) => (dataEntry.title + ': ' + dataEntry.value + '組')}
                                        labelStyle={{
                                            fontSize: "3px",
                                            fontWeight: "bold"
                                        }}
                                    />
                                </Container>
                            }
                        </Container>
                    </div>
                </div>
                <Dialog
                    open={this.state.dialogClose}
                    onClose={() => this.handleClose_close()}>
                    <DialogTitle>關閉事件</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            這個事件將不會再接受回答並進入配分階段
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.handleClose_close()} color="secondary">
                            取消
                        </Button>
                        <Button onClick={() => this.handlePost_close()} color="primary">
                            確認
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={this.state.dialogArchive}
                    onClose={() => this.handleClose_post()}>
                    <DialogTitle>封存事件</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            這個事件將會被封存，請確認你已經設定好配分了！
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.handleClose_post()} color="secondary">
                            取消
                        </Button>
                        <Button onClick={() => this.handlePost_post()} color="primary">
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

export default withSnackbar(connect(mapStateToProps)(withStyles(styles)(PollManage)))