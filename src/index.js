import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Router from './Router'
import * as serviceWorker from './serviceWorker'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import reducer from './Redux/Reducers'
import { composeWithDevTools } from 'redux-devtools-extension'
import isMobileChecker from './Utils/isMobile'
import { ThemeProvider, createMuiTheme } from '@material-ui/core'
import { SnackbarProvider } from 'notistack'

const store = createStore(reducer, composeWithDevTools(
    applyMiddleware(thunkMiddleware)
))

const isMobile = isMobileChecker()

const theme = createMuiTheme({})

ReactDOM.render(
    <Provider store={store}>
        <SnackbarProvider maxSnack={3}>
            <ThemeProvider theme={{ ...theme, isMobile }}>
                <Router />
            </ThemeProvider>
        </SnackbarProvider>
    </Provider>,
    document.getElementById('root')
)

serviceWorker.unregister()
