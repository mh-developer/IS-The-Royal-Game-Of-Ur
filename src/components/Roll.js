import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    roll,
    addFigure,
    resetRoll,
    changeState,
    setAvailableMoves,
    setInfo,
} from "../actions/actions";
import { AWAITS_ROLL, SELECTS_FIGURE } from "../reducers/players";
import { mapField, mapIndex, nextPlayer } from "../App";

export const rollFlipped = () =>
    Math.floor(Math.random() * 2) +
    Math.floor(Math.random() * 2) +
    Math.floor(Math.random() * 2) +
    Math.floor(Math.random() * 2);

export const newRoll = (
    dispatch,
    players,
    currentPlayer,
    rollValue = rollFlipped()
) => {
    const rollResult = rollValue;

    dispatch(roll(rollResult));

    if (rollResult === 0) {
        dispatch(setInfo(currentPlayer, "Rolled 0|Losing Turn"));
        nextPlayer(dispatch, currentPlayer);
    } else {
        if (players[currentPlayer].figures.length === 0) {
            dispatch(
                addFigure(currentPlayer, mapField(rollResult, currentPlayer))
            );
            if (rollResult === 4) {
                dispatch(changeState(currentPlayer, AWAITS_ROLL));
                dispatch(setInfo(currentPlayer, "Special Field|Extra Turn"));
                dispatch(resetRoll());
            } else {
                nextPlayer(dispatch, currentPlayer);
            }
        } else {
            analyseBoard(dispatch, rollResult, players, currentPlayer);
        }
    }
};

const probabilityOfLooseFigure = (targetField, otherPlayerFigures) => {
    let probabilityOfLooseFigure = 0;

    const probabilitiesOfRollResult = {
        0: 1 / 2,
        1: 1 / 2,
        2: (1 / 2) * (1 / 2),
        3: (1 / 2) * (1 / 3),
        4: (1 / 2) * (1 / 4),
    };

    [1, 2, 3, 4].forEach((rollResult) => {
        otherPlayerFigures.forEach((value) => {
            const opponentTargetField = value + rollResult;
            if (opponentTargetField <= 12 && opponentTargetField >= 5) {
                if (targetField !== 8 && opponentTargetField === targetField) {
                    probabilityOfLooseFigure +=
                        probabilitiesOfRollResult[rollResult];
                }
            }
        });
    });

    return probabilityOfLooseFigure;
};

export const possibleMovesOfFigures = (players, currentPlayer, rollResult) => {
    let currentPlayerFigures = mapIndexes(players[currentPlayer].figures);
    const otherPlayerFigures = mapIndexes(
        players[currentPlayer === "blue" ? "green" : "blue"].figures
    );

    let possibleMoves = [];
    if (players[currentPlayer].spare > 0) {
        currentPlayerFigures.push(0);
    }

    currentPlayerFigures.forEach((value) => {
        const targetField = value + rollResult;
        if (targetField <= 15) {
            if (!currentPlayerFigures.includes(targetField)) {
                if (
                    targetField !== 8 ||
                    (targetField === 8 && !otherPlayerFigures.includes(8))
                ) {
                    possibleMoves.push({
                        field: value,
                        target: targetField,
                        rollResult: rollResult,
                        probability:
                            targetField >= 5 &&
                            targetField <= 12 &&
                            targetField !== 8
                                ? probabilityOfLooseFigure(
                                      targetField,
                                      otherPlayerFigures
                                  )
                                : 0,
                    });
                }
            }
        }
    });

    return possibleMoves;
};

const mapIndexes = (fields) => fields.map((value) => mapIndex(value));

const analyseBoard = (dispatch, rollResult, players, currentPlayer) => {
    let possibleMoves = possibleMovesOfFigures(
        players,
        currentPlayer,
        rollResult
    );

    if (possibleMoves.length === 0) {
        dispatch(setInfo(currentPlayer, "No Moves Available"));
        dispatch(changeState(currentPlayer, AWAITS_ROLL));
        nextPlayer(dispatch, currentPlayer);
    } else {
        dispatch(changeState(currentPlayer, SELECTS_FIGURE));
        dispatch(setAvailableMoves(currentPlayer, possibleMoves));
    }
};

const Roll = () => {
    const rollValue = useSelector((state) => state.roll);
    const currentPlayer = useSelector((state) => state.current);
    const players = useSelector((state) => state.players);
    const dispatch = useDispatch();

    return (
        <div>
            {rollValue === null ? (
                <button
                    onClick={() => newRoll(dispatch, players, currentPlayer)}
                >
                    ROLL
                </button>
            ) : (
                ""
            )}
            <h1 className="roll">{rollValue}</h1>
        </div>
    );
};

export default Roll;
