export default function getSafeProp(obj, prop) {
    if (!obj || obj == null) {
        return null;
    }
    return obj.hasOwnProperty(prop) && obj[prop] || null;
}