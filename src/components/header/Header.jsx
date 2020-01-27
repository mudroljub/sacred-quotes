import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

import {setLang, setScript, useTranslate, init} from '../../store/actions'
import './Header.css'

const Header = () => {
  const {lang, token, admin, script} = useSelector(state => state)
  const dispatch = useDispatch()
  const translate = useTranslate()

  const changeLang = e => {
    dispatch(setLang(e.target.value))
    dispatch(init())
  }

  const changeScript = e => {
    dispatch(setScript(e.target.value))
  }

  return (
    <header id="header">
      <div className='site-info'>
        <h3>{translate('APP_NAME')} <span role="img" aria-label="vatra">🔥</span></h3> <small className='info-text'>{translate('HEADER_TEXT')}</small>
      </div>
      <div className="header-main">
        <nav>
          <NavLink to="/" replace={true} activeClassName="active" exact>{translate('QUOTE_OF_THE_DAY')}</NavLink>
          <NavLink to="/citati" activeClassName="active">{translate('ALL_QUOTES')}</NavLink>
          {admin && <NavLink to="/dodaj-citat" activeClassName="active">{translate('ADD_QUOTE')}</NavLink>}
          {token
            ? <NavLink to="/moj-profil" activeClassName="active">{translate('PROFILE')}</NavLink>
            : <NavLink to="/prijava" activeClassName="active">{translate('LOGIN')}</NavLink>
          }
        </nav>
        <div className="choose-lang">
          <label htmlFor="jezyk">{translate('LANGUAGE')}: </label>
          <select id="jezyk" onChange={changeLang} value={lang}>
            <option value="ms">{translate('INTERSLAVIC')}</option>
            <option value="sr">{translate('SERBOCROATIAN')}</option>
          </select>
          <label htmlFor="pismo">{translate('SCRIPT')}: </label>
          <select id="pismo" onChange={changeScript} value={script}>
            <option value="kir">кирилица</option>
            <option value="lat">latinica</option>
          </select>
        </div>
      </div>
    </header>
  )}

export default Header
