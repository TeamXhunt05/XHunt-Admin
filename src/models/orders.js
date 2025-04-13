import { addEditOrder, OrderList, deleteOrder, getOrderDetail, addEditAdminOrder, OrderListApprove, listAllProvince , VerifiedOrder} from '../services/api'
import { message } from 'antd';

export default {
  namespace: 'orders',

  state: {
    list: [],
    state_list: [],
    lga_list: [],
    count: 0,
    OrderMembers: [],
    detail: {}
  },

  effects: {
    *listData({ payload }, { call, put }) {
  
    
      const response = yield call(OrderList, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'list', ...response });
    },

    *listApprove({ payload }, { call, put }) {
  
    
      const response = yield call(OrderListApprove, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'approve_list', ...response });
    },



    *add({ payload , isAdmin}, { call, put }) {
   


      const response = yield call(addEditOrder, payload);
      if (response.status) { message.success(response.msg || response.message || response.err, 5); }
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      return response;
    },

    *edit({ payload }, { call, put }) {
      const response = yield call(addEditOrder, payload);
      if (response.status) { message.success(response.msg || response.message || response.err, 5); }
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'update', ...response });
      return response;
    },

    
    *addAdmin({ payload , isAdmin}, { call, put }) {
   


      const response = yield call(addEditAdminOrder, payload);
      if (response.status) { message.success(response.msg || response.message || response.err, 5); }
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      return response;
    },

    *editAdmin({ payload }, { call, put }) {
      const response = yield call(addEditAdminOrder, payload);
      if (response.status) { message.success(response.msg || response.message || response.err, 5); }
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'update', ...response });
      return response;
    },

    

    *getDetail({ payload }, { call, put }) {
      const response = yield call(getOrderDetail, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'viewDetail', ...response });
    },


    *delete({ payload }, { call, put }) {
      const response = yield call(deleteOrder, payload);
      if (response.status) { message.success(response.msg || response.message || response.err, 5); }
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'deleteData', ...payload, ...response });
    },

    *verify({ payload , isAdmin}, { call, put }) {
      const response = yield call(VerifiedOrder, payload);
      if (response.status) { message.success(response.msg || response.message || response.err, 5); }
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      return response;
    },

    *clearAction({ payload }, { call, put }) {
      yield put({ type: 'clear' });
    },
  },

  reducers: {
    list(state, action) {

  
      return { ...state, list: action.data ,count: action.count  };
    },
    approve_list(state, action) {

  
      return { ...state, list: action.data ,count: action.count  };
    },



    viewDetail(state, action) {
      console.log("🚀 ~ file: Orders.js:95 ~ viewDetail ~ action:", action)
      return { ...state, detail: action?.data,  };
    },

    deleteData(state, action) {
      let updatedList = state.list.filter(item => item._id != action._id);
      return { ...state, list: updatedList };
    },
  },
};