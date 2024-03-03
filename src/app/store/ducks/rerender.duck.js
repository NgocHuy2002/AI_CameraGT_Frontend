export const actionTypes = {
  SetRerenderToCongTac: 'Rerender/SetRerenderToCongTac',
  SetRerenderAnhViTri: 'Rerender/SetRerenderAnhViTri',
  SetRerenderKetQua: 'Rerender/SetRerenderKetQua',
};

const initialAuthState = {
  stateRerenderToCongTac: 0,
  stateRerenderAnhViTri: 0,
  stateRerenderKetQua: 0,
};
export const reducer = (state = initialAuthState, action) => {
  switch (action.type) {
    case actionTypes.SetRerenderToCongTac: {
      const { stateRerenderToCongTac } = state;
      return Object.assign({}, state, { stateRerenderToCongTac: stateRerenderToCongTac + 1 });
    }
    case actionTypes.SetRerenderAnhViTri: {
      const { stateRerenderAnhViTri } = state;
      return Object.assign({}, state, { stateRerenderAnhViTri: stateRerenderAnhViTri + 1 });
    }
    case actionTypes.SetRerenderKetQua: {
      const { stateRerenderKetQua } = state;
      return Object.assign({}, state, { stateRerenderKetQua: stateRerenderKetQua + 1 });
    }

    default:
      return state;
  }
};

export const actions = {
  rerenderToCongTac: () => ({ type: actionTypes.SetRerenderToCongTac }),
  rerenderAnhViTri: () => ({ type: actionTypes.SetRerenderAnhViTri }),
  rerenderKetQua: () => ({ type: actionTypes.SetRerenderKetQua }),
};

export function* saga() {
}
