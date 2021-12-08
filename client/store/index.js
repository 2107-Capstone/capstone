import { createStore, combineReducers, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import auth from './auth'
import users from './users'
import usertrips from './usertrips'
import trips from './trips'
import messages from './messages'
import friends from './friends'
import events from './events'
import expenses from './expenses'
import categories from './categories'
import userFriends from './userFriends'
import friendsPendingSent from './friendsPendingSent'
import friendsPendingReceived from './friendsPendingReceived'
import userDebts from './userDebts'

const reducer = combineReducers({ auth, users, usertrips, trips, messages, friends, events, expenses, categories, userFriends, friendsPendingSent, friendsPendingReceived, userDebts })

const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
)
const store = createStore(reducer, middleware)

export default store
export * from './auth'
export * from './users'
export * from './usertrips'
export * from './trips'
export * from './messages'
export * from './friends'
export * from './events'
export * from './expenses'
export * from './categories'
export * from './userFriends'
export * from './friendsPendingSent'
export * from './friendsPendingReceived'
export * from './userDebts'


