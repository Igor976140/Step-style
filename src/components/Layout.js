import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import CartIcon from './CartIcon';
import { CartContext } from '../services/context';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundImage: `url(/icons/newBG.jpg)`,
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    width: '20%',
    fontSize: '1.8em',
    lineHeight: `48px`,
    marginLeft: '25px',
    fontFamily: "'Ancizar Serif', serif",
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  tabs: {
    width: '100%',
  },
  toolbar: {
    padding: '10px 0px',
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  footer: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.text.primary,
    padding: theme.spacing(4, 0),
    marginTop: 'auto',
    boxShadow: `0 0 10px ${theme.palette.primary.main}55`,
  },
  footerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      textAlign: 'center',
      gap: theme.spacing(2),
    },
  },
  footerText: {
    fontFamily: "'Ancizar Serif', serif",
    fontSize: '1rem',
  },
  footerLink: {
    color: theme.palette.text.secondary,
    textDecoration: 'none',
    fontFamily: "'Ancizar Serif', serif",
    marginLeft: theme.spacing(1),
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  loginIcon: {
    marginLeft: theme.spacing(2),
    cursor: 'pointer',
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}));

export default function Layout() {
  const [cartState,] = useContext(CartContext);
  let location = useLocation().pathname;
  location = location.search('/products/') ? location : '/products/';
  location = location.search('/productitem/') ? location : '/products/';
  location = location.slice(-1) === '/' ? location : (location + '/');
  const classes = useStyles();
  const navigate = useNavigate();

  const [openLogin, setOpenLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginOpen = () => setOpenLogin(true);
  const handleLoginClose = () => {
    setOpenLogin(false);
    setEmail('');
    setPassword('');
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      handleLoginClose();
      navigate('/admin'); // Перенаправлення на AdminPage
    } catch (error) {
      console.error('Помилка логіну:', error.message);
      alert('Помилка: ' + error.message);
    }
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Typography className={classes.label}>Step-Style</Typography>
          <Tabs
            className={classes.tabs}
            variant="fullWidth"
            centered
            value={location}
            aria-label="nav tabs example"
          >
            <Tab className={classes.tabs} component={Link} value='/' to='/' label="Головна" />
            <Tab className={classes.tabs} component={Link} value='/products/' to='products/' label="Товари" />
            <Tab className={classes.tabs} component={Link} value='/about/' to='about/' label="Про нас" />
            <Tab className={classes.tabs} icon={<CartIcon quantity={cartState.total} />} component={Link} value="/cart/" to="cart/" />
            <AccountCircleIcon className={classes.loginIcon} onClick={handleLoginOpen} />
          </Tabs>
        </Toolbar>
      </AppBar>
      <Outlet />
      <AppBar position="static" component="footer" className={classes.footer}>
        <Container maxWidth="lg" className={classes.footerContainer}>
          <Typography className={classes.footerText}>
            © {new Date().getFullYear()} Step-Style. Усі права захищено.
          </Typography>
          <Typography className={classes.footerText}>
            Контакти: <a href="mailto:igoroleskiv1@gmail.com" className={classes.footerLink}>igoroleskiv1@gmail.com</a> | 
            <a href="tel:+380123456789" className={classes.footerLink}> +380 123 456 789</a>
          </Typography>
          <Typography className={classes.footerText}>
            Слідкуйте за нами: 
            <a href="https://www.instagram.com/_i.g.o.r._06_/?igsh=dmo3Z2l4bHM3YmUz&utm_source=qr#" target="_blank" rel="noopener noreferrer" className={classes.footerLink}>Instagram</a> | 
            <a href="https://www.facebook.com/share/1Ajd1FSsFn/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className={classes.footerLink}>Facebook</a>
          </Typography>
        </Container>
      </AppBar>
      <Dialog open={openLogin} onClose={handleLoginClose}>
        <DialogTitle>Логін адміністратора</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Увійти
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}