/* eslint-disable */

export async function UpdateElectricityTracker(id: number, payload: any) {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `/api/carbon/electronics/${id}`,
      {
        method: "PUT",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("authtoken"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    // if (!res.ok) throw new Error("Gagal update device");
    return await res.json();
  } catch (err) {
    console.error("Update error:", err);
    throw err;
  }
}
