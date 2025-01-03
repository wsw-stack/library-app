import { useOktaAuth } from "@okta/okta-react"
import { useState } from "react"
import { Redirect } from "react-router-dom"
import { AdminMessages } from "./Components/AdminMessages"
import AddBookRequest from "../../models/AddBookRequest"
import { AddNewBook } from "./Components/AddNewBook"
import { ChangeBookQuantityPage } from "./Components/ChangeBookQuantityPage"

export const ManageLibraryPage = () => {
    const {authState} = useOktaAuth()
    const [changeQuantityOfBooksClick, setChangeQuantityOfBooksClick] = useState(false)
    const [messagesClick, setMessagesClick] = useState(false)

    const addBookClickFunction = () => {
        setChangeQuantityOfBooksClick(true)
        setMessagesClick(false)
    }
    const changeQuantityOfBooksClickFunction = () => {
        setChangeQuantityOfBooksClick(true)
        setMessagesClick(false)
    }
    const messagesClickFunction = () => {
        setChangeQuantityOfBooksClick(false)
        setMessagesClick(true)
    }
    // redirect the non-admin users to the main page
    if(authState?.accessToken?.claims.sub !== 'admin@email.com') {
        return <Redirect to='/home' />
    }

    return (
        <div className="container">
            <div className="mt-5">
                <h3>Manage Library</h3>
                <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <button onClick={addBookClickFunction} className="nav-link active" id="nav-add-book-tab"
                            data-bs-toggle='tab' data-bs-target="#nav-add-book" 
                            type="button" role="tab" aria-controls="nav-add-book" aria-selected="false">
                                Add new book
                        </button>
                        <button onClick={changeQuantityOfBooksClickFunction} className="nav-link" id="nav-quantity-tab"
                            data-bs-toggle='tab' data-bs-target="#nav-quantity" 
                            type="button" role="tab" aria-controls="nav-quantity" aria-selected="true">
                                Change quantity
                        </button>
                        <button onClick={messagesClickFunction} className="nav-link" id="nav-messages-tab"
                            data-bs-toggle='tab' data-bs-target="#nav-messages" 
                            type="button" role="tab" aria-controls="nav-messages" aria-selected="false">
                                Admin messages
                        </button>
                    </div>
                    <div className="tab-content" id="nav-content">
                        <div className="tab-pane fade show active" id="nav-add-book" role="tabpanel"
                            aria-labelledby="nav-add-book-tab">
                            <AddNewBook />
                        </div>
                        <div className="tab-pane fade" id="nav-quantity" role="tabpanel"
                            aria-labelledby="nav-quantity-tab">
                            {changeQuantityOfBooksClick? <ChangeBookQuantityPage />: <></>}
                        </div>
                        <div className="tab-pane fade" id="nav-messages" role="tabpanel"
                            aria-labelledby="nav-messages-tab">
                            {messagesClick? <AdminMessages />: <></>}
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    )
}