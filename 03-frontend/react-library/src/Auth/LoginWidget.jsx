import { Redirect } from "react-router-dom"
import { useOktaAuth } from "@okta/okta-react"
import { error } from "console"
import { SpinnerLoading } from "../layouts/Utils/SpinnerLoading"

const LoginWidget = ({ config }) => {
    const {oktaAuth, authState} = useOktaAuth()
    const onSuccess = (tokens) => {
        oktaAuth.handleLoginRedirect(tokens)
    }
    const onError = (error) => {
        console.log('Sign in error', error)
    }
    if(!authState) {
        return (
            <SpinnerLoading />
        )
    }

    return authState.isAuthenticated ? <Redirect to={{ pathname: '/'}} /> : <div></div>
}

export default LoginWidget