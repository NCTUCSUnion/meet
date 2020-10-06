import {
    Button,
    Container,
    Divider,
    Typography,
    withStyles,
} from '@material-ui/core'
import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import { withSnackbar } from 'notistack'
import { API_URL } from '../../constant'
import TeamCard from '../../Component/TeamCard'

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
        width: theme.isMobile ? "100%" : "60%",
        margin: "24px auto",
        justifyContent: 'center',
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    btnAdd: {
        width: "100%",
        backgroundColor: "#43A047",
        color: "white",
        margin: "6px auto",
        "&:hover": {
            backgroundColor: "#218838",
        }
    },
    hr: {
        margin: "12px 0px"
    }
})

class Team extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            teams: []
        }
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
                        {
                            this.state.teams.map(item =>
                                <TeamCard key={item.tid} tid={item.tid} groups={JSON.parse(item.groups)} score={item.score} reload={() => this.getTeams()} />
                            )
                        }
                        <Divider className={classes.hr} />
                        <Button className={classes.btnAdd} variant="contained" size="large" onClick={() => this.addTeam()}>
                            <Typography variant="h6">新增隊伍</Typography>
                        </Button>
                    </div>
                </div>
            </Container>
        )
    }

    addTeam() {
        axios.post(`${API_URL}/team_add`).then(res => res.data).then(
            json => {
                if (json.success) {
                    this.props.enqueueSnackbar("新增成功", {
                        variant: 'success',
                    })
                    this.getTeams()
                }
                else {
                    this.props.enqueueSnackbar(json.error ? json.error : "新增失敗", {
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

    componentDidMount() {
        this.getTeams()
    }

    getTeams() {
        axios.get(`${API_URL}/teams`).then(res => res.data).then(
            json => {
                console.log(json)
                this.setState({
                    teams: json.data
                })
            }
        )
    }
}

const mapStateToProps = (state) => ({
    ...state
})

export default withSnackbar(connect(mapStateToProps)(withStyles(styles)(Team)))