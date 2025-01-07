import { db } from "@/lib/FirebaseAdminSDK";

export async function POST(req) {
  try {
    const { userId, name, fatherName, email, phone, amount, dueDate } =
      await req.json();

    const challanID = `chdigi${Date.now()}${Math.floor(
      Math.random() * 10001
    )}`;

    // Save the challan data to Firestore
    await db.collection("challans").doc(challanID).set({
      challanID,
      userId,
      name,
      email,
      phone,
      amount,
      fatherName,
      dueDate,
      status: "pending",
      created_at: new Date(),
    });

    // Respond with success and the challan ID
    const response = {
      challanID:challanID,
      userId,
      name,
      email,
      phone,
      amount,
      fatherName,
      dueDate,
    };
    return new Response(
      JSON.stringify(response,{status:201}),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error while generating challan:", error);
    return new Response(
      JSON.stringify({ error: "Error while generating challan" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
