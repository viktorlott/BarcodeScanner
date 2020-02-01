import React from 'react'


const AuthContext = React.createContext()


function AuthProvider(props) {

    const login = () => {}
    const register = () => {}
    const logout = () => {}


    return (
        <AuthContext.Provider value={{ login, register, logout }} {...props} />
    )
}

const useAuth = () => React.useContext(AuthContext)


export { AuthProvider, useAuth }