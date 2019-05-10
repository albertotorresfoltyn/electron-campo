const DO_SOMETHING = 'DO_SOMETHING';

export function resetActivities() {
return {
    type: DO_SOMETHING,
};
}

const initialState = {
    value: 0
}

export default function reduce(state = initialState, action) {
    switch (action.type) {
        case 'DO_SOMETHING':
        {
          return { ...state };
        }
        default:
            return state;
    }
};