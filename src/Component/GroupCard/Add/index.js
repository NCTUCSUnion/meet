import {
    Button, 
    Card,
    CardActions, 
    CardContent,
    Divider, 
    TextField, 
    Typography, 
    withStyles
} from '@material-ui/core'
import axios from 'axios'
import { withSnackbar } from 'notistack'
import React from 'react'
import { API_URL } from '../../../constant'

axios.defaults.withCredentials = true

const styles = (theme) => ({
    card: {
        display: "flex",
        flexFlow: "column nowrap",
        alignItem: "center",
        width: "266px",
        margin: "3px",
        padding: "14px",
        textAlign: "center"
    },
    title: {
        fontWeight: 'bold'
    },
    content: {
        padding: "0px"
    },
    action: {
        padding: "0px"
    },
    hr: {
        margin: "12px 0px"
    },
    btn: {
        borderColor: "#3BEE93",
        color: "#3BEE93",
        margin: "0 auto",
        "&:hover": {
            background: "#E9FFF4",
            borderColor: "#00FF62"
        }
    },
})

class AddGroupCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id1: '',
            id2: ''
        }
    }

    handleID1(evt) {
        this.setState({
            id1: parseInt(evt.target.value).toString()
        })
    }

    handleID2(evt) {
        this.setState({
            id2: parseInt(evt.target.value).toString()
        })
    }

    handlePost() {
        const id1 = this.state.id1.trim()
        const id2 = this.state.id2.trim()
        this.setState({
            id1: '',
            id2: ''
        })
        if (id1.length <= 9 && id2.length <= 9)
            axios.post(`${API_URL}/group_add`, {
                id1: id1,
                id2: id2
            }).then(res => res.data).then(
                json => {
                    if (json.success) {
                        this.props.enqueueSnackbar("新增成功", {
                            variant: 'success',
                        })
                        this.props.addCard(json.gid, id1, id2)
                    }
                    else {
                        this.props.enqueueSnackbar(json.error ? json.error : "新增失敗", {
                            variant: 'error',
                        })
                    }
                }
            ).catch(err => {
                this.props.enqueueSnackbar(err.toString(), {
                    variant: 'error',
                })
            })
    }

    handleKeyPress(evt) {
        if (evt.key === 'Enter') {
            this.handlePost()
        }
    }

    getName(id) {
        const {students} = this.props
        if (students && students[id])
            return students[id]
        return ' '
    }

    render() {
        const { classes } = this.props
        return (
            <Card className={classes.card}>
                <CardContent className={classes.content}>
                    <Typography className={classes.title} variant="h5" color="textSecondary" gutterBottom>
                        新增組別
                    </Typography>
                    <TextField type="number" id="id1" label={this.state.id1 ? this.getName(this.state.id1.toString()) : "大直屬學號"} value={this.state.id1} onChange={evt => this.handleID1(evt)} onKeyPress={evt => this.handleKeyPress(evt)} />
                    <TextField type="number" id="id2" label={this.state.id2 ? this.getName(this.state.id2.toString()) : "小直屬學號"} value={this.state.id2} onChange={evt => this.handleID2(evt)} onKeyPress={evt => this.handleKeyPress(evt)} />
                </CardContent>
                <Divider className={classes.hr} light />
                <CardActions className={classes.action}>
                    <Button className={classes.btn} variant="outlined" size="small" onClick={() => this.handlePost()}>
                        <Typography variant="h6">
                            新增組別
                        </Typography>
                    </Button>
                </CardActions>
            </Card>
        )
    }
}

export default withSnackbar(withStyles(styles)(AddGroupCard))