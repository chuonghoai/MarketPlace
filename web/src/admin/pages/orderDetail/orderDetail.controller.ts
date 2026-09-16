import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrderDetailStore } from './orderDetail.store';

export const useOrderDetailController = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const store = useOrderDetailStore();

    useEffect(() => {
        if (id) {
            store.fetchOrderDetail(id);
        }
        return () => {
            store.clearOrderDetail();
        };
    }, [id, store.fetchOrderDetail, store.clearOrderDetail]);

    const handleBack = () => {
        navigate('/admin/orders');
    };

    return {
        store,
        handleBack,
    };
};
