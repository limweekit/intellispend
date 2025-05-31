import '../globals.css'
import { AuthContextProvider } from "@/context/AuthContext";
import { LoadingProvider } from "@/context/LoadingContext";
import Spinner from "@/components/Spinner";

export const metadata = {
  title: "Login - IntelliSpend",
  description: "Track and manage your personal expenses",
};


export default function RootLayout({ children }) {
    return (
      <AuthContextProvider>
        <LoadingProvider>
          <Spinner />
            <main className="flex-grow min-h-screen flex flex-col items-center justify-center">
              {children}
            </main>
        </LoadingProvider>
      </AuthContextProvider>
    )
}