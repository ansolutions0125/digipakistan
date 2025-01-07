import admin from "@/lib/FirebaseAdminSDK"; // Adjust the import to your Firebase Admin SDK setup

export async function DELETE(req) {
  try {
    // Parse the request body
    const body = await req.json();
    const { uids } = body;

    if (!Array.isArray(uids) || uids.length === 0) {
      return new Response(
        JSON.stringify({ message: "No user IDs provided." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const deletePromises = uids.map(async (uid) => {
      // Delete from Firebase Authentication
      await admin.auth().deleteUser(uid);
      // Delete user document from Firestore
      await admin.firestore().collection("users").doc(uid).delete();
    });

    await Promise.all(deletePromises);

    return new Response(
      JSON.stringify({ message: "Users deleted successfully." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error deleting users:", error);
    return new Response(
      JSON.stringify({ message: "Failed to delete users." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
