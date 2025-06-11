import React from 'react';

const sneakersData = [
  {
    id: 1,
    text: "Перед покупкою впевніться, що взуття добре сидить на нозі та не тисне.",
    img: "/SneakerSection/1.jpg",  // так підключаємо з public
  },
  {
    id: 2,
    text: "Обирайте взуття з дихаючих матеріалів для комфорту протягом усього дня.",
    img: "/SneakerSection/2.jpg", 
  },
  {
    id: 3,
    text: "Враховуйте стиль життя — для активних щоденних прогулянок краще підходять кросівки з амортизацією.",
    img: "/SneakerSection/3.jpg", 
  },
];

const SneakerSection = () => {
  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto"}}>
      {sneakersData.map((item, index) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            flexDirection: index % 2 === 0 ? "row" : "row-reverse",
            alignItems: "center",
            marginBottom: "40px",
            flexWrap: "wrap",  
            gap: "20px",
            background:"#1e1e1e",
            padding: "5px",
            borderRadius: "10px",
          }}
        >
          <div style={{ flex: "1 1 300px", padding: "20px" }}>
            <p style={{ 
                fontSize: "30px",
                lineHeight: "1.4", 
                color: "#9E9E9E",
                textAlign: index % 2 === 0 ? "left" : "right",
                fontFamily: "'Ancizar Serif', serif",
                }}>
              {item.text}
            </p>
          </div>
          <div
            style={{
              flex: "1 1 300px",
              padding: "20px",
              maxWidth: "300px",
              maxHeight: "300px",
              overflow: "hidden",
              borderRadius: "8px",
            }}
          >
            <img
              src={item.img}
              alt="Sneaker"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};


export default SneakerSection;
