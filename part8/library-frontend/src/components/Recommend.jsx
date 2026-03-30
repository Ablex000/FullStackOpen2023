import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS, ME } from '../queries'

const Recommend = (props) => {
  const booksResult = useQuery(ALL_BOOKS)
  const meResult = useQuery(ME)

  if (!props.show) {
    return null
  }

  if (booksResult.loading || meResult.loading) {
    return <div>loading...</div>
  }

  const favoriteGenre = meResult.data.me.favoriteGenre
  const books = booksResult.data.allBooks.filter((b) =>
    b.genres.includes(favoriteGenre)
  )

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favourite genre <strong>{favoriteGenre}</strong>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend
