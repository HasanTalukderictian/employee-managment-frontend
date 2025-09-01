// services/designationService.js
export const deleteDesignation = async (BASE_URL, id, token) => {
    const response = await fetch(`${BASE_URL}/api/del-desi/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) throw new Error("Delete failed");
    return true;
};
