export const actionTypes = {
  SetModuleApp: 'Module/SetModuleApp',
  ClearModuleApp: 'Module/ClearModuleApp',
};

const initialAuthState = {
  moduleApp: null,
};
export const reducer = (state = initialAuthState, action) => {
  switch (action.type) {
    case actionTypes.SetModuleApp: {
      const { moduleApp } = action.payload;
      localStorage.setItem('moduleApp', moduleApp);
      return Object.assign({}, state, { moduleApp });
    }
    case actionTypes.ClearModuleApp: {
      localStorage.removeItem('moduleApp');
      return initialAuthState
    }
    default:
      return state;
  }
};

export const actions = {
  setModuleApp: (moduleApp) => ({ type: actionTypes.SetModuleApp, payload: { moduleApp } }),
  clearModuleApp: () => ({ type: actionTypes.ClearModuleApp }),
};

export function* saga() {
}
