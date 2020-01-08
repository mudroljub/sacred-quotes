import React from 'react'
import {Link} from 'react-router-dom'

import {useAuthorName} from '../../store/actions'
import unknownImage from '../../assets/images/unknown.jpg'
import './AuthorThumb.css'

const AuthorThumb = ({ author, image, handleCheck }) => {
  const authorName = useAuthorName()
  const link = `/author/${author.replace(/ /g, '_')}`

  return (
    <div className="author-wrap">
      <Link className="author" to={link}>
        <img src={image || unknownImage} alt="author" />
        {authorName(author)}
      </Link>
      <label>
        <input type="checkbox" value={author} onChange={handleCheck} />
      </label>
    </div>
  )
}

export default AuthorThumb
