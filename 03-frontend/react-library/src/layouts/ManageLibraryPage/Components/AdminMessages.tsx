import { useOktaAuth } from "@okta/okta-react"
import { useEffect, useState } from "react"
import MessageModel from "../../../models/MessageModel"
import { SpinnerLoading } from "../../Utils/SpinnerLoading"
import { Pagination } from "../../Utils/Pagination"
import { AdminMessage } from "./AdminMessage"
import AdminMessageRequest from "../../../models/AdminMessageRequest"

export const AdminMessages = () => {
    const {authState} = useOktaAuth()
    const [messages, setMessages] = useState<MessageModel[]>([])
    const [isLoadingMessages, setIsLoadingMessages] = useState(true)
    const [httpError, setHttpError] = useState(null)

    const [messagesPerPage, setMessagesPerPage] = useState(5)
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)

    const [buttonSubmit, setButtonSubmit] = useState(false)

    // after changing in buttonSubmit (admin has made a new response), do an update
    useEffect(() => {
        const fetchUserMessages = async () => {
            if(authState && authState?.isAuthenticated) {
                const url = `http://localhost:8080/api/messages/search/findByClosed/?closed=false&page=${currentPage-1}&size=${messagesPerPage}`
                const requestOptions = {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                        "Content-Type": "application/json",
                    }
                }
                const messagesResponse = await fetch(url, requestOptions)
                if(!messagesResponse.ok) {
                    throw new Error("Something went wrong!")
                }
                const messagesResponseJson = await messagesResponse.json()
                setMessages(messagesResponseJson._embedded.messages)
                setTotalPages(messagesResponseJson.page.totalPages)
            }
            setIsLoadingMessages(false)
        }
        fetchUserMessages().catch((error: any) => {
            setIsLoadingMessages(false)
            setHttpError(error.message)
        })
        window.scrollTo(0, 0)
    }, [authState, currentPage, buttonSubmit])

    if(isLoadingMessages) {
        return <SpinnerLoading />
    }

    if(httpError) {
        return (
            <div className="m-5">
                <p>{httpError}</p>
            </div>
        )
    }

    const submitResponse = async (id: number, response: string) => {
        const url =  `http://localhost:8080/api/messages/secure/admin/message`
        if(authState && authState?.isAuthenticated && id != null && response !== '') {
            const messageAdmin: AdminMessageRequest = new AdminMessageRequest(id, response)
            const requestOptions = {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(messageAdmin)
            }

            const messageAdminResponse = await fetch(url, requestOptions)
            if(!messageAdminResponse.ok) {
                throw new Error('Something went wrong!')
            }
            setButtonSubmit(!buttonSubmit)
        }
    }

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber)
    }

    return (
        <div className="mt-3">
            {messages.length > 0 ? 
                <>
                    <h5>Pending Q&A:</h5>
                    {messages.map(message => (
                        <AdminMessage message={message} key={message.id} submitResponse={submitResponse}/>
                    ))}
                </>:
                <h5>No pending Q&A</h5>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />} 
        </div>
    )
}