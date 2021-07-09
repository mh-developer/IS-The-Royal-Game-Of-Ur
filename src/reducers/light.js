import { LIGHT_ON, LIGHT_OFF } from "../actions/actions";

const lightReducer = (state = null, action) => {
    switch (action.type) {
        case LIGHT_OFF:
            return null;
        case LIGHT_ON:
            return {
                player: action.player,
                target: action.target,
                probability: action.probability
            };
        default:
            return state;
    }
};
export default lightReducer;
