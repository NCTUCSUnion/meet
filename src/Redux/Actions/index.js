import axios from 'axios'
import { API_URL } from '../../constant'

axios.defaults.withCredentials = true

export const checkIsAvailable = () => (dispatch) => {
    dispatch({ type: 'NONE' })
    axios.post(`${API_URL}/check`).then(
        res => res.data
    ).then(json => {
        if (json.logined) {
            if (json.isSuper) {
                if (localStorage['students']) {
                    const students = JSON.parse(localStorage['students'])
                    if ((new Date().getTime()) - (new Date(students['timestamp']).getTime()) < 1000 * 60 * 60 * 24) {
                        dispatch({ type: 'LOGIN_SUPER', students: students['map'] })
                    }
                    else {
                        axios.get(`${API_URL}/students`).then(res => res.data).then(
                            json => {
                                if (json.success) {
                                    const all = json.all
                                    const map = {}
                                    for (let i = 0; i < all.length; i++) {
                                        map[all[i].id] = all[i].name
                                    }
                                    const students = {
                                        timestamp: new Date().toJSON(),
                                        map: map
                                    }
                                    localStorage['students'] = JSON.stringify(students)
                                    dispatch({ type: 'LOGIN_SUPER', students: map })
                                }
                                else
                                    dispatch({ type: 'LOGIN_SUPER' })
                            }
                        ).catch(err => {
                            dispatch({ type: 'LOGIN_SUPER' })
                        })
                    }
                }
                else {
                    axios.get(`${API_URL}/students`).then(res => res.data).then(
                        json => {
                            if (json.success) {
                                const all = json.all
                                const map = {}
                                for (let i = 0; i < all.length; i++) {
                                    map[all[i].id] = all[i].name
                                }
                                const students = {
                                    timestamp: new Date().toJSON(),
                                    map: map
                                }
                                localStorage['students'] = JSON.stringify(students)
                                dispatch({ type: 'LOGIN_SUPER', students: map })
                            }
                            else
                                dispatch({ type: 'LOGIN_SUPER' })
                        }
                    ).catch(err => {
                        dispatch({ type: 'LOGIN_SUPER' })
                    })
                }
            }
            else {
                dispatch({ type: 'LOGIN_OK', group: json.group })
            }
        }
        else {
            dispatch({ type: 'LOGIN_FAIL' })
        }
    })
}

export const login = (gid, passwd) => (dispatch) => {
    dispatch({ type: 'NONE' })
    axios.post(`${API_URL}/login`, {
        gid: gid,
        passwd: passwd
    }).then(
        res => res.data
    ).then(
        json => {
            if (json.logined) {
                if (json.isSuper) {
                    axios.get(`${API_URL}/students`).then(res => res.data).then(
                        json => {
                            if (json.success) {
                                const all = json.all
                                const map = {}
                                for (let i = 0; i < all.length; i++) {
                                    map[all[i].id] = all[i].name
                                }
                                const students = {
                                    timestamp: new Date().toJSON(),
                                    map: map
                                }
                                localStorage['students'] = JSON.stringify(students)
                                dispatch({ type: 'LOGIN_SUPER', students: map })
                            }
                            else
                                dispatch({ type: 'LOGIN_SUPER' })
                        }
                    ).catch(err => {
                        dispatch({ type: 'LOGIN_SUPER' })
                    })
                }
                else {
                    dispatch({ type: 'LOGIN_OK', group: json.group })
                }
            }
            else {
                dispatch({ type: 'LOGIN_FAIL' })
                window.location.reload()
            }
        }
    )
}

export const logout = () => (dispatch) => {
    axios.post(`${API_URL}/logout`).then(
        dispatch({ type: 'LOGOUT' })
    )
}