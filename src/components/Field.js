import React from "react";
import Figure from "./Figure";
import { useSelector, useDispatch } from "react-redux";
import { SELECTS_FIGURE, AWAITS_ROLL } from "../reducers/players";
import {
    addFigure,
    changeState,
    moveFigure,
    removeFigure,
    resetRoll,
    save,
    setInfo,
    lightOn,
    lightOff,
} from "../actions/actions";
import { mapField, mapIndex, nextPlayer, resetGame } from "../App";

export const shiftFigure = (dispatch, players, player, from, to) => {
    dispatch(changeState(player, AWAITS_ROLL));

    if (to === 15) {
        dispatch(removeFigure(player, from));
        dispatch(save(player));
        if (players[player].saved === 7) {
            if (
                window.confirm(
                    player.toUpperCase() +
                        " WINS!\nWould you like to start another game?"
                )
            ) {
                resetGame(dispatch, player);
            }
        } else {
            dispatch(setInfo(player, "Figure Saved"));
            nextPlayer(dispatch, player);
        }
    } else {
        const opponent = player === "blue" ? "green" : "blue";
        const figuresOfOpponent = players[opponent].figures;
        if (figuresOfOpponent.includes(mapField(to, player))) {
            dispatch(removeFigure(opponent, mapField(to, player)));
            dispatch(setInfo(player, "Figure Beaten"));
        }

        dispatch(moveFigure(player, from, mapField(to, player)));
        if ([4, 8, 14].includes(to)) {
            dispatch(setInfo(player, "Special Field|Extra Turn"));
            dispatch(resetRoll());
        } else {
            nextPlayer(dispatch, player);
        }
    }
};

export const plusFigure = (dispatch, player, target) => {
    dispatch(changeState(player, AWAITS_ROLL));
    dispatch(addFigure(player, mapField(target, player)));
    if (target === 4) {
        dispatch(setInfo(player, "Special Field|Extra Turn"));
        dispatch(resetRoll());
    } else {
        nextPlayer(dispatch, player);
    }
};

const Field = (props) => {
    const dispatch = useDispatch();
    const players = useSelector((state) => state.players);
    const currentPlayer = useSelector((state) => state.current);
    const light = useSelector((state) => state.light);
    const gameStateForCurrent = players[currentPlayer].state;
    const movesForCurrent = players[currentPlayer].moves;
    const movesFlattened = movesForCurrent.map((item) => item.field);
    const entryFieldId = currentPlayer === "blue" ? "startBlue" : "startGreen";

    let currentPlayerFigure = null;
    if (!props.content) {
        Object.keys(players).forEach((player) => {
            if (players[player].figures.find((item) => item === props.id)) {
                currentPlayerFigure = player;
                return false;
            }
        });
    }

    let content = "";
    let css = props.css;
    let clickable = null;
    let hoverable = null;
    let target = null;
    if (props.content) {
        content = props.content;
        if (
            gameStateForCurrent === SELECTS_FIGURE &&
            movesFlattened.includes(0) &&
            props.id === entryFieldId
        ) {
            css += " available";
            target = movesForCurrent.find((item) => item.field === 0);
            clickable = () =>
                plusFigure(dispatch, currentPlayer, target.target);
            hoverable = () =>
                dispatch(
                    lightOn(currentPlayer, target.target, target.probability)
                );
        }
    } else if (currentPlayerFigure) {
        content = <Figure player={currentPlayerFigure} />;
        const mappedIndex = mapIndex(props.id);
        if (
            gameStateForCurrent === SELECTS_FIGURE &&
            movesFlattened.includes(mappedIndex) &&
            props.id === mapField(mappedIndex, currentPlayer)
        ) {
            css += " available";
            target = movesForCurrent.find(
                (item) => item.field === mapIndex(props.id)
            );
            clickable = () =>
                shiftFigure(
                    dispatch,
                    players,
                    currentPlayer,
                    props.id,
                    target.target
                );
            hoverable = () =>
                dispatch(
                    lightOn(currentPlayer, target.target, target.probability)
                );
        }
        if (
            light &&
            mapField(light.target, light.player) === props.id &&
            currentPlayerFigure !== currentPlayer
        ) {
            css += " conflict";
            content = `${light.probability}`;
        }
    } else if (light && mapField(light.target, light.player) === props.id) {
        css += " target";
        content = `${light.probability}`;
    }

    return (
        <>
            <td
                className={css}
                id={props.id}
                onClick={clickable}
                onMouseOver={hoverable}
                onMouseOut={() => dispatch(lightOff())}
            >
                {content}
            </td>
        </>
    );
};

export default Field;
