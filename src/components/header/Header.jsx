import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

import {setLang, setScript, useTranslate, init} from '../../store/actions'
import './header.css'

const Header = () => {
  const {lang, script} = useSelector(state => state)
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
      <div className='header-info'>
        <h3>{translate('APP_NAME')} ❁</h3> <small className='info-text'>{translate('HEADER_TEXT')}</small>
      </div>

      <nav>
        <NavLink to="/" replace={true} activeClassName="active" exact>{translate('QUOTE_OF_THE_DAY')}</NavLink>
        <NavLink to="/citati" activeClassName="active">{translate('ALL_QUOTES')}</NavLink>
        <NavLink to="/dodaj-citat" activeClassName="active">{translate('ADD_QUOTE')}</NavLink>
        <NavLink to="/orudja" activeClassName="active">{translate('TOOLS')}</NavLink>
      </nav>

      <div className="header-lang">
        <label htmlFor="jezyk">{translate('LANGUAGE')}: </label>
        <select id="jezyk" onChange={changeLang} value={lang}>
          <option value="ocs">{translate('OLDSLAVIC')}</option>
          <option value="sr">{translate('SERBOCROATIAN')}</option>
          <option value="ms">{translate('INTERSLAVIC')}</option>
        </select>
        <label htmlFor="pismo">{translate('SCRIPT')}: </label>
        <select id="pismo" onChange={changeScript} value={script}>
          <option value="kir">кирилица</option>
          <option value="lat">latinica</option>
        </select>
      </div>
    </header>
  )}

export default Header
