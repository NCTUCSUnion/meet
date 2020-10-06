import { 
    Divider,
    TextField, 
    Typography, 
    withStyles 
} from '@material-ui/core'
import React from 'react'

const styles = (theme) => ({
    row: {
        width: 'fit-content',
        display: 'flex',
        flex: "1 0 1",
        alignItems: 'center',
        justifyContent: 'center',
        margin: "5px 0px",
        padding: "8px 12px",
        borderWidth: "1px",
        borderStyle: "solid !important",
        borderRadius: ".8rem",
        borderColor: "#DDDDDD"
    },
    title: {
        margin: "0px 10px",
        fontWeight: "bold"
    },
    text: {
        marginLeft: "10px"
    }
})

class ChoiceScore extends React.Component {
    render() {
        const { classes, name, points, handler } = this.props
        return (
            <div className={classes.row}>
                <Typography className={classes.title} variant="subtitle1">{name}</Typography>
                <Divider orientation="vertical" flexItem />
                <TextField autoComplete="off" className={classes.text} type="number" value={points.toString()} onChange={evt => handler(evt)} />
            </div>
        )
    }
}

export default withStyles(styles)(ChoiceScore)