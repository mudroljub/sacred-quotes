import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import {deleteQuote, useTranslate, useTransliterate, useAuthorName, addFavorite, removeFavorite} from '../../store/actions'
import './quote.css'

const Quote = ({ quote, showSource, cssClass }) => {
  const {lang, phrase, minLength, maxLength, favorites} = useSelector(state => state)
  const dispatch = useDispatch()
  const translate = useTranslate()
  const transliterate = useTransliterate()
  const getName = useAuthorName()
  const [shouldDelete, setShouldDelete] = useState(false)

  const quoteTxt = transliterate(quote[lang])
  const translitPhrase = transliterate(phrase)
  const text = phrase
    ? quoteTxt.replace(translitPhrase, `<span class='red'>${translitPhrase}</span>`)
    : quoteTxt

  const {_id, author} = quote
  const authorLink = `/avtor/${author.replace(/ /g, '_')}`
  const deleteCss = `pointer ${shouldDelete ? 'red' : ''}`

  const doDelete = () => {
    dispatch(deleteQuote(_id))
    setShouldDelete(false)
  }

  const tryDelete = () => {
    if (shouldDelete) doDelete()
    setShouldDelete(true)
  }

  const addFav = () => {
    const action = favorites.includes(_id) ? removeFavorite : addFavorite
    dispatch(action(_id))
  }

  const favIcon = favorites.includes(_id) ? '★' : '☆'

  const percent = (quoteTxt.length - minLength) / (maxLength - minLength)

  let gridClass = ''
  let fontSize = undefined

  if (!cssClass) {
    if (percent > .6) gridClass = 'uspravan'
    if (percent < 0.1) fontSize = '1.4em'
  }

  return (
    <blockquote className={cssClass || `small-quote ${gridClass}`}>
      <span style={{float: 'right', marginLeft: '4px'}} onClick={addFav} className="pointer">{favIcon}</span>
      <p
        className="quote-text"
        style={{fontSize}}
        dangerouslySetInnerHTML={{__html: text || translate('NO_TRANSLATION')}}
      >
      </p>
      <span className="icons">
        <Link to={`/citat/${_id}`} className="no-link">↠</Link>&nbsp;
        <span>
          <Link to={`/pravi-citat/${_id}`}><span className="edit-icon">&#9998;</span></Link>&nbsp;
          <span onClick={tryDelete} className={deleteCss}>&#10005;</span>
        </span>
      </span>
      <span className="quote-author"> — <Link to={authorLink}>{getName(author)}</Link></span>

      {showSource && quote.source &&
        <p className="more-info">
          <small>{translate('SOURCE')}:</small>{' '}<small className="source-value">{quote.source}</small>{' '}
          {quote.wiki &&
            <small><a href={quote.wiki} target="_blank" rel="noopener noreferrer">(wiki)</a></small>
          }
        </p>
      }
    </blockquote>
  )
}

export default Quote
