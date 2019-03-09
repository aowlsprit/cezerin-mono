import OrdersService from '../services/orders/orders';

class OrdersRoute {
  constructor(router) {
    this.router = router;
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.post('/v1/stripe/sources/', async (req, res) => {
      const event = req.body;
      const {
        data: { object: source },
        type
      } = event;
      if (type === 'source.chargeable') {
        const {
          id: sourceId,
          metadata: { orderId }
        } = source;
        console.log(`Received chargeable source ${sourceId} for ${orderId}`);
        try {
          const isSuccess = await OrdersService.chargeOrderWithSource(orderId, sourceId);
          console.log('Charged');
          res.status(isSuccess ? 200 : 500).end();
        } catch (err) {
          res.status(500).end();
        }
      }
      if (type === 'source.failed') {
        console.log('Received failed source', source);
        res.status(200).end();
      }
      if (type === 'source.cancelled') {
        console.log('Received cancelled source', source);
        res.status(200).end();
      }
    });
  }
}

export default OrdersRoute;
