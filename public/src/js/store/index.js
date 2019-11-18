import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/';

//同步方式
//let store = createStore(rootReducer);
//谷歌浏览器调试redux
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let store = createStore(rootReducer, composeEnhancers(
    applyMiddleware(thunk),
));



function handleChange() {
}
store.subscribe(handleChange);

export default store;