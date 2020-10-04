
const initialState = {
    loading: true,
    login: false,
    isSuper: false,
    group: undefined,
    students: undefined
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'NONE':
            console.log('Login none')
            return {
                ...state,
                loading: true,
            }
        case 'LOGIN_FAIL':
            console.log('Login fail')
            return {
                ...state,
                loading: false,
            }
        case 'LOGIN_OK':
            console.log('Login ok')
            return {
                ...state,
                loading: false,
                login: true,
                group: action.group
            }
        case 'LOGIN_SUPER':
            console.log('Login super')
            return {
                ...state,
                loading: false,
                login: true,
                isSuper: true,
                students: action.students
            }
        case 'LOGOUT':
            console.log('Logout')
            localStorage.clear()
            return {
                ...state,
                loading: false,
                login: false,
                isSuper: false,
                group: undefined,
                students: undefined,
            }
        default:
            return state
    }
}
