import { useSelector } from 'react-redux'

import quotes from '../data/quotes.json'
import translations from '../data/translations'
import {getThumbnails, getName} from '../utils/helpers'
import transliterate from '../utils/transliterate'
import {LS} from '../config/localstorage'
import {API, domain} from '../config/api'

const init = quotes => ({type: 'INIT', quotes})

const fetchQuotesRequest = () => ({type: 'FETCH_QUOTES_REQUEST'})

const fetchQuotesFailure = error => ({type: 'FETCH_QUOTES_FAILURE', error})

const fetchQuotesSuccess = () => ({type: 'FETCH_QUOTES_SUCCESS'})

const setThumbnails = thumbnails => ({type: 'SET_THUMBNAILS', thumbnails})

export const setLang = lang => {
  localStorage.setItem(LS.lang, lang)
  return { type: 'SET_LANGUAGE', lang }
}

export const setScript = script => {
  localStorage.setItem(LS.script, script)
  return { type: 'SET_SCRIPT', script }
}

export const setToken = token => ({type: 'SET_TOKEN', token})

export const setAdmin = admin => ({type: 'SET_ADMIN', admin})

export const addQuote = quote => ({type: 'ADD_QUOTE', quote})

export const updateQuote = quote => ({type: 'UPDATE_QUOTE', quote})

export const deleteQuote = _id => ({type: 'DELETE_QUOTE', _id})

export const filterAuthors = phrase => ({type: 'FILTER_AUTHORS', phrase})

export const filterQuotes = phrase => ({type: 'FILTER_QUOTES', phrase})

/* THUNK */

export const setUser = (token, admin = false) => dispatch => {
  dispatch(setToken(token))
  dispatch(setAdmin(admin))
}

export const logout = () => dispatch => {
  dispatch(setToken(''))
  dispatch(setAdmin(false))
}

export const getAuthorThumbs = allAuthors => dispatch => {
  const wikiApiLimit = 50
  const promises = []
  for (let i = 0; i < [...allAuthors].length; i += wikiApiLimit)
    promises.push(getThumbnails([...allAuthors].slice(i, i + wikiApiLimit)))
  Promise.all(promises)
    .then(data =>
      dispatch(setThumbnails(data.reduce((a, b) => new Map([...a, ...b]))))
    )
}

export const fetchQuotes = () => async dispatch => {
  dispatch(fetchQuotesRequest(API.read))
  try {
    const response = await fetch(API.read)
    const quotes = await response.json()
    dispatch(fetchQuotesSuccess())
    dispatch(init(quotes))
  } catch (error) {
    console.log('nema interneta, ucitavam backup')
    dispatch(init(quotes))
    dispatch(fetchQuotesFailure(error))
  }
}

export const checkUser = () => (dispatch, getState) => {
  const {token} = getState()
  if (!token) return
  const service = localStorage.getItem(LS.service)
  fetch(`${domain}/auth/${service}/${token}`)
    .then(response => response.json())
    .then(response => {
      dispatch(setUser(
        response.user ? token : '',
        response.user ? response.user.admin : false)
      )
    })
}

/* SELECTORS */

export const useTranslate = () => {
  const {lang, script} = useSelector(state => state)
  return key => (translations[lang][key])
    ? transliterate(translations[lang][key], script, lang)
    : key
}

export const useTransliterate = () => {
  const {lang, script} = useSelector(state => state)
  return text => transliterate(text, script, lang)
}

export const useAuthorName = () => {
  const { script, lang } = useSelector(state => state)
  return author => {
    const name = getName(author, lang)
    return transliterate(name, script, lang)
  }
}
