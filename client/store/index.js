import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import auth from './auth'
import users from './users'
import trips from './trips'
import messages from './messages'
import friends from './friends'
import events from './events'
import expenses from './expenses'
import categories from './categories'
import userFriends from './userFriends'
import friendsPending from './friendsPending'

const reducer = combineReducers({ auth, users, trips, messages, friends, events, expenses, categories, userFriends, friendsPending })
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
export * from './auth'
export * from './users'
export * from './trips'
export * from './messages'
export * from './friends'
export * from './events'
export * from './expenses'
export * from './categories'
export * from './userFriends'
export * from './friendsPending'

