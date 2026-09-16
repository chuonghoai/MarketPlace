import React, { useRef, useEffect } from 'react';
import { Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';

interface Props {
    position: [number, number];
    onDragEnd: (e: L.LeafletEvent) => void;
}

export const DraggableMarker: React.FC<Props> = ({ position, onDragEnd }) => {
    const markerRef = useRef<L.Marker>(null);
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.setView(position, 16, { animate: true, duration: 0.5 });
        }
    }, [position, map]);

    return (
        <Marker
            draggable={true}
            eventHandlers={{ dragend: onDragEnd }}
            position={position}
            ref={markerRef}
        >
            <Tooltip direction="top" offset={[0, -40]} permanent>
                <span className="font-body-sm font-medium">Kéo thả để chọn chính xác</span>
            </Tooltip>
        </Marker>
    );
};