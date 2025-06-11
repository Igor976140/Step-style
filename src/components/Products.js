import React, { useContext, useState } from 'react';
import { ProductsContext, CartContext } from '../services/context';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ClearIcon from '@material-ui/icons/Clear';
import RemoveIcon from '@material-ui/icons/Remove';
import { Grow, TextField } from '@material-ui/core';
import { Link, useLocation } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 300,
    margin: 20,
    position: 'relative',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'scale(1.03)',
      boxShadow: '0px 4px 15px rgba(120, 120, 120, 0.1)',
    },
  },
  container: {
    padding: 24,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
  },
  media: {
    height: 160,
    backgroundSize: 'contain',
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  cartCount: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: theme.palette.warning.main,
    color: '#fff',
    borderRadius: '50%',
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    boxShadow: '0px 0px 5px rgba(0,0,0,0.2)',
  },
  buttonSec: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: theme.palette.grey[25],
    padding: '0 8px',
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(4),
    padding: theme.spacing(2),
  },
  searchInput: {
    width: '100%',
    maxWidth: 400,
    '& .MuiInput-root': {
      borderBottom: `2px solid ${theme.palette.text.secondary}`, // Нижня межа
      padding: theme.spacing(1),
      fontFamily: "'Ancizar Serif', serif",
      color: '#fff',
    },
    '& .MuiInput-underline:before': {
      borderBottom: 'none', // Прибираємо стандартну межу
    },
    '& .MuiInput-underline:hover:before': {
      borderBottom: 'none', // Прибираємо межу при наведенні
    },
    '& .MuiInput-underline:after': {
      borderBottom: 'none', // Прибираємо межу після фокусу
    },
  },
  noResults: {
    width: '100%',
    textAlign: 'center',
    padding: theme.spacing(4),
    fontFamily: "'Ancizar Serif', serif",
    color: theme.palette.text.secondary,
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Products() {
  const [products] = useContext(ProductsContext);
  const [cartState, cartDispatch] = useContext(CartContext);
  const classes = useStyles();
  let location = useLocation().search;
  location = location.slice(-1) === '/' ? location : (location + '/');
  const pageNo = parseInt(location?.slice(-2)) || 1;
  const [toastOpen, setToastOpen] = React.useState(false);
  const [toastMsg, setToastMsg] = React.useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Фільтрація товарів за назвою
  const filteredProducts = products?.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Застосовуємо пагінацію до відфільтрованих товарів
  const paginatedProducts = filteredProducts?.slice(20 * (pageNo - 1), 20 * pageNo);

  return (
    <div className={classes.container}>
      {/* Пошукова панель */}
      <div className={classes.searchContainer}>
        <TextField
          className={classes.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Пошук за назвою товару..."
        />
      </div>

      {/* Список товарів або повідомлення про відсутність результатів */}
      {paginatedProducts?.length > 0 ? (
        paginatedProducts.map((product) => (
          <Card key={product.id} className={classes.root} style={cartState[product.id] ? { boxShadow: '0px 0px 10px 5px orange' } : {}}>
            <CardActionArea className={classes.card} component={Link} to={{ pathname: `/products/${product.id}/` }}>
              <CardMedia
                className={classes.media}
                image={`/products-photos/${product.title}.webp` ?? "/icons/noImage.jpg"}
                title={product.title}
              />
              <CardContent style={{ height: '150px' }}>
                <Typography gutterBottom variant="h5" component="h2" style={{ minHeight: '100px', fontFamily: "'Ancizar Serif', serif" }}>
                  {product.title}
                </Typography>
                <Grow {...{ timeout: 1000 }} in={!!cartState[product.id]}>
                  <span className={classes.cartCount}>
                    {cartState[product.id]?.quantity}
                  </span>
                </Grow>
                <Typography variant="body2" color="textSecondary" component="p">
                  Стать: {product.gender}
                </Typography>
                <Typography variant="h6" color="textPrimary" component="p">
                  Ціна: {product.retailPrice && product.retailPrice !== 'N/A' ? `${product.retailPrice * 42} грн` : 'N/A'}
                </Typography>
              </CardContent>

              <CardActions className={classes.buttonSec}>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    if (
                      !product?.retailPrice ||
                      product?.retailPrice === 'N/A' ||
                      Number(product?.retailPrice) === 0 ||
                      isNaN(Number(product?.retailPrice))
                    ) {
                      setToastMsg('Товар наразі відсутній у наявності');
                      setToastOpen(true);
                    } else {
                      cartDispatch({ type: 'add', item: product });
                    }
                  }}
                  variant="contained"
                  color="secondary"
                >
                  Купити
                </Button>

                <Snackbar
                  open={toastOpen}
                  autoHideDuration={3000}
                  onClose={() => setToastOpen(false)}
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                  <Alert onClose={() => setToastOpen(false)} severity="warning">
                    {toastMsg}
                  </Alert>
                </Snackbar>

                <div>
                  <Button
                    disabled={!cartState[product.id] || false}
                    onClick={(e) => {
                      e.preventDefault();
                      cartDispatch({ type: 'remove', item: product });
                    }}
                    variant="contained"
                    color="secondary"
                    style={{ margin: 3 }}
                  >
                    <RemoveIcon />
                  </Button>
                  <Button
                    disabled={!cartState[product.id] || false}
                    onClick={(e) => {
                      e.preventDefault();
                      cartDispatch({ type: 'clear', item: product });
                    }}
                    variant="contained"
                    color="secondary"
                    style={{ margin: 3 }}
                  >
                    <ClearIcon />
                  </Button>
                </div>
              </CardActions>
            </CardActionArea>
          </Card>
        ))
      ) : (
        <Typography variant="h6" className={classes.noResults}>
          Товари не знайдено
        </Typography>
      )}
    </div>
  );
}