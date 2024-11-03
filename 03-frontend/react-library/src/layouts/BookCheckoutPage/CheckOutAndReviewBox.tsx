import { Link } from "react-router-dom";
import BookModel from "../../models/BookModel";

export const CheckOutAndReviewBox: React.FC<{ book: BookModel | undefined, mobile: boolean, 
    currentLoansCount: number, isAuthenticated: any, isCheckedOut: boolean, checkoutBook: any}> = (props) => {

    const buttonRender = () => {
        if(props.isAuthenticated) {
            if(!props.isCheckedOut && props.currentLoansCount < 5) {
                return (
                    <button onClick={() => {props.checkoutBook()}} className="btn btn-success btn-lg">Checkout</button>
                )
            } else if(props.isCheckedOut) {
                return (
                    <p><b>Book checked out, enjoy!</b></p>
                )
            } else if(!props.isCheckedOut) { // book is not checked out but the user already has 5 books checked out
                return (<p className="text-danger">You've already checked out 5 books, return at least one book to make another checkout.</p>)
            }
        }
        return (<Link to={'/login'} className="btn btn-success btn-lg">Sign in</Link>)
    }
        
    return (
        <div className={props.mobile ? 'card d-flex mt-5': 'card col-3 container d'}>
            <div className="card-body container">
                <div className="mt-3">
                    <p>
                        <b>{props.currentLoansCount}/5 </b>
                        books checked out
                    </p>
                    <hr/>
                    {props.book && props.book.copiesAvailable && props.book.copiesAvailable > 0 ?
                        <h4 className="text-success">Available</h4>:
                        <h4 className="text-danger">Wait List</h4>
                    }
                    <div className="row">
                        <p className="col-6 lead">
                            <b>{props.book?.copies} </b> copies
                        </p>
                        <p className="col-6 lead">
                            <b>{props.book?.copiesAvailable} </b> available
                        </p>
                    </div>
                </div>
                {buttonRender()}
                <hr />
                <p className="mt-3">
                    This number can change until placing order has been complete.
                </p>
                <p>
                    Sign in to be able to leave a review.
                </p>
            </div>
        </div>
    )
}