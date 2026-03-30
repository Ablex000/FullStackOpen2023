import { useState } from 'react'
import { useApolloClient, useSubscription } from '@apollo/client/react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'
import { ALL_BOOKS, BOOK_ADDED } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const client = useApolloClient()

  const notify = (message) => window.alert(message)

  useSubscription(BOOK_ADDED, {
    onData: ({ client: apolloClient, data }) => {
      const addedBook = data.data.bookAdded
      notify(`New book added: "${addedBook.title}" by ${addedBook.author.name}`)
      apolloClient.cache.updateQuery({ query: ALL_BOOKS }, (existing) => {
        if (!existing) return existing
        if (existing.allBooks.find((b) => b.id === addedBook.id)) return existing
        return { allBooks: [...existing.allBooks, addedBook] }
      })
    },
  })

  const logout = () => {
    setToken(null)
    localStorage.removeItem('library-user-token')
    client.resetStore()
    setPage('authors')
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {token && <button onClick={() => setPage('recommend')}>recommend</button>}
        {token
          ? <button onClick={logout}>logout</button>
          : <button onClick={() => setPage('login')}>login</button>
        }
      </div>

      <Authors show={page === 'authors'} token={token} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <Recommend show={page === 'recommend'} />

      <LoginForm
        show={page === 'login'}
        setToken={(t) => {
          setToken(t)
          setPage('authors')
        }}
      />
    </div>
  )
}

export default App
