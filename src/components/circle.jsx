import React from 'react'

export const Circle = ({color}) => (
    <div style={{
        width: 15,
        height: 15,
        borderRadius: 25,
        background: color,
        float: 'left',
        marginRight: 3,
        marginLeft: 3,
    }}/>
);
