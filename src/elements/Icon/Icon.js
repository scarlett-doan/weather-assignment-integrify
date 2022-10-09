import React from 'react';

import classes from './Icon.module.css';

const icon = (props) => {
    const words = props.type.split(" ");
    const icon_name = words.map((word) => {
        return word[0].toUpperCase() + word.substring(1);
    }).join(" ");
    const image = require(`../../assets/images/${icon_name}.png`)

    return(
        <img 
            // src={img}
            src={image}
            alt={props.type}
            className={classes.Icon} />
    );
}

export default icon;