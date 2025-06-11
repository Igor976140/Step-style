import React, { useContext, useState } from 'react';
import { CartContext } from '../services/context';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button, ButtonGroup, Slide, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import Container from '@material-ui/core/Container';
import { useNavigate } from 'react-router-dom';
import { addOrder, addReview } from '../services/orders';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 700,
  },
  cartCount: {
    marginLeft: '20px',
    borderRadius: '50%',
    height: '32px',
    textAlign: 'center',
    lineHeight: '32px',
    float: 'right',
    width: '32px',
    backgroundColor: 'orange',
    color: 'white',
    fontSize: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  textField: {
    '& .MuiInputBase-input': {
      color: '#757575',
      textShadow: '0 0 5px rgba(0, 0, 0, 0.5)',
    },
    '& .MuiInputLabel-root': {
      color: '#757575',
      textShadow: '0 0 5px rgba(0, 0, 0, 0.5)',
    },
    '& .MuiInput-underline:before': {
      borderBottomColor: '#757575',
    },
    '& .MuiInput-underline:hover:before': {
      borderBottomColor: '#757575',
    },
  },
  select: {
    '& .MuiSelect-select': {
      color: '#757575',
      textShadow: '0 0 5px rgba(0, 0, 0, 0.5)',
    },
    '& .MuiInputLabel-root': {
      color: '#757575',
      textShadow: '0 0 5px rgba(0, 0, 0, 0.5)',
    },
  },
  reviewForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
}));

