import { Suspense } from "react";
import MasterPasswordPage from "./masterPassPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MasterPasswordPage />
    </Suspense>
  );
}