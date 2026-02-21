let prices=[250,645,300,900,50];
let dicount=0.1;
for (let i=0;i<prices.length;i++){
    let discountedPrice=prices[i]-(prices[i]*dicount);
    console.log("DISCOUNTED PRICE IS: " + discountedPrice);
}     