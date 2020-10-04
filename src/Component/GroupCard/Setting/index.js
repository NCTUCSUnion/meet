import {
    Card,
    CardContent,
    Divider, 
    FormControlLabel, 
    Switch, 
    TextField, 
    Typography, 
    withStyles
} from '@material-ui/core'
import React from 'react'

const styles = (theme) => ({
    card: {
        display: "flex",
        flexFlow: "column nowrap",
        alignItem: "center",
        width: "116px",
        margin: "3px",
        padding: "14px",
        textAlign: "center"
    },
    title: {
        fontWeight: 'bold',
        fontSize: '20px'
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
        margin: "0 auto"
    },
    switchCtrl: {
        marginRight: "0px",
        marginTop: "-8px",
        marginBottom: "-8px"
    },
    lastContent: {
        paddingBottom: "0px !important"
    },
    searchID: {
        marginBottom: "-3px"
    }
})

class SettingCard extends React.Component {
    render() {
        const { classes, sortByPts, onToggle, search, handler, id1, id2 } = this.props
        return (
            <Card className={classes.card}>
                <CardContent className={classes.content}>
                    <Typography className={classes.title} variant="h5" color="textSecondary" gutterBottom>
                        照分數排序
                    </Typography>
                    <FormControlLabel className={classes.switchCtrl}
                        control={<Switch checked={sortByPts} onChange={onToggle} />}
                        label={sortByPts ? "開" : "關"} size="small"
                    />
                </CardContent>
                <Divider className={classes.hr} light />
                <CardContent className={[classes.content, classes.lastContent].join(' ')}>
                    <Typography className={classes.title} variant="h5" color="textSecondary" gutterBottom>
                        搜尋組別
                    </Typography>
                    <TextField type="number" value={search} onChange={handler} />
                    <Typography className={classes.searchID} variant="subtitle1" color="textSecondary" gutterBottom>
                        {id1}
                    </Typography>
                    <Typography className={classes.searchID} variant="subtitle1" color="textSecondary" gutterBottom>
                        {id2}
                    </Typography>
                </CardContent>
            </Card>
        )
    }
}

export default withStyles(styles)(SettingCard)