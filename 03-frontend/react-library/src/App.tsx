import React from 'react';
import './App.css';
import { Homepage } from './layouts/HomePage/Homepage';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { SearchBooksPage } from './layouts/SearchBooksPage/SearchBooksPage';
import { Redirect, Route, Switch } from 'react-router-dom';
import { BookCheckOutPage } from './layouts/BookCheckoutPage/BookCheckoutPage';

export const App = () => {
	return (
		<div className='d-flex flex-column min-vh-100'>
			<Navbar />
			<div className='flex-grow-1'>
				<Switch>
					<Route path='/' exact>
						<Redirect to='/home' />
					</Route>
					<Route path='/home'>
						<Homepage />
					</Route>
					<Route path='/search'>
						<SearchBooksPage />
					</Route>
					<Route path='/checkout/:bookId'>
						<BookCheckOutPage />
					</Route>
				</Switch>
			</div>
			<Footer />
		</div>
	);
}
