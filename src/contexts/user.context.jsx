import { createContext, useEffect, useReducer } from 'react';

import {
  onAuthStateChangedListener,
  createUserDocumentFromAuth,
} from '../utils/firebase/firebase.utils';

import { createAction } from '../utils/reducer/reducer.utils';

export const UserContext = createContext({
  setCurrentUser: () => null,
  currentUser: null,
});
const USER_ACTION = {
  SET_CURRENT_USER: 'SET_CURRENT_USER',
};
const userReducer = (state, action) => {
  console.log('userReducer...');
  const { type, payload } = action;
  switch (type) {
    case USER_ACTION.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: payload,
      };
    default:
      throw new Error(`Unhandle type ${action} in userReducer. `);
  }
};

const INITIAL_STATE = {
  currentUser: null,
};
export const UserProvider = ({ children }) => {
  //const [currentUser, setCurrentUser] = useState(null);

  const [{ currentUser }, dispatch] = useReducer(userReducer, INITIAL_STATE);
  console.log(`currentUser ${currentUser}`);
  const setCurrentUser = (user) => {
    console.log('setCurrentUser...');
    dispatch(createAction(USER_ACTION.SET_CURRENT_USER, user));
  };
  const value = { currentUser, setCurrentUser };

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (user) {
        createUserDocumentFromAuth(user);
      }
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
