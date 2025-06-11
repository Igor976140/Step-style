import { makeStyles } from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons';
import React from 'react'

export default function CartIcon({ quantity }) {
    const useStyles = makeStyles({
        quantity: {
            backgroundColor: 'orange',
            lineHeight: `30px`,
            float: 'left',
            textAlign: 'center',
            borderRadius: '50%',
            minWidth: '30px',
            height: '30px',
            fontSize: '20px'
        },
        icon: {
            fontSize: '30px',
        }
    });

    const classes = useStyles();
    return (
        <div>
            <span className={classes.quantity}>
                {quantity ?? 0}
            </span>
            <ShoppingCart className={classes.icon} />
        </div>
    );
}