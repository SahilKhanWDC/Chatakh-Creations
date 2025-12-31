import { SignUp } from "@clerk/clerk-react";

export default function Register() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Blur decorations */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent mb-2">
              Join Shikhar
            </h1>
            <p className="text-gray-300">Create your account and start shopping</p>
          </div>

          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent border-0 shadow-none",
                formButtonPrimary: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl py-3 transition-all duration-300",
                formFieldInput: "border-2 border-slate-600 rounded-xl px-4 py-3 focus:border-blue-400 bg-slate-900/50 text-white",
                footer: "hidden",
              },
            }}
          />
        </div>

        <p className="text-center text-gray-400 mt-6">
          Already have an account? <a href="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Sign in here</a>
        </p>
      </div>
    </div>
  );
}
