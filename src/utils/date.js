
export const formatDate = (dateString) => {
    const date = new Date(dateString.replace(" ", "T"));
    return date.toLocaleString();
}