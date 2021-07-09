import {
    SAVE,
    ADD_FIGURE,
    CHANGE_STATE,
    AVAILABLE_MOVES,
    MOVE_FIGURE,
    REMOVE_FIGURE,
    INFO,
    RESET,
} from "../actions/actions";
import {
    RANDOM_ROBOT_PLAYER,
    DEFENSIVE_ROBOT_PLAYER,
    PACIFIST_ROBOT_PLAYER,
    AGGRESSIVE_ROBOT_PLAYER,
} from "../actions/robots";

export const AWAITS_ROLL = "AWAITS_ROLL";
export const SELECTS_FIGURE = "SELECTS_FIGURE";

const isBlueRobot = false;
const isGreenRobot = true;

const initialState = {
    blue: {
        saved: 0,
        inGame: 0,
        spare: 7,
        info: "",
        state: AWAITS_ROLL,
        robot: { isRobot: isBlueRobot, type: "REAL_PLAYER" },
        moves: [],
        figures: [],
    },
    green: {
        saved: 0,
        inGame: 0,
        spare: 7,
        info: "",
        robot: { isRobot: isGreenRobot, type: AGGRESSIVE_ROBOT_PLAYER },
        state: AWAITS_ROLL,
        moves: [],
        figures: [],
    },
};

const playersReducer = (state = initialState, action) => {
    let playerState = {};

    if (action.type === ADD_FIGURE) {
        playerState[action.player] = state[action.player];
        playerState[action.player].figures.push(action.spot);
        playerState[action.player].spare = state[action.player].spare - 1;
        playerState[action.player].inGame = state[action.player].inGame + 1;
        return Object.assign({}, state, playerState);
    } else if (action.type === SAVE) {
        playerState[action.player] = state[action.player];
        playerState[action.player].saved = state[action.player].saved + 1;
        playerState[action.player].spare = state[action.player].spare - 1;
        return Object.assign({}, state, playerState);
    } else if (action.type === CHANGE_STATE) {
        playerState[action.player] = state[action.player];
        playerState[action.player].state = action.state;
        return Object.assign({}, state, playerState);
    } else if (action.type === AVAILABLE_MOVES) {
        playerState[action.player] = state[action.player];
        playerState[action.player].moves = action.moves;
        return Object.assign({}, state, playerState);
    } else if (action.type === MOVE_FIGURE) {
        playerState[action.player] = state[action.player];
        let replacedFigures = [];
        state[action.player].figures.forEach((figure) => {
            if (figure !== action.from) {
                replacedFigures.push(figure);
            }
        });
        replacedFigures.push(action.to);
        playerState[action.player].figures = replacedFigures;
        return Object.assign({}, state, playerState);
    } else if (action.type === REMOVE_FIGURE) {
        playerState[action.player] = state[action.player];
        let reducedFigures = [];
        state[action.player].figures.forEach((figure) => {
            if (figure !== action.field) {
                reducedFigures.push(figure);
            }
        });
        playerState[action.player].figures = reducedFigures;
        playerState[action.player].inGame = state[action.player].inGame - 1;
        playerState[action.player].spare = state[action.player].spare + 1;
        return Object.assign({}, state, playerState);
    } else if (action.type === INFO) {
        playerState[action.player] = state[action.player];
        playerState[action.player].info = action.info;
        return Object.assign({}, state, playerState);
    } else if (action.type === RESET) {
        return {
            blue: {
                saved: 0,
                inGame: 0,
                spare: 7,
                info: "",
                state: AWAITS_ROLL,
                robot: { isRobot: isBlueRobot, type: "REAL_PLAYER" },
                moves: [],
                figures: [],
            },
            green: {
                saved: 0,
                inGame: 0,
                spare: 7,
                info: "",
                state: AWAITS_ROLL,
                robot: { isRobot: isGreenRobot, type: "REAL_PLAYER" },
                moves: [],
                figures: [],
            },
        };
    } else {
        return state;
    }
};
export default playersReducer;
