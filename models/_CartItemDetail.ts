export default class CartItemDetail {
  constructor(
    public productId: string,
    public quantity: number,
    public productTitle: string,
    public productPrice: number,
    public sum: number,
    public productOwnerToken: string | null,
  
  ) {}
}
