import {
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    InputLabel,
    Typography,
    withStyles
} from '@material-ui/core'
import React from 'react'

const styles = (theme) => ({
    card: {
        display: "flex",
        flexFlow: "column nowrap",
        justifyContent: "flex-end",
        alignItem: "center",
        width: "116px",
        margin: "3px",
        padding: "14px",
        textAlign: "center"
    },
    title: {
        display: 'flex',
        flexFlow: 'row nowrap',
        justifyContent: 'space-around',
        flex: '1 0 1',
        marginBottom: "12px"
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
    profile: {
        height: "48px",
        display: "flex",
        flexFlow: "column nowrap",
        justifyContent: "center",
        alignItems: "center",
    },
    profileLabel: {
        display: "flex",
        alignSelf: "start",
        padding: "0px 5px",
        fontSize: "small"
    },
    btn: {
        margin: "0 auto"
    },
    hrVert: {
        margin: "0px 6px"
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: '16px',
        marginBottom: "0px"
    }
})

class GroupCard extends React.Component {
    render() {
        const { classes, gid, id1, id2, pts, name1, name2, handler } = this.props
        return (
            <Card className={classes.card}>
                <CardContent className={classes.content}>
                    <div className={classes.title}>
                        <Typography className={classes.titleText} variant="h6" color="textSecondary" gutterBottom>
                            組別 {gid}
                        </Typography>
                        <Divider className={classes.hrVert} orientation="vertical" flexItem />
                        <Typography className={classes.titleText} variant="h6" color="textSecondary" gutterBottom>
                            {pts} 分
                        </Typography>
                    </div>
                    <div className={classes.profile}>
                        <InputLabel className={classes.profileLabel}>{name1}</InputLabel>
                        <Typography variant="h6">
                            {id1}
                        </Typography>
                    </div>
                    <div className={classes.profile}>
                        <InputLabel className={classes.profileLabel}>{name2}</InputLabel>
                        <Typography variant="h6">
                            {id2}
                        </Typography>
                    </div>
                </CardContent>
                <Divider className={classes.hr} light />
                <CardActions className={classes.action}>
                    <Button variant="outlined" color="secondary" size="small" className={classes.btn} onClick={handler}>
                        <Typography variant="h6">
                            刪除組別
                        </Typography>
                    </Button>
                </CardActions>
            </Card>
        )
    }
}

export default withStyles(styles)(GroupCard)
