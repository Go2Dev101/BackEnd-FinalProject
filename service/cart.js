export const calculateCart = (cart, shippingFee = 0) => {
  const totalAmount = cart.items.reduce(
    (sum, item) => sum + item.menuId.price * item.quantity,
    0
  );

  const grandTotal = totalAmount + shippingFee;

  return {
    _id: cart._id,
    items: cart.items.map((item) => ({
      _id: item._id,
      menuId: item.menuId._id,
      name: item.menuId.title,
      imageUrl: item.menuId.imageUrl,
      price: item.menuId.price,
      quantity: item.quantity,
      deliveryDate: item.deliveryDate,
    })),
    totalItems: cart.items.length,
    totalAmount,
    shippingFee,
    grandTotal,
  };
};
