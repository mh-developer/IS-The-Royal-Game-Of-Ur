import { rollFlipped, possibleMovesOfFigures } from "../components/Roll";
import { mapIndex } from "../App";

export const RANDOM_ROBOT_PLAYER = "RANDOM_ROBOT_PLAYER";
export const DEFENSIVE_ROBOT_PLAYER = "DEFENSIVE_ROBOT_PLAYER";
export const PACIFIST_ROBOT_PLAYER = "PACIFIST_ROBOT_PLAYER";
export const AGGRESSIVE_ROBOT_PLAYER = "AGGRESSIVE_ROBOT_PLAYER";

export const randomRobotPlayer = (players, currentPlayer) => {
    const newRollFlipped = rollFlipped();
    const robotPlayerPossibleMoves = possibleMovesOfFigures(
        players,
        currentPlayer,
        newRollFlipped
    );

    const selectRandomMove = Math.floor(
        Math.random() * robotPlayerPossibleMoves.length
    );

    return {
        move: robotPlayerPossibleMoves[selectRandomMove],
        roll: newRollFlipped,
        possibleMoves: robotPlayerPossibleMoves,
    };
};

export const defensiveRobotPlayer = (players, currentPlayer) => {
    const newRollFlipped = rollFlipped();
    const robotPlayerPossibleMoves = possibleMovesOfFigures(
        players,
        currentPlayer,
        newRollFlipped
    );

    const orderbyProbability = robotPlayerPossibleMoves.sort(
        (a, b) => a.probability - b.probability
    );

    return {
        move: orderbyProbability.length > 0 ? orderbyProbability[0] : undefined,
        roll: newRollFlipped,
        possibleMoves: robotPlayerPossibleMoves,
    };
};

export const pacifistRobotPlayer = (players, currentPlayer) => {
    const newRollFlipped = rollFlipped();
    const robotPlayerPossibleMoves = possibleMovesOfFigures(
        players,
        currentPlayer,
        newRollFlipped
    );

    const otherPlayerFigures = players[
        currentPlayer === "blue" ? "green" : "blue"
    ].figures.map((value) => mapIndex(value));

    const filterOutOpponentPositions = robotPlayerPossibleMoves.filter(
        (x) => !otherPlayerFigures.includes(x.target)
    );

    if (filterOutOpponentPositions.length > 0) {
        const selectRandomMove = Math.floor(
            Math.random() * filterOutOpponentPositions.length
        );

        return {
            move: filterOutOpponentPositions[selectRandomMove],
            roll: newRollFlipped,
            possibleMoves: robotPlayerPossibleMoves,
        };
    } else {
        const selectRandomMove = Math.floor(
            Math.random() * robotPlayerPossibleMoves.length
        );

        return {
            move: robotPlayerPossibleMoves
                ? robotPlayerPossibleMoves[selectRandomMove]
                : undefined,
            roll: newRollFlipped,
            possibleMoves: robotPlayerPossibleMoves,
        };
    }
};

export const aggressiveRobotPlayer = (players, currentPlayer) => {
    const newRollFlipped = rollFlipped();
    const robotPlayerPossibleMoves = possibleMovesOfFigures(
        players,
        currentPlayer,
        newRollFlipped
    );

    const orderbyProbability = robotPlayerPossibleMoves.sort(
        (a, b) => b.probability - a.probability
    );

    return {
        move: orderbyProbability.length > 0 ? orderbyProbability[0] : undefined,
        roll: newRollFlipped,
        possibleMoves: robotPlayerPossibleMoves,
    };
};
