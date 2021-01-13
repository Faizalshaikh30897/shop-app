export default class CartItem {
  constructor(
    public quantity: number,
    public productTitle: string,
    public productPrice: number,
    public sum: number
  ) {}
}
