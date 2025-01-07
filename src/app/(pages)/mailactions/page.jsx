"use client"
import PasswordResetComponent from "@/components/FirebaseEmails_Actions/PasswordResetComponent";
import VerifyEmailComponent from "@/components/FirebaseEmails_Actions/VerifyEmailComponent";
import { useSearchParams } from "next/navigation";

const ActionHandler = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const actionCode = searchParams.get("oobCode");

  if (mode === "verifyEmail") {
    // Handle email verification
    return <VerifyEmailComponent mode={mode} oobCode={actionCode} />;
  }

  if (mode === "resetPassword") {
    // Handle password reset
    return <PasswordResetComponent mode={mode} actionCode={actionCode} />;
  }

  return <div>Invalid action. Please check your link.</div>;
};

export default ActionHandler;
