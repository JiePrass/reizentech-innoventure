/* eslint-disable */
interface ElectronicPayload {
  device_name: string;
  device_type: string;
  power_watts: number;
  user_id: number;
}

interface ResponseData {
  status: string;
  data?: any;
  message: string;
}

export async function PostElectricityTracker(payload: ElectronicPayload): Promise<ResponseData> {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/carbon/electronics",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("authtoken"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    // if (!res.ok) {
    //   throw new Error("Gagal menambahkan data elektronik");
    // }

    return await res.text();
  } catch (err: unknown) {
    let message = "Terjadi kesalahan";
    if (err instanceof Error) {
      message = err.message;
    }
    return { status: "error", message };
  }
}
