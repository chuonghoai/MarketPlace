import { useState, useEffect } from 'react';
import { Marker, Tooltip, useMap } from 'react-leaflet';

export const useShippingController = (initialLat: number, initialLng: number) => {
    const [position, setPosition] = useState<[number, number]>([initialLat, initialLng]);

    useEffect(() => {
        setPosition([initialLat, initialLng]);
    }, [initialLat, initialLng]);

    return {
        position,
        setPosition
    };
};

export const LocationSelector = ({
    position,
}: {
    position: [number, number];
}) => {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.setView(position, map.getZoom(), {
                animate: true,
                duration: 0.5
            });
        }
    }, [position, map]);

    return (
        <Marker position={position}>
            <Tooltip permanent direction="top" offset={[0, -40]}>
                Vị trí giao hàng
            </Tooltip>
        </Marker>
    );
};