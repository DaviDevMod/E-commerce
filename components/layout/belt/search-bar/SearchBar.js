import { useState } from 'react';
import { useRouter } from 'next/router';

import classes from './SearchBar.module.css';

function SearchBar() {

  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();

  const submitHandler = event => {
    event.preventDefault();
    router.push('/search/' + (searchValue.trim() ? searchValue : 'space'));
  };

  return (
    <form role='search' className={classes.search_bar} onSubmit={submitHandler}>
      <input
        aria-label='Search a product'
        id='search'
        name='search'
        type='text'
        spellCheck='false'
        value={searchValue}
        onChange={event => setSearchValue(event.target.value)}
      />
      <button aria-label='Search a button' type='submit' className={classes.icon}>
        <svg width='1.75em' height='1.75em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      </button>
    </form>
  );
}

export default SearchBar;