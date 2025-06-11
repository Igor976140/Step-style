import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, database } from '../services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, onValue, remove, update } from 'firebase/database';
import { 
  Button, 
  Typography, 
  Container, 
  Paper, 
  makeStyles, 
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Avatar,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[900],
    minHeight: '100vh',
    padding: theme.spacing(2, 0),
    color: theme.palette.text.primary,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    fontFamily: "'Lavishly Yours', cursive",
    fontSize: '3.5rem',
    color: 'white',
    textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
    textAlign: 'center',
    marginBottom: theme.spacing(2),
  },
  subheader: {
    fontFamily: "'Ancizar Serif', serif",
    fontSize: '1.5rem',
    color: theme.palette.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing(4),
  },
  adminCard: {
    backgroundColor: theme.palette.grey[800],
    padding: theme.spacing(2),
    borderRadius: '12px',
    boxShadow: `0 0 15px ${theme.palette.primary.main}55`,
    width: '100%',
    maxWidth: '95vw',
    marginBottom: theme.spacing(4),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  adminText: {
    fontFamily: "'Ancizar Serif', serif",
    fontSize: '1.4rem',
    color: theme.palette.text.primary,
  },
  logoutButton: {
    fontFamily: "'Ancizar Serif', serif",
  },
  contentSection: {
    backgroundColor: theme.palette.grey[800],
    padding: theme.spacing(2),
    borderRadius: '12px',
    boxShadow: `0 0 15px ${theme.palette.primary.main}55`,
    width: '100%',
    maxWidth: '95vw',
    marginBottom: theme.spacing(4),
  },
  table: {
    minWidth: '100%',
  },
  tableHead: {
    backgroundColor: theme.palette.primary.main,
    '& th': {
      color: theme.palette.common.white,
      fontFamily: "'Ancizar Serif', serif",
      fontWeight: 'bold',
      fontSize: '1.0rem',
      padding: theme.spacing(1),
    },
  },
  tableRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    height: '60px',
  },
  tableCell: {
    fontFamily: "'Ancizar Serif', serif",
    color: theme.palette.text.primary,
    fontSize: '0.95rem',
    padding: theme.spacing(1),
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    maxWidth: '150px',
  },
  noOrdersText: {
    fontFamily: "'Ancizar Serif', serif",
    fontSize: '1.4rem',
    color: theme.palette.text.secondary,
    textAlign: 'center',
    padding: theme.spacing(3),
  },
  deleteButton: {
    color: theme.palette.error.main,
  },
  editButton: {
    color: theme.palette.warning.main,
  },
  tableContainer: {
    overflowX: 'hidden',
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  adminAvatar: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    marginRight: theme.spacing(2),
  },
  pagination: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(1),
  },
  pageButton: {
    fontFamily: "'Ancizar Serif', serif",
    minWidth: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  activePageButton: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark,
    },
  },
}));

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [orderToEdit, setOrderToEdit] = useState(null);
  const [editedOrder, setEditedOrder] = useState({});
  const [currentOrderPage, setCurrentOrderPage] = useState(1);
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const classes = useStyles();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const ordersRef = ref(database, 'orders');
    const unsubscribeOrders = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ordersList = Object.entries(data).map(([id, order]) => {
          const firstItem = Array.isArray(order.items) && order.items.length > 0 ? order.items[0] : {};
          return {
            id,
            name: firstItem.name || order.name || 'Невідомо',
            price: firstItem.price || order.price || 0,
            quantity: firstItem.quantity || order.quantity || 0,
            orderDate: order.orderDate || new Date().toISOString(),
            totalPrice: order.totalPrice || 0,
            fullName: order.user?.fullName || 'Невідомо',
            phone: order.user?.phone || 'Невідомо',
            email: order.user?.email || 'Невідомо',
            deliveryMethod: order.user?.deliveryMethod || 'Невідомо',
            address: `${order.user?.address || ''}, ${order.user?.city || ''}, ${order.user?.district || ''}, ${order.user?.country || ''}`
              .trim()
              .replace(/, ,/g, ',')
              .replace(/^,|,$/g, '') || 'Невідомо',
            contactInfo: `${order.user?.fullName || 'Невідомо'} (${order.user?.email || 'Невідомо'})`,
            deliveryAndAddress: `${order.user?.deliveryMethod || 'Невідомо'}: ${order.user?.address || ''}, ${order.user?.city || ''}, ${order.user?.district || ''}, ${order.user?.country || ''}`
              .trim()
              .replace(/, ,/g, ',')
              .replace(/^,|,$/g, '') || 'Невідомо',
          };
        });
        setOrders(ordersList);
      } else {
        setOrders([]);
      }
    });

    const reviewsRef = ref(database, 'reviews');
    const unsubscribeReviews = onValue(reviewsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const reviewsList = Object.entries(data).map(([id, review]) => ({
          id,
          text: review.text || 'Невідомо',
          rating: review.rating || 0,
          userName: review.userName || 'Невідомо',
        }));
        setReviews(reviewsList);
      } else {
        setReviews([]);
      }
    });

    return () => {
      unsubscribeOrders();
      unsubscribeReviews();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Помилка виходу:', error.message);
    }
  };

  // Для замовлень
  const handleDeleteOpen = (orderId) => {
    setOrderToDelete(orderId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setOrderToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (orderToDelete) {
      try {
        const orderRef = ref(database, `orders/${orderToDelete}`);
        await remove(orderRef);
        setOrders(orders.filter((order) => order.id !== orderToDelete));
      } catch (error) {
        console.error('Помилка видалення:', error.message);
        alert('Помилка при видаленні замовлення: ' + error.message);
      }
    }
    handleDeleteClose();
  };

  const handleEditOpen = (order) => {
    setOrderToEdit(order.id);
    setEditedOrder({
      id: order.id,
      name: order.name,
      price: order.price,
      quantity: order.quantity,
      orderDate: order.orderDate,
      totalPrice: order.totalPrice,
      fullName: order.fullName,
      phone: order.phone,
      email: order.email,
      deliveryMethod: order.deliveryMethod,
      address: order.address,
    });
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setOrderToEdit(null);
    setEditedOrder({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    if (orderToEdit) {
      try {
        const orderRef = ref(database, `orders/${orderToEdit}`);
        await update(orderRef, {
          name: editedOrder.name,
          price: parseFloat(editedOrder.price) || 0,
          quantity: parseInt(editedOrder.quantity) || 0,
          orderDate: editedOrder.orderDate,
          totalPrice: parseFloat(editedOrder.totalPrice) || 0,
          user: {
            fullName: editedOrder.fullName,
            phone: editedOrder.phone,
            email: editedOrder.email,
            deliveryMethod: editedOrder.deliveryMethod,
            address: editedOrder.address,
          },
        });
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderToEdit ? { ...order, ...editedOrder } : order
          )
        );
        alert('Замовлення успішно оновлено!');
      } catch (error) {
        console.error('Помилка редагування:', error.message);
        alert('Помилка при редагуванні замовлення: ' + error.message);
      }
    }
    handleEditClose();
  };

  // Пагінація для замовлень
  const totalOrderPages = Math.min(3, Math.ceil(orders.length / itemsPerPage));
  const startOrderIndex = (currentOrderPage - 1) * itemsPerPage;
  const endOrderIndex = startOrderIndex + itemsPerPage;
  const displayedOrders = orders.slice(startOrderIndex, endOrderIndex);

  const handleOrderPageChange = (page) => {
    setCurrentOrderPage(page);
  };

  // Пагінація для відгуків
  const totalReviewPages = Math.min(3, Math.ceil(reviews.length / itemsPerPage));
  const startReviewIndex = (currentReviewPage - 1) * itemsPerPage;
  const endReviewIndex = startReviewIndex + itemsPerPage;
  const displayedReviews = reviews.slice(startReviewIndex, endReviewIndex);

  const handleReviewPageChange = (page) => {
    setCurrentReviewPage(page);
  };

  if (!user) {
    return <div style={{ color: 'white', textAlign: 'center', padding: '20px' }}>Завантаження...</div>;
  }

  return (
    <div className={classes.root}>
      <Container maxWidth="xl">
        <Typography variant="h1" className={classes.header}>
          Панель адміністратора
        </Typography>
        <Typography className={classes.subheader}>
          Вітаємо, {user.email}!
        </Typography>

        <Paper className={classes.adminCard}>
          <Box display="flex" alignItems="center">
            <Avatar
              alt="Admin Photo"
              src="../icons/admin.jpg"
              className={classes.adminAvatar}
            />
            <Typography className={classes.adminText}>
              Ви увійшли як: <strong>{user.email}</strong>
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
            className={classes.logoutButton}
          >
            Вийти
          </Button>
        </Paper>

        {/* Секція замовлень */}
        <Box className={classes.contentSection}>
          <Typography variant="h5" className={classes.adminText} style={{ marginBottom: '20px' }}>
            Список замовлень
          </Typography>
          {orders.length > 0 ? (
            <>
              <TableContainer className={classes.tableContainer} component={Paper}>
                <Table className={classes.table} aria-label="orders table">
                  <TableHead className={classes.tableHead}>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Назва товару</TableCell>
                      <TableCell>Ціна</TableCell>
                      <TableCell>Кількість</TableCell>
                      <TableCell>Дата замовлення</TableCell>
                      <TableCell>Сума (грн)</TableCell>
                      <TableCell>Контактна інформація</TableCell>
                      <TableCell>Телефон</TableCell>
                      <TableCell>Доставка та адреса</TableCell>
                      <TableCell>Дії</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayedOrders.map((order) => (
                      <TableRow key={order.id} className={classes.tableRow}>
                        <TableCell className={classes.tableCell}>{order.id}</TableCell>
                        <TableCell className={classes.tableCell}>{order.name}</TableCell>
                        <TableCell className={classes.tableCell}>{order.price * 42}</TableCell>
                        <TableCell className={classes.tableCell}>{order.quantity}</TableCell>
                        <TableCell className={classes.tableCell}>
                          {new Date(order.orderDate).toLocaleString()}
                        </TableCell>
                        <TableCell className={classes.tableCell}>{order.totalPrice * 42}</TableCell>
                        <TableCell className={classes.tableCell}>{order.contactInfo}</TableCell>
                        <TableCell className={classes.tableCell}>{order.phone}</TableCell>
                        <TableCell className={classes.tableCell}>{order.deliveryAndAddress}</TableCell>
                        <TableCell className={classes.tableCell}>
                          <IconButton
                            className={classes.editButton}
                            onClick={() => handleEditOpen(order)}
                            aria-label="edit"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            className={classes.deleteButton}
                            onClick={() => handleDeleteOpen(order.id)}
                            aria-label="delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box className={classes.pagination}>
                {[1, 2, 3].slice(0, totalOrderPages).map((page) => (
                  <Button
                    key={page}
                    onClick={() => handleOrderPageChange(page)}
                    className={`${classes.pageButton} ${currentOrderPage === page ? classes.activePageButton : ''}`}
                  >
                    {page}
                  </Button>
                ))}
              </Box>
            </>
          ) : (
            <Typography className={classes.noOrdersText}>
              Замовлення відсутні.
            </Typography>
          )}
        </Box>

        {/* Секція відгуків */}
        <Box className={classes.contentSection}>
          <Typography variant="h5" className={classes.adminText} style={{ marginBottom: '20px' }}>
            Список відгуків
          </Typography>
          {reviews.length > 0 ? (
            <>
              <TableContainer className={classes.tableContainer} component={Paper}>
                <Table className={classes.table} aria-label="reviews table">
                  <TableHead className={classes.tableHead}>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Текст відгуку</TableCell>
                      <TableCell>Оцінка</TableCell>
                      <TableCell>Ім'я користувача</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayedReviews.map((review) => (
                      <TableRow key={review.id} className={classes.tableRow}>
                        <TableCell className={classes.tableCell}>{review.id}</TableCell>
                        <TableCell className={classes.tableCell}>{review.text}</TableCell>
                        <TableCell className={classes.tableCell}>{review.rating}</TableCell>
                        <TableCell className={classes.tableCell}>{review.userName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box className={classes.pagination}>
                {[1, 2, 3].slice(0, totalReviewPages).map((page) => (
                  <Button
                    key={page}
                    onClick={() => handleReviewPageChange(page)}
                    className={`${classes.pageButton} ${currentReviewPage === page ? classes.activePageButton : ''}`}
                  >
                    {page}
                  </Button>
                ))}
              </Box>
            </>
          ) : (
            <Typography className={classes.noOrdersText}>
              Відгуки відсутні.
            </Typography>
          )}
        </Box>
      </Container>

      {/* Діалог видалення замовлення */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Підтвердження видалення</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Ви впевнені, що хочете видалити це замовлення? Ця дія є незворотною.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="primary">
            Скасувати
          </Button>
          <Button onClick={handleDeleteConfirm} color="secondary" autoFocus>
            Видалити
          </Button>
        </DialogActions>
      </Dialog>

      {/* Діалог редагування замовлення */}
      <Dialog
        open={editDialogOpen}
        onClose={handleEditClose}
        aria-labelledby="edit-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="edit-dialog-title">Редагування замовлення</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <TextField
            label="Назва товару"
            name="name"
            value={editedOrder.name || ''}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Ціна"
            name="price"
            type="number"
            value={editedOrder.price || ''}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Кількість"
            name="quantity"
            type="number"
            value={editedOrder.quantity || ''}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Дата замовлення"
            name="orderDate"
            type="datetime-local"
            value={editedOrder.orderDate ? new Date(editedOrder.orderDate).toISOString().slice(0, 16) : ''}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Сума (грн)"
            name="totalPrice"
            type="number"
            value={editedOrder.totalPrice || ''}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="ПІБ"
            name="fullName"
            value={editedOrder.fullName || ''}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Телефон"
            name="phone"
            value={editedOrder.phone || ''}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={editedOrder.email || ''}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Спосіб доставки"
            name="deliveryMethod"
            value={editedOrder.deliveryMethod || ''}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Адреса"
            name="address"
            value={editedOrder.address || ''}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="#631935">
            Скасувати
          </Button>
          <Button onClick={handleSaveEdit} color="#631935">
            Зберегти
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}