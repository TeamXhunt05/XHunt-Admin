import { addEditPin, PinList, deletePin, getPinDetail, addEditPinAdmin, stateListForPin, listAllProvince} from '../services/api'
import { message } from 'antd';

export default {
  namespace: 'pins',

  state: {
    list: [],
    state_list: [],
    lga_list: [],
    count: 0,
    PinMembers: [],
    detail: {},
    product: [],

  },

  effects: {
    *listData({ payload }, { call, put }) {
  
    
      const response = yield call(PinList, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'list', ...response });
    },



    *add({ payload }, { call, put }) {
      const response = yield call(addEditPin, payload);
      if (response.status) { message.success(response.msg || response.message || response.err, 5); }
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      return response;
    },

    *edit({ payload }, { call, put }) {
      const response = yield call(addEditPin, payload);
      if (response.status) { message.success(response.msg || response.message || response.err, 5); }
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'update', ...response });
      return response;
    },
    *addAdmin({ payload }, { call, put }) {
      const response = yield call(addEditPinAdmin, payload);
      if (response.status) { message.success(response.msg || response.message || response.err, 5); }
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      return response;
    },

    *editAdmin({ payload }, { call, put }) {
      const response = yield call(addEditPinAdmin, payload);
      if (response.status) { message.success(response.msg || response.message || response.err, 5); }
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'update', ...response });
      return response;
    },

    *getDetail({ payload }, { call, put }) {
      const response = yield call(getPinDetail, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'detail', ...response });
    },


    *delete({ payload }, { call, put }) {
      const response = yield call(deletePin, payload);
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

  
      return { ...state, list: action.data ,count: action.count  };
    },



    detail(state, action) {
      return { ...state, detail: action?.detail,  product: action?.product };
    },

    deleteData(state, action) {
      let updatedList = state.list.filter(item => item._id != action._id);
      return { ...state, list: updatedList };
    },
  },
};