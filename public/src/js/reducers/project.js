import * as TYPE from '../libs/constTYPE';
import objectAssign from '../libs/objectAssign';
objectAssign();

const initState = {
    currentSort: 0,   //当前分类
    keywords: '',    //搜索关键词
    currentArticle: 0,    //当前文章id
};

export default function header(state = initState, action) {
    switch (action.type) {
        case TYPE.SET_CURRENT_SORT:
            return Object.assign({}, state, {currentSort: action.val});
            break;

        case TYPE.SET_CURRENT_ARTICLE:
            return Object.assign({}, state, {currentArticle: action.val});
            break;

        case TYPE.SET_KEYWORDS:
            return Object.assign({}, state, {keywords: action.val});
            break;

        default:
            return state
    }
}