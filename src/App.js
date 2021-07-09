import React, { Fragment, useEffect } from "react";
import "./ur.css";
import Roll, { newRoll } from "./components/Roll";
import Field, { shiftFigure, plusFigure } from "./components/Field";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { reset, resetRoll, setInfo, switchPlayer } from "./actions/actions";
import {
    randomRobotPlayer,
    defensiveRobotPlayer,
    pacifistRobotPlayer,
    aggressiveRobotPlayer,
    RANDOM_ROBOT_PLAYER,
    DEFENSIVE_ROBOT_PLAYER,
    PACIFIST_ROBOT_PLAYER,
    AGGRESSIVE_ROBOT_PLAYER,
} from "./actions/robots";
import { SELECTS_FIGURE, AWAITS_ROLL } from "./reducers/players";
import * as _ from "lodash";

export const mapIndex = (field) => Math.abs(parseInt(field.substring(1)));
export const mapField = (index, player) => {
    if (index < 5 || index > 12) {
        index = player === "blue" ? index : -index;
    }
    return "c" + index;
};
export const otherPlayer = (player) => (player === "blue" ? "green" : "blue");
export const nextPlayer = (dispatch, current) => {
    dispatch(switchPlayer());
    dispatch(setInfo(otherPlayer(current), ""));
    dispatch(resetRoll());
};
export const resetGame = (dispatch, current) => {
    dispatch(reset());
    dispatch(setInfo(current, ""));
    dispatch(setInfo(otherPlayer(current), ""));
    dispatch(resetRoll());
};

const App = () => {
    const current = useSelector((state) => state.current, shallowEqual);
    const players = useSelector((state) => state.players, shallowEqual);
    const dispatch = useDispatch();

    const robotMove = (players, current) => {
        let result;
        if (players[current].robot.type === RANDOM_ROBOT_PLAYER) {
            result = randomRobotPlayer(players, current);
        } else if (players[current].robot.type === DEFENSIVE_ROBOT_PLAYER) {
            result = defensiveRobotPlayer(players, current);
        } else if (players[current].robot.type === PACIFIST_ROBOT_PLAYER) {
            result = pacifistRobotPlayer(players, current);
        } else if (players[current].robot.type === AGGRESSIVE_ROBOT_PLAYER) {
            result = aggressiveRobotPlayer(players, current);
        } else {
            result = randomRobotPlayer(players, current);
        }

        newRoll(
            dispatch,
            _.cloneDeep(players),
            _.cloneDeep(current),
            result.roll
        );

        if (players[current].state === SELECTS_FIGURE && result.move) {
            if (result.move.field === 0) {
                plusFigure(dispatch, current, result.move.target);
            } else {
                shiftFigure(
                    dispatch,
                    players,
                    current,
                    mapField(result.move.field, current),
                    result.move.target
                );
            }

            if ([4, 8, 14].includes(result.move.target)) {
                robotMove(players, current);
            }
        } else if (players[current].state === AWAITS_ROLL && result.move) {
            if ([4, 8, 14].includes(result.move.target)) {
                robotMove(players, current);
            }
        }
    };

    useEffect(() => {
        if (players[current].robot.isRobot) {
            setTimeout(() => {
                robotMove(players, current);
            }, 200);
        }
    });

    return (
        <div>
            <table>
                <tbody>
                    <tr>
                        <td
                            className={
                                "score" +
                                (current === "green" ? " current" : "")
                            }
                            colSpan="8"
                        >
                            <h1>Player 1 {players.green.robot.type}</h1>
                            <h2>FIGURES ON START: {players.green.spare}</h2>
                            <h2>IN GAME: {players.green.inGame}</h2>
                            <h2>FIGURES ON END: {players.green.saved}</h2>
                            {current === "green" ? <Roll /> : ""}
                            <h3>
                                {players.green.info
                                    .split("|")
                                    .map((item, key) => {
                                        return (
                                            <Fragment key={key}>
                                                {item}
                                                <br />
                                            </Fragment>
                                        );
                                    })}
                            </h3>
                        </td>
                    </tr>
                    <tr>
                        <Field css="green extra" id="c-4" />
                        <Field css="green" id="c-3" />
                        <Field css="green" id="c-2" />
                        <Field css="green" id="c-1" />
                        <Field css="empty" content="&larr;" id="startGreen" />
                        <Field css="empty" id="c-15" />
                        <Field css="green extra" id="c-14" />
                        <Field css="green" id="c-13" />
                    </tr>
                    <tr>
                        <Field id="c5" />
                        <Field id="c6" />
                        <Field id="c7" />
                        <Field css="extra" id="c8" />
                        <Field id="c9" />
                        <Field id="c10" />
                        <Field id="c11" />
                        <Field id="c12" />
                    </tr>
                    <tr>
                        <Field css="blue extra" id="c4" />
                        <Field css="blue" id="c3" />
                        <Field css="blue" id="c2" />
                        <Field css="blue" id="c1" />
                        <Field css="empty" content="&larr;" id="startBlue" />
                        <Field css="empty" id="c15" />
                        <Field css="blue extra" id="c14" />
                        <Field css="blue" id="c13" />
                    </tr>
                    <tr>
                        <td
                            className={
                                "score" + (current === "blue" ? " current" : "")
                            }
                            colSpan="8"
                        >
                            <h1>Player 2 {players.blue.robot.type}</h1>
                            <h2>FIGURES ON START: {players.blue.spare}</h2>
                            <h2>IN GAME: {players.blue.inGame}</h2>
                            <h2>FIGURES ON END: {players.blue.saved}</h2>
                            {current === "blue" ? <Roll /> : ""}
                            <h3>
                                {players.blue.info
                                    .split("|")
                                    .map((item, key) => {
                                        return (
                                            <Fragment key={key}>
                                                {item}
                                                <br />
                                            </Fragment>
                                        );
                                    })}
                            </h3>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default App;
