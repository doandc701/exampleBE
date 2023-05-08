function Cart(cart: any) {
  const items = cart.items || {};
  let totalItems = cart.totalItems || 0;
  let totalPrice = cart.totalPrice || 0;
  let size = cart.size;
  // console.log(cart);

   const add = function (item: any, id: string) {
    let cartItem = items[id];
    if (!cartItem) {
      cartItem = items[id] = { item: item, quantity: 0, price: 0 };
    }
    cartItem.quantity++;
    cartItem.price = cartItem.item.price * cartItem.quantity;
    totalItems++;
    totalPrice += parseInt(cartItem.item.price);
    let size = cartItem.item.size;
    //console.log(cartItem.size);
  };
  const getItems = function () {
    const arr = [];
    for (let id in items) {
      arr.push(items[id]);
    }
    // console.log("arr",arr);
    return arr;
  };
}

export default Cart;
