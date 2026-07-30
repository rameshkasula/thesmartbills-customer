import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useNavigate, useLocation } from "react-router-dom"
import { 
  IconMail, 
  IconUser, 
  IconPhone, 
  IconKey, 
  IconArrowLeft, 
  IconAlertCircle, 
  IconCheck
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { authApi } from "@/api/auth.api"
import { setCookie } from "@/lib/cookies"

// Zod schemas
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
})

const registerSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().optional().or(z.literal("")),
})

const otpSchema = z.object({
  code: z.string().length(6, "OTP must be exactly 6 digits").regex(/^\d+$/, "OTP must contain only numbers"),
})

type LoginFormValues = z.infer<typeof loginSchema>
type RegisterFormValues = z.infer<typeof registerSchema>
type OtpFormValues = z.infer<typeof otpSchema>

export function AuthPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const setUser = useAppStore((state) => state.setUser)
  
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const [step, setStep] = useState<"request" | "verify">("request")
  const [activeEmail, setActiveEmail] = useState("")
  const [apiError, setApiError] = useState<string | null>(null)
  const [apiSuccess, setApiSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Redirect path
  const from = (location.state as any)?.from || "/checkout"

  // React Hook Forms
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "" },
  })

  const {
    register: registerReg,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: regErrors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", phone: "" },
  })

  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: "" },
  })

  // Handlers
  const onSendOtp = async (data: LoginFormValues) => {
    setIsLoading(true)
    setApiError(null)
    setApiSuccess(null)
    try {
      await authApi.sendOtp(data.email)
      setActiveEmail(data.email)
      setApiSuccess(`Verification OTP sent to ${data.email}`)
      setStep("verify")
    } catch (err: any) {
      setApiError(err.response?.data?.message || "Failed to send OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const onRegister = async (data: RegisterFormValues) => {
    setIsLoading(true)
    setApiError(null)
    setApiSuccess(null)
    try {
      await authApi.register({
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
      })
      await authApi.sendOtp(data.email)
      setActiveEmail(data.email)
      setApiSuccess("Registration successful! OTP sent to your email.")
      setStep("verify")
    } catch (err: any) {
      setApiError(err.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const onVerifyOtp = async (data: OtpFormValues) => {
    setIsLoading(true)
    setApiError(null)
    try {
      const response = await authApi.verifyOtp(activeEmail, data.code)
      setCookie("tsb_customer_token", response.accessToken, 7)
      setUser({
        id: response.customer.id,
        name: response.customer.name,
        email: response.customer.email,
        phone: response.customer.phone,
      })
      setApiSuccess("Login successful!")
      setTimeout(() => {
        navigate(from)
      }, 1000)
    } catch (err: any) {
      setApiError(err.response?.data?.message || "Invalid OTP. Please check and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        
        {step === "verify" && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setStep("request")} 
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer -ml-2"
          >
            <IconArrowLeft size={16} />
            Back to email entry
          </Button>
        )}

        <Card className="border border-border/80 shadow-lg bg-card/65 backdrop-blur-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold font-heading">
              {step === "verify" ? "Enter OTP Code" : authMode === "login" ? "Sign In" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-xs">
              {step === "verify" 
                ? `We sent a 6-digit OTP to ${activeEmail}`
                : authMode === "login" 
                  ? "Access your Smart Bills digital dining dashboard." 
                  : "Sign up to place orders and track bill summaries."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Notifications */}
            {apiError && (
              <div className="flex items-center gap-2 p-3 text-xs bg-destructive/10 text-destructive border border-destructive/20 rounded-xl animate-fade-in">
                <IconAlertCircle size={16} className="shrink-0" />
                <span>{apiError}</span>
              </div>
            )}
            
            {apiSuccess && (
              <div className="flex items-center gap-2 p-3 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-xl animate-fade-in">
                <IconCheck size={16} className="shrink-0" />
                <span>{apiSuccess}</span>
              </div>
            )}

            {/* REQUEST STEP */}
            {step === "request" && (
              <>
                {/* Tabs */}
                <div className="grid grid-cols-2 bg-secondary p-1 rounded-xl gap-1 mb-2">
                  <button
                    onClick={() => {
                      setAuthMode("login")
                      setApiError(null)
                    }}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                      authMode === "login" 
                        ? "bg-background text-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground cursor-pointer animate-fade-in"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode("register")
                      setApiError(null)
                    }}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                      authMode === "register" 
                        ? "bg-background text-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground cursor-pointer animate-fade-in"
                    }`}
                  >
                    Register
                  </button>
                </div>

                {authMode === "login" ? (
                  <form onSubmit={handleLoginSubmit(onSendOtp)} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-semibold">Email Address</Label>
                      <div className="relative">
                        <IconMail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          className="pl-10 rounded-xl bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary/50"
                          disabled={isLoading}
                          {...registerLogin("email")}
                        />
                      </div>
                      {loginErrors.email && (
                        <p className="text-[11px] text-destructive font-medium pl-1">{loginErrors.email.message}</p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isLoading} 
                      className="w-full bg-primary hover:bg-primary/95 text-white font-semibold py-5 rounded-xl shadow-md cursor-pointer active:scale-[0.98]"
                    >
                      {isLoading ? "Sending OTP..." : "Get OTP Code"}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="regName" className="text-xs font-semibold">Full Name</Label>
                      <div className="relative">
                        <IconUser size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="regName"
                          placeholder="e.g. John Doe"
                          className="pl-10 rounded-xl bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary/50"
                          disabled={isLoading}
                          {...registerReg("name")}
                        />
                      </div>
                      {regErrors.name && (
                        <p className="text-[11px] text-destructive font-medium pl-1">{regErrors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="regEmail" className="text-xs font-semibold">Email Address</Label>
                      <div className="relative">
                        <IconMail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="regEmail"
                          type="email"
                          placeholder="your.email@example.com"
                          className="pl-10 rounded-xl bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary/50"
                          disabled={isLoading}
                          {...registerReg("email")}
                        />
                      </div>
                      {regErrors.email && (
                        <p className="text-[11px] text-destructive font-medium pl-1">{regErrors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="regPhone" className="text-xs font-semibold">Phone Number <span className="text-[10px] text-muted-foreground font-normal">(Optional)</span></Label>
                      <div className="relative">
                        <IconPhone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="regPhone"
                          placeholder="e.g. +91 9876543210"
                          className="pl-10 rounded-xl bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary/50"
                          disabled={isLoading}
                          {...registerReg("phone")}
                        />
                      </div>
                      {regErrors.phone && (
                        <p className="text-[11px] text-destructive font-medium pl-1">{regErrors.phone.message}</p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isLoading} 
                      className="w-full bg-primary hover:bg-primary/95 text-white font-semibold py-5 rounded-xl shadow-md cursor-pointer active:scale-[0.98]"
                    >
                      {isLoading ? "Creating account..." : "Sign Up & Get OTP"}
                    </Button>
                  </form>
                )}
              </>
            )}

            {/* VERIFY STEP */}
            {step === "verify" && (
              <form onSubmit={handleOtpSubmit(onVerifyOtp)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="otpCode" className="text-xs font-semibold">Enter 6-Digit Code</Label>
                  <div className="relative">
                    <IconKey size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="otpCode"
                      placeholder="e.g. 123456"
                      maxLength={6}
                      className="pl-10 text-center tracking-widest font-bold text-lg rounded-xl bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary/50"
                      disabled={isLoading}
                      {...registerOtp("code")}
                    />
                  </div>
                  {otpErrors.code && (
                    <p className="text-[11px] text-destructive font-medium pl-1 text-center">{otpErrors.code.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full bg-primary hover:bg-primary/95 text-white font-semibold py-5 rounded-xl shadow-md cursor-pointer active:scale-[0.98]"
                >
                  {isLoading ? "Verifying..." : "Verify & Log In"}
                </Button>

                <div className="text-center pt-2">
                  <span className="text-[11px] text-muted-foreground">Didn't receive the email? </span>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => onSendOtp({ email: activeEmail })}
                    className="text-[11px] text-primary hover:underline font-bold cursor-pointer bg-transparent border-0 p-0"
                  >
                    Resend Code
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
