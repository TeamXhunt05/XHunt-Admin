import { addEditStore, StoreList, deleteStore, getStoreDetail, addEditAdminStore, StoreListApprove, listAllProvince} from '../services/api'
import { message } from 'antd';

export default {
  namespace: 'stores',

  state: {
    list: [],
    state_list: [],
    lga_list: [],
    count: 0,
    StoreMembers: [],
    detail: {}
  },

  effects: {
    *listData({ payload }, { call, put }) {
  
    
      const response = yield call(StoreList, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'list', ...response });
    },

    *listApprove({ payload }, { call, put }) {
  
    
      const response = yield call(StoreListApprove, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'approve_list', ...response });
    },



    *add({ payload , isAdmin}, { call, put }) {
   


      const response = yield call(addEditStore, payload);
      if (response.status) { message.success(response.msg || response.message || response.err, 5); }
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      return response;
    },

    *edit({ payload }, { call, put }) {
      const response = yield call(addEditStore, payload);
      if (response.status) { message.success(response.msg || response.message || response.err, 5); }
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'update', ...response });
      return response;
    },

    
    *addAdmin({ payload , isAdmin}, { call, put }) {
   


      const response = yield call(addEditAdminStore, payload);
      if (response.status) { message.success(response.msg || response.message || response.err, 5); }
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      return response;
    },

    *editAdmin({ payload }, { call, put }) {
      const response = yield call(addEditAdminStore, payload);
      if (response.status) { message.success(response.msg || response.message || response.err, 5); }
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'update', ...response });
      return response;
    },

    

    *getDetail({ payload }, { call, put }) {
      const response = yield call(getStoreDetail, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'viewDetail', ...response });
    },


    *delete({ payload }, { call, put }) {
      const response = yield call(deleteStore, payload);
      if (response.status) { message.success(response.msg || response.message || response.err, 5); }
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'deleteData', ...payload, ...response });

      return response
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
      console.log("🚀 ~ file: stores.js:95 ~ viewDetail ~ action:", action)
      return { ...state, detail: action?.data,  };
    },

    deleteData(state, action) {
      let updatedList = state.list.filter(item => item._id != action._id);
      return { ...state, list: updatedList };
    },
  },
};