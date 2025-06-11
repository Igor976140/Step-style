import { Button, Grid, Grow, makeStyles, Paper, Typography } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext, ProductsContext } from '../services/context';
import ClearIcon from '@material-ui/icons/Clear';
import RemoveIcon from '@material-ui/icons/Remove';


const useStyles = makeStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  entry: {
    border: '1px solid #e0e0e0',
    borderBottom: 'none',
  },
  label: {
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
    padding: '5px 20px',
    marginBottom: 25,
    fontFamily: "'Ancizar Serif', serif",
    borderRadius: '8px', // Додано закруглені кути
  },
  cartCount: {
    borderRadius: '50%',
    height: 50,
    width: 50,
    textAlign: 'center',
    lineHeight: '50px',
    float: 'right',
    backgroundColor: 'orange',
    color: 'white',
    fontSize: 30,
    marginLeft: 0,
  },
  buttonSec: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: theme.palette.grey[25],
    marginTop: 20,
  },
    imageContainer: {
    height: '65%',
    border: '5px solid grey',
    borderRadius: 8,
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      height: 'auto', // На малих екранах висота адаптується до контенту
    },
  },
    productImage: {
    width: '100%',
    height: '100%',
    display: 'block',
    objectFit: 'cover', // Зображення заповнює контейнер, зберігаючи пропорції
    [theme.breakpoints.down('sm')]: {
      height: '300px', // Фіксована висота для малих екранів
    },
  },
}));

export default function ProductsDetails() {
  const classes = useStyles();
  const { productID } = useParams();

  const [products] = useContext(ProductsContext);
  const [cartState, cartDispatch] = useContext(CartContext);
  const [errorMessage, setErrorMessage] = useState('');

  // Знаходимо продукт за productID
  const product = products.find((item) => item.id === productID);

  // Важливі деталі для відображення
  const detailsKeys = ['brand', 'gender', 'releaseDate', 'retailPrice', 'colorway'];

  // Формуємо об'єкт деталей з великими першими літерами ключів
const detailsObj = product
  ? detailsKeys.reduce((acc, key) => {
      let value = product[key];
      if (key === 'retailPrice' && value && value !== 'N/A') {
        value = `${value * 42} грн`;
      }
      acc[key.charAt(0).toUpperCase() + key.slice(1)] = value;
      return acc;
    }, {})
  : {};

  // Обробка додавання у кошик
  const handleAddToCart = () => {
    if (!product?.retailPrice || product.retailPrice === 'N/A' || Number(product.retailPrice) <= 0 || isNaN(Number(product.retailPrice))) {
      setErrorMessage('Товар наразі відсутній у наявності');
      return;
    }
    cartDispatch({ type: 'add', item: product });
    setErrorMessage('');
  };

  return (
    <div style={{ marginTop: 40 }}>
      <Grid container justifyContent="space-around" spacing={4}>
        {/* Фото товару */}
        <Grid item xs={11} md={6}>
          <Paper className={classes.imageContainer}>
          <img
            src={`/products-photos/${product?.title}.webp` || 'icons/noImage.jpg'}
            alt={product?.title || 'no image'}
            className={classes.productImage}
          />
        </Paper>
       </Grid>

        {/* Деталі товару */}
        <Grid item xs={12} md={5}>
          <Paper style={{ padding: 20, height: '60%' }}>
            <Typography variant="h4" className={classes.label}>
              {product?.title}
            </Typography>

            {Object.entries(detailsObj).map(([key, value]) => (
              <Grid container key={key} className={classes.root} justifyContent="space-around">
                <Grid item xs={5}>
                  <Typography variant="h5" className={classes.entry}>
                    {key}
                  </Typography>
                </Grid>
                <Grid item xs={5}>
                  <Typography variant="h6" className={classes.entry}>
                    {value}
                  </Typography>
                </Grid>
              </Grid>
            ))}

            {/* Кількість в кошику */}
            <Grow in={!!cartState[product?.id]} timeout={1000}>
              <span className={classes.cartCount}>
                {cartState[productID]?.quantity || 0}
              </span>
            </Grow>

            {/* Кнопки */}
            <div className={classes.buttonSec}>
              <Button variant="contained" color="secondary" onClick={handleAddToCart}>
                В корзину
              </Button>

              <div style={{ marginLeft: 10 }}>
                <Button
                  disabled={!cartState[productID]}
                  onClick={() => cartDispatch({ type: 'remove', item: product })}
                  variant="contained"
                  color="secondary"
                  style={{ margin: 3 }}
                >
                <RemoveIcon />
                </Button>
                <Button
                  disabled={!cartState[productID]}
                  onClick={() => cartDispatch({ type: 'clear', item: product })}
                  variant="contained"
                  color="secondary"
                  style={{ margin: 3 }}
                >
                <ClearIcon />
                </Button>
              </div>
            </div>

            {/* Повідомлення про помилку */}
            {errorMessage && (
              <Typography color="error" style={{ marginTop: 10, textAlign: 'center' }}>
                {errorMessage}
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
