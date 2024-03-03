import { ACTIONS } from '@app/rbac/commons';

const actions = {};
ACTIONS.map(resource => {
  actions[resource.code] = {
    code: resource.code,
    description: resource.description,
  };
});

export default actions;

// function createAction(code, description) {
//   return {
//     code: code,
//     description: description,
//   };
// }
// export default {
//   ALL: createAction('ALL', t('TAT_CA')),
//   CREATE: createAction('CREATE', t('THEM_MOI')),
//   READ: createAction('READ', 'Xem'),
//   UPDATE: createAction('UPDATE', t('CHINH_SUA')),
//   DELETE: createAction('DELETE', t('XOA')),
// };
