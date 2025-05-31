import Spinner from "@/components/Spinner";
import {LoadingProvider} from "@/context/LoadingContext";
import {AuthContextProvider} from "@/context/AuthContext";


export const metadata = {
  title: "Profile - IntelliSpend",
  description: "Track and manage your personal expenses",
};

export default function ProfileLayout({ children }) {
  return (
      <AuthContextProvider>
        <LoadingProvider>
          <Spinner />
            <main className="min-h-full bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-60">
              {children}
            </main>
        </LoadingProvider>
      </AuthContextProvider>
  );
}

