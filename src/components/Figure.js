import React from "react";

const Figure = (props) => {
    return (
        <>
            <div className={props.player + " figure"}>&nbsp;</div>
        </>
    );
};

export default Figure;
