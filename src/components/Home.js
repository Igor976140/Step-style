import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import {
    Card, CardActionArea, CardContent, CardMedia,
    Container, Typography, makeStyles, Grid
} from '@material-ui/core';
import { ProductsContext } from '../services/context';
import Slider from './Slider';
import AdviceSection from './AdviceSection';
import SneakerSection from './SneakerSection';

// Статичні дані для відгуків
const reviews = [
  {
    name: 'Анна К.',
    text: 'Дуже зручний сайт! Знайшла кросівки своєї мрії за пару хвилин. Швидка доставка, рекомендую!',
    rating: 5,
  },
  {
    name: 'Олександр М.',
    text: 'Гарний вибір товарів, але хотілося б більше кольорів. Загалом, все сподобалось.',
    rating: 4,
  },
  {
    name: 'Марія С.',
    text: 'Супер! Додаток працює швидко, а підтримка відповідає миттєво. Дякую!',
    rating: 5,
  },
];

const useStyles = makeStyles((theme) => ({
    container: {
        backgroundColor: theme.palette.background.paper,
        padding: '15px',
        borderRadius: '8px',
        boxShadow: `0 0 15px ${theme.palette.primary.main}55`,
    },
    title: {
        color: theme.palette.text.primary,
        fontSize: 40,
        fontWeight: 'bold',
        margin: 0,
        fontFamily: "'Ancizar Serif', serif",
        textAlign: 'center',
    },
    tagline: {
        color: theme.palette.text.secondary,
        textAlign: 'center',
        fontFamily: "'Ancizar Serif', serif",
    },
    card: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.text.primary,
        width: 205,
        height: 300,
        margin: '10px',
        display: 'inline-block',
        boxShadow: `0 0 10px ${theme.palette.primary.main}55`,
        transition: 'transform 0.2s',
        '&:hover': {
            transform: 'scale(1.03)',
        },
    },
    media: {
        height: 120,
    },
    arrivals: {
        color: theme.palette.text.secondary,
        fontSize: 50,
        fontWeight: 'bold',
        margin: '10px 0 20px 0',
        textAlign: 'center',
        fontFamily: "'Poppins', sans-serif",
    },
    reviewsSection: {
        
    },
    reviewsTitle: {
        margin:'20px 0px 0px 0px',
        color: '#000',
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: theme.spacing(4),
        textAlign: 'center',
        fontFamily: "'Ancizar Serif', serif",
    },
    reviewCard: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: theme.palette.primary.light,
        boxShadow: `0 0 10px ${theme.palette.primary.main}55`,
        borderRadius: '10px',
        transition: 'transform 0.2s',
        '&:hover': {
            transform: 'scale(1.03)',
        },
    },
    reviewText: {
        fontFamily: "'Ancizar Serif', serif",
        marginBottom: theme.spacing(2),
    },
    reviewName: {
        fontWeight: 'bold',
        color: theme.palette.text.secondary,
    },
    reviewRating: {
        color: theme.palette.warning.main,
        fontSize: '1.2rem',
    },
}));

export default function Home() {
    const classes = useStyles();
    const [products] = useContext(ProductsContext);

    return (
        <div style={{ padding: '30px 0px' }}>
            <Container className={classes.container}>
                <p className={classes.title}>STEP-STYLE</p>
                <h1 className={classes.tagline}>Життя занадто коротке для поганого взуття..</h1>
            </Container>
            
            <AdviceSection />

            <SneakerSection />

            <div style={{ marginTop: '10px' }}>
                <Container className={classes.container} style={{ padding: '20px 0px' }}>
                    <p className={classes.arrivals}>Свіжі товари</p>

                    <Slider itemHeight={260} itemWidth={225} itemsTotal={10} itemsDisplayed={4}>
                        {products?.sort((a, b) =>
                            new Date(b?.releaseDate).getTime() - new Date(a?.releaseDate).getTime()
                        ).slice(0, 10).map((product) => (
                            <Card className={classes.card} key={product.title}>
                                <CardActionArea component={Link} to={`/products/${product.id}/`}>
                                    <CardMedia
                                        className={classes.media}
                                        image={`/products-photos/${product.title}.webp`}
                                        title={product.title}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6">
                                            {product.title}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        ))}
                    </Slider>
                </Container>
            </div>

            {/* Секція відгуків */}
            <div className={classes.reviewsSection}>
                <Container>
                    <Typography variant="h4" className={classes.reviewsTitle}>
                        Відгуки наших клієнтів
                    </Typography>
                    <Grid container spacing={3}>
                        {reviews.map((review, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card className={classes.reviewCard}>
                                    <CardContent>
                                        <Typography variant="body1" className={classes.reviewText}>
                                            "{review.text}"
                                        </Typography>
                                        <Typography variant="body2" className={classes.reviewName}>
                                            {review.name}
                                        </Typography>
                                        <Typography variant="body2" className={classes.reviewRating}>
                                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </div>
        </div>
    );
}