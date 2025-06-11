import { Card, CardActionArea, CardContent, CardMedia, Container, Divider, List, ListItem, ListItemText, makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';
import Link from '@material-ui/core/Link';
import Slider from './Slider';

const useStyles = makeStyles(theme => ({

  title: {
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
    padding: '5px 20px',
    margin: '0px 0px 25px',
    borderRadius: '10px',
    boxShadow: '0px 10px 6px rgba(5, 5, 0, 0.5)', // тінь вниз, легка і неяскрава
  },
  
  card: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    width: 205,
    height: 250,
    margin: '10px',
    display: 'inline-block',
    border: '1px solid rgba(255, 255, 255, 0.3)', // легка напівпрозора рамка
    borderRadius: '8px', // щоб рамка виглядала краще
  },

  container: {
    padding: '20px',
  },

  paper: {
    paddingBottom: '30px',
  },

  media: {
    height: 140,
    padding: 5,
     boxSizing: 'border-box'
  },

  content: {
    fontFamily: 'Yusei Magic,sans-serif',
    marginTop: '30px',
    padding: '0px 20px 0px 20px',
  },
   ownerImageContainer: {
    position: 'relative',
    '& img': {
      maxHeight: '250px',
      padding: '5px',
      borderRadius: '10px',
    },
    '&::after': {
      content: '"Власник магазину"',
      position: 'absolute',
      bottom: '-20px',
      left: '50%',
      transform: 'translateX(-50%)',
      color: theme.palette.text.primary,
      fontFamily: 'Yusei Magic, sans-serif',
      fontSize: '1rem',
      backgroundColor: theme.palette.grey[800],
      padding: '4px 10px',
      borderRadius: '5px',
      whiteSpace: 'nowrap',
    },
  },
  
}))

const cards = [
  { title: 'Telegram', value: '+380 63 135 23 20' },
  { title: 'Email', value: 'igoroleskiv1@gmail.com', link: 'https://mail.google.com/mail/u/1/#inbox?compose=GTvVlcSHxjbZlbtXgcqcpBLNrXvrBThfGHJbQvMgXFHsqlGKjFzlkBsHCSjCpQMRnGMvCssCJwLbg' },
  { title: 'Github', value: 'https://github.com/\Oleskivvv', link: 'https://github.com/Florenceses' },
  { title: 'Facebook', value: 'https://www.facebook.com/share/1Ajd1FSsFn/?mibextid=wwXIfr', link: 'https://www.facebook.com/share/1Ajd1FSsFn/?mibextid=wwXIfr' },
  { title: 'Instagram', value: 'https://www.instagram.com/_i.g.o.r._06_/?igsh=dmo3Z2l4bHM3YmUz&utm_source=qr#', link: 'https://www.instagram.com/_i.g.o.r._06_/?igsh=dmo3Z2l4bHM3YmUz&utm_source=qr#'}
]
export default function About() {

  const classes = useStyles();

  return (
    <div>
      <Container className={classes.container} >
        <Paper >

          <div>
          
          <Typography variant='h3' className={classes.title}>Про додаток</Typography>
          <div style={{display:'flex', flexDirection: 'row', padding: '10px'}}>
            
              <div>
                <Typography variant='h6' className={classes.content}>
                  "Step Style — ваш стильний помічник у світі моди! Це сучасний веб-додаток, створений на основі React.js із використанням React Router 6beta та Material-UI, що забезпечує швидку та інтуїтивну роботу. Розгорнутий через Surge, Step Style дозволяє легко переглядати товари, додавати їх до кошика та насолоджуватися зручним інтерфейсом на будь-якому пристрої. Відкрийте для себе нові надходження, обирайте з розумом і залишайтеся в тренді з Step Style!"  
                </Typography>
              </div>

              <div className= {classes.ownerImageContainer}>
                <img src="../icons/admin.jpg" >
                </img>
              </div>
          </div>
          </div>

          <Typography variant='h6' className={classes.content}>Функціональні можливості включають: </Typography>          
          <div >
            <List component="nav" aria-label="app functionality">
              <ListItem>
                <ListItemText primary="1. Перерахування продуктів із нумерацією сторінок" />
              </ListItem>
              <Divider />

              <ListItem>
                <ListItemText primary="2. Відображення деталей продукту за допомогою динамічних маршрутів" />
              </ListItem>
              <Divider />

              <ListItem>
                <ListItemText primary="3. Опція додавання в кошик з різних розділів програми" />
              </ListItem>
              <Divider />

              <ListItem>
                <ListItemText primary="4. Зроблений на замовлення слайдер для відображення різних елементів в обмеженому просторі" />
              </ListItem>
              <Divider />

              <ListItem>
                <ListItemText primary="5. Відображення нового надходження на головній сторінці" />
              </ListItem>
              <Divider />

              <ListItem>
                <ListItemText primary="6. Повністю чуйний на всіх розмірах екрана" />
              </ListItem>
              <Divider />
            </List>
          </div>
        </Paper>
      </Container>

      <Container className={classes.container} >
        <Paper
          className={classes.paper} >
          <Typography variant='h3' className={classes.title}>Співпраця</Typography>

          <Slider itemHeight={250} itemWidth={230} itemsTotal={5} itemsDisplayed={4}>
            {cards.map((card) => {
              console.log('ABOUT this is card.title.toLocaleLowerCase() = ', card.title.toLocaleLowerCase())
              return (
                <Link href={card.link} target="_blank" rel="noopener" key={card.title} >
                  <Card className={classes.card}>
                    <CardActionArea>
                      <CardMedia
                        className={classes.media}
                        image={`/icons/u${card.title.toLocaleLowerCase()}.png`}
                        title={card.title}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                          {card.title}
                        </Typography>
                        <Typography variant="body2" color="white" component="p">
                          {card.value}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Link>
              )
            })}
          </Slider>
        </Paper>
      </Container>
    </div >
  );
}