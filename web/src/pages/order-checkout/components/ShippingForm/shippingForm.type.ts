import type { PrepareCheckoutModel } from '../../../../features/order/checkout/models/checkout.model';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

export interface ShippingFormProps {
    address: PrepareCheckoutModel['address'] | null;
    onOpenAddressModal: () => void;
    onOpenAddNewAddressModal: () => void;
}

export const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});