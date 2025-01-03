import { useEffect, useState } from "react"
import BookModel from "../../models/BookModel"
import { SpinnerLoading } from "../Utils/SpinnerLoading"
import { StarsReview } from "../Utils/StarsReview"
import { CheckOutAndReviewBox } from "./CheckOutAndReviewBox"
import ReviewModel from "../../models/ReviewModel"
import { LatestReviews } from "./LatestReviews"
import { useOktaAuth } from "@okta/okta-react"
import { ReviewRequest } from "../../models/ReviewRequest"

export const BookCheckOutPage = () => {
    const { authState } = useOktaAuth()
    const [book, setBook] = useState<BookModel>()
    const [isLoading, setIsLoading] = useState(true) // by default it will display to the users that the page is loading
    const [httpError, setHttpError] = useState(null) // is not null if the API fails 
    // review state
    const [reviews, setReviews] = useState<ReviewModel[]>([]) 
    const [totalStars, setTotalStars] = useState(0)
    const [isLoadingReview, setIsLoadingReview] = useState(true)

    const [isReviewLeft, setIsReviewLeft] = useState(false) // if the user has already left a review for the book
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(false)
    // loans count state
    const [currentLoansCount, setCurrentLoansCount] = useState(0)
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true)
    // is book checked out
    const [isCheckedOut, setIsCheckedOut] = useState(false)
    const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true)

    // localhost:3000/checkout/2, so bookId refers to the third one   
    const bookId = (window.location.pathname).split('/')[2]

    useEffect(() => {
        const fetchBook = async () => {
            const baseUrl: string = `http://localhost:8080/api/books/${bookId}`
            const response = await fetch(baseUrl)
            if (!response.ok) {
                throw new Error('Something went wrong!')
            }
            const responseJson = await response.json() // parse the response into json, still this is an async function

            const loadedBook: BookModel = {
                id: responseJson.id,
                title: responseJson.title,
                author: responseJson.author,
                description: responseJson.description,
                copies: responseJson.copies,
                copiesAvailable: responseJson.copiesAvailable,
                category: responseJson.category,
                img: responseJson.img
            }

            setBook(loadedBook)
            setIsLoadingReview(false)
        }
        fetchBook().catch((error: any) => {
            // is called when there is an Http error
            setIsLoadingReview(false)
            setHttpError(error.message)
        })
    }, [isCheckedOut])

    useEffect(() => {
        const fetchBookReviews = async () => {
            const reviewUrl: string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}`
            const responseReviews = await fetch(reviewUrl)
            if (!responseReviews.ok) {
                throw new Error('Someting went wrong!')
            }
            const responseJsonReviews = await responseReviews.json()
            const responseData = responseJsonReviews._embedded.reviews
            const loadedReviews: ReviewModel[] = []
            let weightedStarReviews: number = 0

            for (const key in responseData) {
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    book_id: responseData[key].bookId, // use the column name defined in the backend
                    reviewDescription: responseData[key].reviewDescription
                })
                weightedStarReviews = weightedStarReviews + responseData[key].rating
            }

            if (loadedReviews) { // get the average star ratings
                // round the ratings to the nearest 0.5
                const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2).toFixed(1)
                setTotalStars(Number(round))
            }

            setReviews(loadedReviews)
            setIsLoading(false)
        }

        fetchBookReviews().catch((error: any) => {
            setIsLoadingReview(false)
            setHttpError(error.message)
        })
    }, [isReviewLeft])

    useEffect(() => {
        const fetchUserCurrentLoansCount = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/books/secure/currentloans/count`
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'

                    }
                }
                const currentLoansCountResponse = await fetch(url, requestOptions)
                if(!currentLoansCountResponse.ok) {
                    throw new Error('Something went wrong')
                }
                const currentLoansCountResponseJson = await currentLoansCountResponse.json()
                setCurrentLoansCount(currentLoansCountResponseJson)
            }
            setIsLoadingCurrentLoansCount(false)
        }
        fetchUserCurrentLoansCount().catch((error: any) => {
            setIsLoadingCurrentLoansCount(false)
            setHttpError(error.message)
        })
    }, [authState, isCheckedOut])

    useEffect(() => {
        const fetchUserCheckedOutBook = async () => {
            if(authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/books/secure/ischeckedout/byuser/?bookId=${bookId}`
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
                const bookCheckedOut = await fetch(url, requestOptions)
                if(!bookCheckedOut.ok) {
                    throw new Error('Something went wrong')
                }
                const bookCheckedOutResponseJson = await bookCheckedOut.json()
                setIsCheckedOut(bookCheckedOutResponseJson)
            }
            setIsLoadingBookCheckedOut(false)
        }
        fetchUserCheckedOutBook().catch((error: any) => {
            setIsLoadingBookCheckedOut(false)
            setHttpError(error.message)
        })
    }, [authState])

    useEffect(() => {
        const fetchUserReviewBook = async () => {
            if(authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/reviews/secure/user/book/?bookId=${bookId}`
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
                const userReview = await fetch(url, requestOptions)
                if(!userReview.ok) {
                    throw new Error('Something went wrong!')
                }
                const userReviewResponseJson = await userReview.json()
                setIsReviewLeft(userReviewResponseJson)
            }
            setIsLoadingUserReview(false)
        }
        fetchUserReviewBook().catch((e: any) => {
            setIsLoadingUserReview(false)
            setHttpError(e.message)
        })
    }, [authState])

    if (isLoading || isLoadingReview || isLoadingCurrentLoansCount || isLoadingBookCheckedOut || isLoadingUserReview) {
        return (
            <SpinnerLoading />
        )
    } // Loading effect
    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        )
    } // error effect

    const checkoutBook = async () => {
        const url = `http://localhost:8080/api/books/secure/checkout/?bookId=${book?.id}`
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        }
        const checkoutResponse = await fetch(url, requestOptions)
        if(!checkoutResponse.ok) {
            throw new Error('Something went wrong!')
        }
        setIsCheckedOut(true)
    }

    const submitReview = async (starInput: number, reviewDescription: string) => {
        let bookId: number = 0
        if (book?.id) {bookId = book.id}
        const reviewRequestModel = new ReviewRequest(starInput, bookId, reviewDescription)
        const url = `http://localhost:8080/api/reviews/secure/`
        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewRequestModel)
        }
        const returnResponse = await fetch(url, requestOptions)
        if(!returnResponse.ok) {
            throw new Error('Something went wrong')
        }
        setIsReviewLeft(true)
    }

    return (
        <div className="container d-none d-lg-block">
            <div className="row mt-5">
                <div className="col-sm-2 col-md-2">
                    {book?.img ?
                        <img src={book?.img} width='226' height='349' alt='Book' />
                        :
                        <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226' height='349' alt='Book' />
                    }
                </div>
                <div className="col-4 col-md-4 container">
                    <div className="ml-2">
                        <h2>{book?.title}</h2>
                        <h5 className="text-primary">{book?.author}</h5>
                        <p className="lead">{book?.description}</p>
                        <StarsReview rating={totalStars} size={32} />
                    </div>
                </div>
                <CheckOutAndReviewBox book={book} mobile={false} currentLoansCount={currentLoansCount} 
                    isAuthenticated={authState?.isAuthenticated} isCheckedOut={isCheckedOut} checkoutBook={checkoutBook} isReviewLeft={isReviewLeft} submitReview={submitReview}/>
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
            </div>

            {/* for mobile */}
            <div className="container d-lg-none mt-5">
                <div className="d-flex justify-content-center align-items-center">
                    {book?.img ?
                        <img src={book?.img} width='226' height='349' alt='Book' />
                        :
                        <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226' height='349' alt='Book' />
                    }
                </div>
                <div className="mt-4">
                    <div className="ml-2">
                        <h2>{book?.title}</h2>
                        <h5 className="text-primary">{book?.author}</h5>
                        <p className="lead">{book?.description}</p>
                        <StarsReview rating={totalStars} size={32} />
                    </div>
                </div>
                <CheckOutAndReviewBox book={book} mobile={true} currentLoansCount={currentLoansCount}
                    isAuthenticated={authState?.isAuthenticated} isCheckedOut={isCheckedOut} checkoutBook={checkoutBook} isReviewLeft={isReviewLeft} submitReview={submitReview}/>
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
            </div>
        </div>
    )
}