import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useNavigate, useLocation } from "react-router-dom"
import { 
  IconUser, 
  IconPhone, 
  IconMail, 
  IconTrash, 
  IconAlertTriangle, 
  IconCheck, 
  IconChevronLeft,
  IconLogout,
  IconLock
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { profileApi } from "@/api/profile.api"
import { authApi } from "@/api/auth.api"
import { eraseCookie } from "@/lib/cookies"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const profileSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  phone: z.string().optional().or(z.literal("")),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfilePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, setUser } = useAppStore()
  
  const [apiError, setApiError] = useState<string | null>(null)
  const [apiSuccess, setApiSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", phone: "" },
  })

  // Set default values when user is loaded
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        phone: user.phone || "",
      })
    }
  }, [user, reset])

  const onUpdateProfile = async (data: ProfileFormValues) => {
    if (!user) return
    setIsLoading(true)
    setApiError(null)
    setApiSuccess(null)
    try {
      const updated = await profileApi.updateProfile({
        name: data.name,
        phone: data.phone || undefined,
      })
      setUser({
        ...user,
        name: updated.name,
        phone: updated.phone,
      })
      setApiSuccess("Profile updated successfully!")
    } catch (err: any) {
      setApiError(err.response?.data?.message || "Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch {
      // Ignore logout errors
    } finally {
      eraseCookie("tsb_customer_token")
      setUser(null)
      navigate("/")
    }
  }

  const handleDeleteAccount = async () => {
    setIsLoading(true)
    setApiError(null)
    try {
      await profileApi.deleteAccount()
      eraseCookie("tsb_customer_token")
      setUser(null)
      setShowDeleteDialog(false)
      navigate("/")
    } catch (err: any) {
      setApiError(err.response?.data?.message || "Failed to delete account. Please try again.")
      setShowDeleteDialog(false)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] p-4 text-center">
        <div className="space-y-4 max-w-xs">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <IconLock size={26} />
          </div>
          <h2 className="text-xl font-bold font-heading">Access Denied</h2>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Please log in or create an account to view and manage your profile details.
          </p>
          <Button 
            onClick={() => navigate("/auth", { state: { from: location.pathname + location.search } })} 
            className="w-full bg-primary hover:bg-primary/95 text-white rounded-xl py-5 shadow-md cursor-pointer"
          >
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen pb-16 bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-border/85 z-20 p-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-9 w-9 rounded-full">
          <IconChevronLeft size={20} />
        </Button>
        <div>
          <h2 className="text-base font-bold font-heading tracking-tight">Your Profile</h2>
          <p className="text-xs text-muted-foreground">Manage your credentials and details</p>
        </div>
      </div>

      <div className="p-4 space-y-6 max-w-md mx-auto w-full">
        {/* Info Alerts */}
        {apiError && (
          <div className="flex items-center gap-2 p-3 text-xs bg-destructive/10 text-destructive border border-destructive/20 rounded-xl">
            <IconAlertTriangle size={16} className="shrink-0" />
            <span>{apiError}</span>
          </div>
        )}
        
        {apiSuccess && (
          <div className="flex items-center gap-2 p-3 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-xl">
            <IconCheck size={16} className="shrink-0" />
            <span>{apiSuccess}</span>
          </div>
        )}

        {/* Update Profile Card */}
        <Card className="border border-border/80 shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-bold">Personal Details</CardTitle>
            <CardDescription className="text-xs">Update your display name and contact phone number.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-4">
              <div className="space-y-1.5 opacity-70">
                <Label className="text-xs font-semibold">Email Address</Label>
                <div className="relative">
                  <IconMail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    disabled
                    value={user.email || ""}
                    className="pl-10 rounded-xl bg-muted/30 border-border/60 cursor-not-allowed text-xs"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground pl-1">Email address cannot be changed.</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold">Full Name</Label>
                <div className="relative">
                  <IconUser size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    disabled={isLoading}
                    className="pl-10 rounded-xl bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary/50 text-xs"
                    {...register("name")}
                  />
                </div>
                {errors.name && (
                  <p className="text-[11px] text-destructive font-medium pl-1">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-semibold">Phone Number</Label>
                <div className="relative">
                  <IconPhone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    placeholder="+91 9876543210"
                    disabled={isLoading}
                    className="pl-10 rounded-xl bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary/50 text-xs"
                    {...register("phone")}
                  />
                </div>
                {errors.phone && (
                  <p className="text-[11px] text-destructive font-medium pl-1">{errors.phone.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/95 text-white font-semibold py-4 rounded-xl shadow-sm text-xs cursor-pointer"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone / Logout */}
        <div className="space-y-3">
          <Button 
            variant="outline" 
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full border-border/85 hover:bg-muted text-muted-foreground hover:text-foreground font-semibold py-4 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <IconLogout size={16} />
            Sign Out
          </Button>

          <Card className="border border-destructive/20 shadow-sm bg-destructive/[0.02]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-destructive flex items-center gap-1.5">
                <IconAlertTriangle size={16} /> Danger Zone
              </CardTitle>
              <CardDescription className="text-xs">Permanently remove your account and all associated order history.</CardDescription>
            </CardHeader>
            <CardFooter className="pt-0">
              <Button 
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isLoading}
                className="w-full py-4 rounded-xl text-xs flex items-center justify-center gap-1.5 font-semibold cursor-pointer shadow-sm"
              >
                <IconTrash size={16} />
                Delete Account
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-1.5 text-destructive font-bold font-heading">
              <IconAlertTriangle size={18} /> Delete Account?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-2">
              Are you absolutely sure you want to delete your account? This action is permanent and cannot be undone. All active sessions, past orders, and saved data will be soft-deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-2 mt-4">
            <Button
              variant="outline"
              disabled={isLoading}
              onClick={() => setShowDeleteDialog(false)}
              className="flex-1 rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isLoading}
              onClick={handleDeleteAccount}
              className="flex-1 rounded-xl text-xs"
            >
              {isLoading ? "Deleting..." : "Yes, Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
