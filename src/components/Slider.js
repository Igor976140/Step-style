import { Button, makeStyles, useMediaQuery } from '@material-ui/core';
import React, { useState } from 'react';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const useStyles = makeStyles(theme => ({

    outerDiv: {
        display: 'flex',
        justifyContent: 'center',
    },

    sliderDiv: {
        position: 'absolute',
        width: (props) => props.itemWidth * props.itemsTotal,
        left: '0px',
        transition: 'left 1s',
    },

    cards: {
        position: 'relative',
        overflow: 'hidden',
        width: (props) => props.itemWidth * 4,
        height: (props) => props.itemHeight * 1.2,
        [theme.breakpoints.down('1135')]: {
            width: (props) => props.itemWidth * 3,
        },
        [theme.breakpoints.down('910')]: {
            width: (props) => props.itemWidth * 2,
        },
        [theme.breakpoints.down('660')]: {
            width: (props) => props.itemWidth,
        },
    },
}))

export default function Slider2(props) {
    function slideLeft(leftMargin, width) {
        let maxLeft = 0
        if (width >= 1135) {
            maxLeft = props.itemWidth * (props.itemsTotal - props.itemsDisplayed);
        } else if (width >= 910) {
            maxLeft = props.itemWidth + props.itemWidth * (props.itemsTotal - props.itemsDisplayed);
        } else if (width >= 660) {
            maxLeft = props.itemWidth * 2 + props.itemWidth * (props.itemsTotal - props.itemsDisplayed);
        } else {
            maxLeft = props.itemWidth * 3 + props.itemWidth * (props.itemsTotal - props.itemsDisplayed);
        }
        if (((-leftMargin)) < maxLeft) {
            setMargin((state) => state - props.itemWidth);
        }
    }

    function slideRight(leftMargin) {
        if (leftMargin !== 0) {
            setMargin((state) => state + props.itemWidth);
        }
    }


    const [leftMargin, setMargin] = useState(0);
    const cards2 = useMediaQuery('(min-width:660px)');
    const cards3 = useMediaQuery('(min-width:910px)');
    const cards4 = useMediaQuery('(min-width:1135px)');

    if (cards4) {
        if ((-leftMargin) > props.itemWidth * (props.itemsTotal - props.itemsDisplayed)) {
            setMargin((state) => (state + props.itemWidth));
        }
    }
    else if (cards3) {
        if ((-leftMargin) > props.itemWidth + props.itemWidth * (props.itemsTotal - props.itemsDisplayed)) {
            setMargin((state) => (state + props.itemWidth));

        }
    }
    else if (cards2) {
        if ((-leftMargin) > props.itemWidth * 2 + props.itemWidth * (props.itemsTotal - props.itemsDisplayed)) {
            setMargin((state) => (state + props.itemWidth));

        }
    }

    const classes = useStyles(props);

    return (
        <div className={classes.outerDiv}>

            <Button onClick={() => { slideRight(leftMargin) }}><ChevronLeftIcon fontSize='large' /></Button>
            <div className={classes.cards}>
                <div className={classes.sliderDiv} style={{ left: leftMargin }}>
                    {props.children}
                </div>
            </div>
            <Button onClick={() => { slideLeft(leftMargin, window.innerWidth) }}><ChevronRightIcon fontSize='large' /></Button>
        </div>
    )
}