import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS, BOOKS_BY_GENRE } from '../queries'

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState(null)
  const allBooksResult = useQuery(ALL_BOOKS)
  const filteredResult = useQuery(BOOKS_BY_GENRE, {
    variables: { genre: selectedGenre },
    skip: !selectedGenre,
    fetchPolicy: 'network-only',
  })

  if (!props.show) {
    return null
  }

  if (allBooksResult.loading) {
    return <div>loading...</div>
  }

  const genres = [...new Set(allBooksResult.data.allBooks.flatMap((b) => b.genres))]

  const filteredBooks = selectedGenre
    ? filteredResult.loading
      ? []
      : filteredResult.data?.allBooks ?? []
    : allBooksResult.data.allBooks

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGenre(g)}
            style={{ fontWeight: selectedGenre === g ? 'bold' : 'normal' }}
          >
            {g}
          </button>
        ))}
        <button
          onClick={() => setSelectedGenre(null)}
          style={{ fontWeight: !selectedGenre ? 'bold' : 'normal' }}
        >
          all genres
        </button>
      </div>
    </div>
  )
}

export default Books
