import { addEditProduct, ProductList, deleteProduct, getProductDetail, addEditProductAdmin, stateListForProduct, listAllProvince} from '../services/api'
import { message } from 'antd';

export default {
  namespace: 'products',

  state: {
    list: [],
    state_list: [],
    lga_list: [],
    count: 0,
    ProductMembers: [],
    detail: {},
    pin_detail : {}
  },

  effects: {
    *listData({ payload }, { call, put }) {
  
    
      const response = yield call(ProductList, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'list', ...response });
    },



    *add({ payload }, { call, put }) {
      const response = yield call(addEditProduct, payload);
      if (response.status) { message.success(response.msg || response.message || response.err, 5); }
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      return response;
    },

    

    *edit({ payload }, { call, put }) {
      const response = yield call(addEditProduct, payload);
      if (response.status) { message.success(response.msg || response.message || response.err, 5); }
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'update', ...response });
      return response;
    },
    *addAdmin({ payload }, { call, put }) {
      const response = yield call(addEditProductAdmin, payload);
      if (response.status) { message.success(response.msg || response.message || response.err, 5); }
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      return response;
    },

    *editAdmin({ payload }, { call, put }) {
      const response = yield call(addEditProductAdmin, payload);
      if (response.status) { message.success(response.msg || response.message || response.err, 5); }
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'update', ...response });
      return response;
    },

    *getDetail({ payload }, { call, put }) {
      const response = yield call(getProductDetail, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'viewDetail', ...response });
    },


    *delete({ payload }, { call, put }) {
      const response = yield call(deleteProduct, payload);
      if (response.status) { message.success(response.msg || response.message || response.err, 5); }
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'deleteData', ...payload, ...response });
    },

    *clearAction({ payload }, { call, put }) {
      yield put({ type: 'clear' });
    },
  },

  reducers: {
    list(state, action) {

  
      return { ...state, list: action.data ,count: action.count  ,pin_detail: action.pin_detail };
    },



    viewDetail(state, action) {
      return { ...state, detail: action?.data, ProductMembers: action?.ProductMembers };
    },

    deleteData(state, action) {
      let updatedList = state.list.filter(item => item._id != action._id);
      return { ...state, list: updatedList };
    },
  },
};