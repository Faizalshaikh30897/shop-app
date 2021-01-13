import CartItemDetail from "./_CartItemDetail";

export default class Order {
  constructor(
    public id: string,
    public date: Date,
    public cartItems: CartItemDetail[],
    public totalAmount: number
  ) {}
}
