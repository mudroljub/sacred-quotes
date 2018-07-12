import React, {Component} from 'react'
import {connect} from 'react-redux'

import {setUser} from '../store/actions'
import translate from '../shared/translate'
import {LS} from '../config/localstorage'
import {API, domain} from '../config/api'

class Profile extends Component  {
  constructor(props) {
    super(props)
    this.state = {
      voted: [],
      createdAt: null
    }
  }

  componentDidMount() {
    const token = localStorage.getItem(LS.token)
    if (!token) return
    const service = localStorage.getItem(LS.service)
    const googleAuthLink = `${domain}/auth/${service}/${token}`
    fetch(googleAuthLink)
      .then(data => data.json())
      .then(data => {
        const {name, admin, createdAt, voted} = data.user
        this.setState({createdAt})
        console.log(token, admin, name)
        this.props.setUser(token, admin, name)
        if (voted) this.syncVotes(token, voted)
      })
  }

  syncVotes(token, remoteVotes) {
    const localVotes = JSON.parse(localStorage.getItem(LS.ratings))
    if (!localVotes || !localVotes.length) return
    const voted = [...new Set(localVotes, remoteVotes)]
    fetch(API.updateUserVotes, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({token, voted})
    })
    this.updateLocalVotes(voted)
  }

  updateLocalVotes(voted) {
    this.setState({voted})
    localStorage.setItem(LS.ratings, JSON.stringify(voted))
  }

  logout = e => {
    this.props.setUser('')
    localStorage.setItem(LS.token, '')
  }

  render() {
    return (
      <main>
        <h1>{translate('PROFILE')}</h1>
        {this.props.token ?
          <div>
            <p>name: {this.props.name}</p>
            <p>member since: {new Date(this.state.createdAt).toISOString().slice(0, 10)}</p>
            <p>quotes voted: {this.state.voted.length}</p>
            <p>admin: {this.props.admin ? 'yes' : 'no'}</p>
            <button onClick={this.logout}>{translate('LOGOUT')}</button>
          </div>
          : <p>{translate('SUCCESSFULLY_LOGOUT')}</p>
        }
      </main>
    )
  }
}

const mapStateToProps = ({token, admin, name}) => ({token, admin, name})
const mapDispatchToProps = {setUser}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)