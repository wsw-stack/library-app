export class ReviewRequest {
    rating: number
    bookId: number
    reviewDescription?: string // can be null so there is a '?'

    constructor(rating: number, bookId: number, reviewDescription: string) {
        this.rating = rating
        this.bookId = bookId
        this.reviewDescription = reviewDescription
    }
}