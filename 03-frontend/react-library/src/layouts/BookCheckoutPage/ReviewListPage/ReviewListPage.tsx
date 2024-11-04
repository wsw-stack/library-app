import { useEffect, useState } from "react"
import ReviewModel from "../../../models/ReviewModel"
import { SpinnerLoading } from "../../Utils/SpinnerLoading"
import { Review } from "../../Utils/Review"
import { Pagination } from "../../Utils/Pagination"

export const ReviewListPage = () => {
    const [reviews, setReviews] = useState<ReviewModel[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [httpError, setHttpError] = useState(null)

    // Pagination
    const [currPage, setCurrPage] = useState(1)
    const [reviewsPerPage, setReviewsPerPage] = useState(5)
    const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    // the book id we are looking for
    const bookId = (window.location.pathname).split('/')[2]

    useEffect(() => {
        const fetchBookReviews = async () => {
            const reviewUrl: string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}&page=${currPage-1}&size=${reviewsPerPage}`
            const responseReviews = await fetch(reviewUrl)
            if (!responseReviews.ok) {
                throw new Error('Someting went wrong!')
            }
            const responseJsonReviews = await responseReviews.json()
            const responseData = responseJsonReviews._embedded.reviews
            setTotalAmountOfReviews(responseJsonReviews.page.totalElements)
            setTotalPages(responseJsonReviews.page.totalPages)

            const loadedReviews: ReviewModel[] = []

            for (const key in responseData) {
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    book_id: responseData[key].bookId, // use the column name defined in the backend
                    reviewDescription: responseData[key].reviewDescription
                })
            }
            setReviews(loadedReviews)
            setIsLoading(false)
        }

        fetchBookReviews().catch((error: any) => {
            setIsLoading(false)
            setHttpError(error.message)
        })
    }, [currPage])

    if(isLoading) {
        return <SpinnerLoading />
    }

    if(httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        )
    }

    const indexOfLastReviews: number = currPage * reviewsPerPage
    const indexOfFirstReview: number = indexOfLastReviews - reviewsPerPage
    let lastItem = currPage * reviewsPerPage <= totalAmountOfReviews ? currPage * reviewsPerPage : totalAmountOfReviews

    const paginate = (pageNumber: number) => setCurrPage(pageNumber)

    return (
        <div className="container m-5">
            <div>
                <h3>Comments: ({reviews.length})</h3>
            </div>
            <p>
                {indexOfFirstReview + 1} to {lastItem} of {totalAmountOfReviews} items
            </p>
            <div className="row">
                {reviews.map(review => (
                    <Review review={review} key={review.id}/>
                ))}
            </div>
            {totalPages > 1 && <Pagination currentPage={currPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
    )
}