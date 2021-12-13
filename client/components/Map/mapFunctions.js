export function findZoom (markers){
    
    const markersLat = markers.map(marker => +marker.lat)
    const markersLng = markers.map(marker => +marker.lng)
    const maxDiffLat = Math.max(...markersLat) - Math.min(...markersLat)
    const maxDiffLng = Math.max(...markersLng) - Math.min(...markersLng)
    const maxDiff = Math.max(maxDiffLat, maxDiffLng)
    
    if (maxDiff > 75) return 2
    if (maxDiff > 30) return 3
    if (maxDiff > 14) return 4
    if (maxDiff > 10) return 5
    if (maxDiff > 4) return 6
    if (maxDiff > 3) return 7
    if (maxDiff > 1) return 8
    if (maxDiff > .4) return 9
    if (maxDiff > .30) return 10
    if (maxDiff > .14) return 11
    if (maxDiff > .07) return 12
    if (maxDiff > .04) return 13
    if (maxDiff > .03) return 14
    if (maxDiff > .01) return 15
    if (maxDiff > .005) return 16
    if (maxDiff >= 0) return 17
}
export function findCenter (markers){
    const lat = markers.reduce((accum, marker) => {
                accum += +marker.lat
                return accum
            }, 0) / markers.length
    
    const lng = markers.reduce((accum, marker) => {
            accum += +marker.lng
            return accum
        }, 0) / markers.length;
    console.log('lat', lat, 'lng', lng)
    const coords = { lat, lng}
    return coords
}