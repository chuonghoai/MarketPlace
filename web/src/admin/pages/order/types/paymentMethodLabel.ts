import { EPaymentMethod } from '../../../../features/order/enums/paymentMethod.enum';

export const PAYMENT_METHOD_LABEL: Record<string, string> = {
    [EPaymentMethod.COD]: 'Thanh toán khi nhận hàng (COD)',
    [EPaymentMethod.MOMO]: 'Thanh toán qua MoMo',
};
