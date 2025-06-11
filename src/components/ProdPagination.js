import React, { useState } from 'react';
import Products from './Products'
import { Pagination, PaginationItem } from "@material-ui/lab";
import { Link, matchPath, useLocation } from "react-router-dom";
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({

    paginationAlign: {
        backgroundColor: '#1E1E1E',
        borderRadius: '10px',
        width: '276px',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '5px'
    },
    containerDiv: {
        paddingTop: '40px',
        paddingBottom: '40px',
    }

});
export default function ProdPagination() {

    const classes = useStyles();
    const location = '/products/' + useLocation().search.slice(1)
    console.log('thisi is location', useLocation());

    const pageObj = matchPath({
        path: "/products/:pageNo",
        exact: false,
        strict: false,
    }, location);

    const initialPage = parseInt(pageObj?.params.pageNo.slice(-1)) || 1

    const [page, setPage] = useState(initialPage);
    const handleChange = (event, value) => {
        setPage(value);
    };

    return (
        <div className={classes.containerDiv}>

            <Pagination color="secondary" className={classes.paginationAlign}
                size="large"
                count={4}
                page={page}
                onChange={handleChange}
                renderItem={item => (
                    <PaginationItem
                        component={Link}
                        to={`/products${item.page === 1 ? '' : `?${new URLSearchParams({ page: item.page })}/`}`}
                        {...item}
                    />
                )}
            />
            <Products />

            <Pagination color="secondary" className={classes.paginationAlign}
                size="large"
                count={4}
                page={page}
                onChange={handleChange}
                renderItem={item => (
                    <PaginationItem
                        component={Link}
                        to={`/products${item.page === 1 ? '' : `?${new URLSearchParams({ page: item.page })}/`}`}
                        {...item}
                    />
                )}
            />
        </div>
    )
}