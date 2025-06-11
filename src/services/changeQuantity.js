export default function changeQuantity(state, action) {
  const newState = { ...state }

  switch (action.type) {

    case 'add':
      newState.total++;
      if (newState[action.item.id]) {
        newState[action.item.id].quantity++;
        console.log('newState after add = ', newState)
        return newState;

      } else {
        newState[action.item.id] = action.item;
        newState[action.item.id].quantity = 1;
        console.log('newState after add = ', newState)
        return newState;
      }

    case "remove":
      newState.total--;
      if (newState[action.item.id].quantity === 1) {
        delete newState[action.item.id];
        return newState;

      } else {
        newState[action.item.id].quantity--;
        return newState;
      }

    case "clear":
      newState.total = newState.total - newState[action.item.id].quantity;
      delete newState[action.item.id];
      return newState;

    case "resetAll":
      return { total: 0 };

    default:
      return newState;
  }

}