import { IsEnum, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { EOrderStatus } from '../../checkout/enums/EOrderStatus.enum';
import { EPaymentMethod } from '../../checkout/enums/EPaymentMethod.enum';
import { EPaymentStatus } from '../../checkout/enums/EPaymentStatus.enum';
import { EOrderReturnType, EOrderReturnStatus } from '../enums/order-return.enum';

export enum EOrderTrackingFilterStatus {
  ALL = 'ALL',
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  SUCCESS = 'SUCCESS',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
}

export class GetOrdersFilterDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (!value || typeof value !== 'string' || value.trim() === '') {
      return undefined;
    }
    return value.trim().toUpperCase();
  })
  @IsEnum(EOrderTrackingFilterStatus, {
    message:
      'status must be one of the following values: ALL, PENDING, PREPARING, SHIPPING, DELIVERED, SUCCESS, CANCELLED, RETURNED',
  })
  status?: EOrderTrackingFilterStatus;
}

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsEnum(EOrderStatus)
  status: EOrderStatus;

  @IsOptional()
  @IsString()
  note?: string;
}

export class UserUpdateOrderStatusDto {
  @IsNotEmpty()
  @IsEnum(EOrderStatus)
  newStatus: EOrderStatus;

  @IsOptional()
  @IsString()
  note?: string;
}

export class OrderListItemDto {
  id: string;
  createdAt: Date;
  orderStatus: EOrderStatus;
  totalAmount: number;
  totalProductQuantity: number;
  firstProductImageUrl: string;
  firstProductName: string;
  buyerName: string;
  buyerAddress: string;
  buyerPhone: string;
  paymentMethod: EPaymentMethod;
  paymentStatus: EPaymentStatus;
  statusHistory?: any;
}

export class OrderStatusHistoryDto {
  status: EOrderStatus;
  timestamp: Date;
  note?: string;
}

export class OrderDetailProductItemDto {
  orderItemId: string;
  productId: string;
  productName: string;
  productImageUrl: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  quantity: number;
  amount: number;
  isReviewed?: boolean;
}

export class OrderDetailVoucherDto {
  voucherCode: string;
  discountAmount: number;
  voucherSnapshot: any;
}

export class OrderReturnRequestDetailDto {
  id: string;
  orderId: string;
  type: EOrderReturnType;
  status: EOrderReturnStatus;
  title: string;
  reason: string;
  proofImages: string[];
  proofVideos: string[];
  bankName?: string | null;
  bankAccountNumber?: string | null;
  bankAccountHolder?: string | null;
  refundProofUrl?: string | null;
  adminNote?: string | null;
  createdAt: Date;
}

export class OrderDetailDto {
  id: string;
  createdAt: Date;
  statusHistory: OrderStatusHistoryDto[];
  orderStatus: EOrderStatus;
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
  latitude: number;
  longitude: number;
  items: OrderDetailProductItemDto[];
  subTotal: number;
  shippingFee: number;
  discountAmount?: number;
  shippingDiscountAmount?: number;
  vouchers?: OrderDetailVoucherDto[];
  totalAmount: number;
  paymentMethod: EPaymentMethod;
  paymentStatus: EPaymentStatus;
  cancelReason?: string;
  returnStatus?: EOrderReturnStatus;
  newOrderId?: string;
  returnRequest?: OrderReturnRequestDetailDto;
}
