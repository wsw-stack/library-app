import { useOktaAuth } from "@okta/okta-react"
import { useEffect, useState } from "react"
import ShelfCurrentLoans from "../../../models/ShelfCurrentLoans"
import { SpinnerLoading } from "../../Utils/SpinnerLoading"
import { Link } from "react-router-dom"
import { LoansModal } from "./LoansModal"

export const Loans = () => {
    const { authState } = useOktaAuth()
    const [httpError, setHttpError] = useState(null)

    // current loans
    const [shelfCurrentLoans, setShelfCurrentLoans] = useState<ShelfCurrentLoans[]>([])
    const [isLoadingUserLoans, setIsLoadingUserLoans] = useState(true)
    const [checkout, setCheckout] = useState(false)

    useEffect(() => {
        const fetchUserCurrentLoans = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/books/secure/currentloans`
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
                const shelfCurrentLoanResponse = await fetch(url, requestOptions)
                if (!shelfCurrentLoanResponse.ok) {
                    throw new Error('Something went wrong!')
                }
                const shelfCurrentLoanResponseJson = await shelfCurrentLoanResponse.json()
                setShelfCurrentLoans(shelfCurrentLoanResponseJson)
            }
            setIsLoadingUserLoans(false)
        }
        fetchUserCurrentLoans().catch((error: any) => {
            setIsLoadingUserLoans(false)
            setHttpError(error.message)
        })
        window.scrollTo(0, 0) // scroll to the top of the page
    }, [authState, checkout])

    if (isLoadingUserLoans) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        )
    }

    const returnBook = async (bookId: number) => {
        const url = `http://localhost:8080/api/books/secure/return/?bookId=${bookId}`
        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        }
        const returnResponse = await fetch(url, requestOptions)
        if(!returnResponse.ok) {
            throw new Error('Something went wrong!')
        }
        setCheckout(!checkout)
    }

    const renewLoan = async (bookId: number) => {
        const url = `http://localhost:8080/api/books/secure/renew/loan/?bookId=${bookId}`
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        }

        const returnResponse = await fetch(url, requestOptions)
        if(!returnResponse.ok) {
            throw new Error('Something went wrong')
        }
        setCheckout(!checkout)
    }

    return (
        <div>
            {/* Desktop */}
            <div className="d-none d-lg-block mt-2">
                {shelfCurrentLoans.length > 0 ?
                    <>
                        <h5>Current Loans</h5>
                        {shelfCurrentLoans.map(e => ( 
                            <div key={e.book.id}>
                                <div className="row mt-3 mb-3">
                                    <div className="col-4 col-md-4 container">
                                        {e.book?.img ?
                                            <img src={e.book?.img} width='226' height='349' alt="Book" />
                                            :
                                            <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')} width='226' height='349' alt="Book" />
                                        }
                                    </div>
                                    <div className="card col-3 col-md-3 container d-flex">
                                        <div className="card-body">
                                            <div className="mt-3">
                                                <h4>Loan Options</h4>
                                                {e.daysLeft > 0 &&
                                                    <p className="text-secondary">Due in {e.daysLeft} days</p>
                                                }
                                                {e.daysLeft === 0 &&
                                                    <p className="text-success">Due today</p>
                                                }
                                                {e.daysLeft < 0 &&
                                                    <p className="text-danger">Past due by {-e.daysLeft} days.</p>
                                                }
                                                <div className="list-group mt-3">
                                                    <button className="list-group-item list-group-item-action"
                                                        aria-current='true' data-bs-toggle='modal'
                                                        data-bs-target={`#modal${e.book.id}`}>
                                                        Manage Loan
                                                    </button>
                                                    <Link to={'search'} className="list-group-item list-group-item-action">
                                                        Search more books?
                                                    </Link>
                                                </div>
                                            </div>
                                            <hr />
                                            <p className="mt-3">
                                                Help other find their adventure by reviewing your loan.
                                            </p>
                                            <Link className="btn btn-primary" to={`/checkout/${e.book.id}`}>
                                                Leave a review
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <LoansModal shelfCurrentLoan={e} mobile={false} returnBook={returnBook} renewLoan={renewLoan}/>
                            </div>
                        ))}
                    </> :
                    <>
                        <h3 className="mt-3">
                            Currently no Loans
                        </h3>
                        <Link to={'search'} className="btn btn-primary">
                            Search for a new book
                        </Link>
                    </>}
            </div>
            {/* Mobile */}
            <div className="container d-lg-none mt-2">
                {shelfCurrentLoans.length > 0 ?
                    <>
                        <h5 className="mb-3">Current Loans</h5>
                        {shelfCurrentLoans.map(e => {
                            <div key={e.book.id}>
                                <div className="d-flex justify-content-center align-item-center">
                                    {e.book?.img ?
                                        <img src={e.book?.img} width='226' height='349' alt="Book" />
                                        :
                                        <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')} width='226' height='349' alt="Book" />
                                    }
                                </div>
                                <div className="card d-flex mt-5 mb-3">
                                    <div className="card-body container">
                                        <div className="mt-3">
                                            <h4>Loan Options</h4>
                                            {e.daysLeft > 0 &&
                                                <p className="text-secondary">Due in {e.daysLeft}</p>
                                            }
                                            {e.daysLeft === 0 &&
                                                <p className="text-success">Due today</p>
                                            }
                                            {e.daysLeft < 0 &&
                                                <p className="text-danger">Past due by {-e.daysLeft} days.</p>
                                            }
                                            <div className="list-group mt-3">
                                                <button className="list-group-item list-group-item-action"
                                                    aria-current='true' data-bs-toggle='modal'
                                                    data-bs-target={`#mobilemodal${e.book.id}`}>
                                                    Manage Loan
                                                </button>
                                                <Link to={'search'} className="list-group-item list-group-item-action">
                                                    Search more books?
                                                </Link>
                                            </div>
                                        </div>
                                        <hr />
                                        <p className="mt-3">
                                            Help other find their adventure by reviewing your loan.
                                        </p>
                                        <Link className="btn btn-primary" to={`/checkout/${e.book.id}`}>
                                            Leave a review
                                        </Link>
                                    </div>
                                </div>
                                <hr />
                                <LoansModal shelfCurrentLoan={e} mobile={true} returnBook={returnBook} renewLoan={renewLoan}/>
                            </div>
                        })}
                    </> :
                    <>
                        <h3 className="mt-3">
                            Currently no Loans
                        </h3>
                        <Link to={'search'} className="btn btn-primary">
                            Search for a new book
                        </Link>
                    </>}
            </div>
        </div>
    )
}