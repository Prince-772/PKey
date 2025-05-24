const VaultLayout = ({ children, passwords }) => {
  return (
    <div className="mt-20">
      
      {passwords}
      {children}
    </div>
  );
};
export default VaultLayout;

export const metadata = {
  title: "Vault - PKey",
  description: "Access, add, edit, and manage your encrypted passwords in your personal vault.",
  keywords: [
    "password vault",
    "encrypted passwords",
    "password manager",
    "manage passwords",
    "PKey vault",
    "secure password storage"
  ],
};
