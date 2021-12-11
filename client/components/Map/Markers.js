import React from 'react'
import { Marker } from "@react-google-maps/api";

export const handleFindMarker = (setSelected, markers, id) => {
    const marker = markers.find(marker => marker.id === id);
    setSelected(marker);
}

export const handleFindTrackingMarker = async (id, username, setSelectedUser, setOpenNoLocationAlert, trackingMarkers, setSelected) => {
    const trackingMarker = trackingMarkers.find(marker => marker.id === id);
    if (trackingMarker) {
        setSelected(trackingMarker)
    } else {
        await setSelectedUser(username)
        setOpenNoLocationAlert(true)
    }
}

export const DisplayMarkers = ({markers}) => {
    console.log('markers', markers)
    return markers.map((marker) => {
        return (
            <Marker
                key={marker.key}
                id={marker.id}
                position={{ lat: marker.lat, lng: marker.lng }}
                name={marker.name}
                icon={{ url: marker.url }}
                onClick={() => { setSelected(marker) }}
            />
        )
    })
}
export const DisplayTrackingMarkers = ({trackingMarkers}) => {
    console.log('trackingmarkers', trackingMarkers)
    return trackingMarkers.map((marker) => {
        return (
            <Marker
                key={marker.key}
                id={marker.id}
                position={{ lat: marker.lat, lng: marker.lng }}
                name={marker.name}
                onClick={() => { setSelected(marker) }}
                icon={{
                    url: '/person.svg',

                }}
            />
        )
    })
}