export default function Cart() {
  const classes = useStyles();
  const [cartState, cartDispatch] = useContext(CartContext);
  const [orderPlaced, setOrder] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    deliveryMethod: '',
    country: '',
    district: '',
    city: '',
    address: '',
    comment: '',
  });
  const [reviewData, setReviewData] = useState({
    text: '',
    rating: 0,
    userName: '', // Поле для нікнейму
  });
  const navigate = useNavigate();

  const subTotal = Object.keys(cartState).reduce(
    (acc, value) => acc + (value !== 'total' && cartState[value].retailPrice * cartState[value].quantity), 0
  );
  const shipping = cartState.total && 100;

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      deliveryMethod: '',
      country: '',
      district: '',
      city: '',
      address: '',
      comment: '',
    });
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value,
    }));
  };

  const handleOrder = async () => {
    try {
      const cartItems = Object.keys(cartState)
        .filter(key => key !== 'total')
        .map(key => ({
          name: cartState[key].title,
          quantity: cartState[key].quantity,
          price: cartState[key].retailPrice,
        }));

      await addOrder(cartItems, formData);
      cartDispatch({ type: 'resetAll' });
      setOrder(true);
      setOpenModal(false);
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        deliveryMethod: '',
        country: '',
        district: '',
        city: '',
        address: '',
        comment: '',
      });
      setOpenReviewModal(true); // Відкриваємо модальне вікно для відгуку
    } catch (error) {
      console.error('Помилка при додаванні замовлення:', error);
      alert('Сталася помилка. Спробуйте ще раз.');
    }
  };

  const handleSubmitReview = async () => {
    try {
      await addReview(reviewData.text, reviewData.rating, reviewData.userName); // Передаємо reviewData.userName
      setOpenReviewModal(false);
      setReviewData({ text: '', rating: 0, userName: '' });
      setOrder(false);
      if (window.location.pathname === '/cart/') {
        navigate('/products');
      }
    } catch (error) {
      console.error('Помилка при додаванні відгуку:', error);
      alert('Сталася помилка при додаванні відгуку. Спробуйте ще раз.');
    }
  };

  const handleSkipReview = () => {
    setOpenReviewModal(false);
    setOrder(false);
    if (window.location.pathname === '/cart/') {
      navigate('/products');
    }
  };

  return (
    <Container maxWidth="lg" style={{ paddingTop: '5vh', paddingBottom: '5vh' }}>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Предмети</StyledTableCell>
              <StyledTableCell align="right">Кількість</StyledTableCell>
              <StyledTableCell align="center">Ціна</StyledTableCell>
              <StyledTableCell align="center">Сума</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(cartState).map((row) => (
              row !== 'total' && (
                <StyledTableRow key={cartState[row].id}>
                  <StyledTableCell component="th" scope="row">
                    {cartState[row].title}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                      <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          cartDispatch({ type: 'add', item: cartState[row] });
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          cartDispatch({ type: 'remove', item: cartState[row] });
                        }}
                      >
                        <RemoveIcon fontSize="small" />
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          cartDispatch({ type: 'clear', item: cartState[row] });
                        }}
                      >
                        <ClearIcon fontSize="small" />
                      </Button>
                    </ButtonGroup>
                    <span className={classes.cartCount}>{cartState[row].quantity}</span>
                  </StyledTableCell>
                  <StyledTableCell align="center">{cartState[row].retailPrice * 42} грн</StyledTableCell>
                  <StyledTableCell align="center">{cartState[row].quantity * cartState[row].retailPrice * 42} грн</StyledTableCell>
                </StyledTableRow>
              )
            ))}
            <TableRow>
              <TableCell rowSpan={2} colSpan={2} />
              <TableCell align="center">Вся сума</TableCell>
              <TableCell align="center">{subTotal * 42} грн</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">Доставка</TableCell>
              <TableCell align="center">{shipping * 42} грн</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center" colSpan={2}>
                {orderPlaced ? (
                  <Slide {...{ timeout: 2000 }} in={orderPlaced} direction="right" mountOnEnter unmountOnExit>
                    <Typography variant="h5">
                      Дякуємо, що зробили замовлення в нас. Очікуйте на дзвінок від оператора для продовження
                    </Typography>
                  </Slide>
                ) : (
                  <Button disabled={!cartState.total} variant="contained" color="secondary" onClick={handleOpenModal}>
                    ЗАМОВИТИ
                  </Button>
                )}
              </TableCell>
              <TableCell align="center">Всього</TableCell>
              <TableCell align="center">{(subTotal + shipping) * 42} грн</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Дані для доставки</DialogTitle>
        <DialogContent>
          <form className={classes.form}>
            <TextField
              label="ПІБ"
              name="fullName"
              value={formData.fullName}
              onChange={handleFormChange}
              fullWidth
              required
              className={classes.textField}
            />
            <TextField
              label="Номер телефону"
              name="phone"
              value={formData.phone}
              onChange={handleFormChange}
              fullWidth
              required
              className={classes.textField}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleFormChange}
              fullWidth
              required
              className={classes.textField}
            />
            <FormControl fullWidth required className={classes.select}>
              <InputLabel>Спосіб доставки</InputLabel>
              <Select
                name="deliveryMethod"
                value={formData.deliveryMethod}
                onChange={handleFormChange}
              >
                <MenuItem value="nova_poshta">Нова Пошта</MenuItem>
                <MenuItem value="ukrposhta">Укрпошта</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Країна"
              name="country"
              value={formData.country}
              onChange={handleFormChange}
              fullWidth
              required
              className={classes.textField}
            />
            <TextField
              label="Область"
              name="district"
              value={formData.district}
              onChange={handleFormChange}
              fullWidth
              required
              className={classes.textField}
            />
            <TextField
              label="Місто"
              name="city"
              value={formData.city}
              onChange={handleFormChange}
              fullWidth
              required
              className={classes.textField}
            />
            <TextField
              label="Адреса доставки"
              name="address"
              value={formData.address}
              onChange={handleFormChange}
              fullWidth
              required
              className={classes.textField}
            />
            <TextField
              label="Коментарій"
              name="comment"
              value={formData.comment}
              onChange={handleFormChange}
              fullWidth
              multiline
              rows={3}
              className={classes.textField}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Скасувати
          </Button>
          <Button
            onClick={handleOrder}
            color="secondary"
            variant="contained"
            disabled={
              !formData.fullName ||
              !formData.phone ||
              !formData.email ||
              !formData.deliveryMethod ||
              !formData.country ||
              !formData.district ||
              !formData.city ||
              !formData.address
            }
          >
            Підтвердити замовлення
          </Button>
        </DialogActions>
      </Dialog>

      {/* Модальне вікно для відгуку */}
      <Dialog open={openReviewModal} onClose={handleSkipReview}>
        <DialogTitle>Залиште свій відгук</DialogTitle>
        <DialogContent>
          <form className={classes.reviewForm}>
            <TextField
              label="Ваш нікнейм"
              name="userName"
              value={reviewData.userName}
              onChange={handleReviewChange}
              fullWidth
              required
              className={classes.textField}
            />
            <TextField
              label="Ваш відгук"
              name="text"
              value={reviewData.text}
              onChange={handleReviewChange}
              fullWidth
              multiline
              rows={2}
              className={classes.textField}
            />
            <TextField
              label="Рейтинг (1-5)"
              name="rating"
              type="number"
              value={reviewData.rating}
              onChange={handleReviewChange}
              fullWidth
              inputProps={{ min: 1, max: 5 }}
              className={classes.textField}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSkipReview} color="#fff">
            Пропустити
          </Button>
          <Button
            onClick={handleSubmitReview}
            color="fff"
            variant="contained"
            disabled={!reviewData.text || !reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5 || !reviewData.userName}
          >
            Відправити відгук
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}