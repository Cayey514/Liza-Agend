"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Palette } from "lucide-react"
import { useTheme } from "next-themes"
import type { UserProfile } from "../page"

interface ThemeCustomizerProps {
  profile: UserProfile
  setProfile: (profile: UserProfile) => void
  onClose: () => void
}

export function ThemeCustomizer({ profile, setProfile, onClose }: ThemeCustomizerProps) {
  const { theme, setTheme } = useTheme()

  const themes = [
    { id: "light", name: "Claro", preview: "bg-white border-gray-200" },
    { id: "dark", name: "Oscuro", preview: "bg-gray-900 border-gray-700" },
    { id: "system", name: "Sistema", preview: "bg-gradient-to-r from-white to-gray-900" },
  ]

  const accentColors = [
    { id: "default", name: "Púrpura-Rosa", preview: "bg-gradient-to-r from-purple-500 to-pink-500" },
    { id: "blue", name: "Azul", preview: "bg-gradient-to-r from-blue-500 to-cyan-500" },
    { id: "green", name: "Verde", preview: "bg-gradient-to-r from-green-500 to-emerald-500" },
    { id: "orange", name: "Naranja", preview: "bg-gradient-to-r from-orange-500 to-red-500" },
    { id: "violet", name: "Violeta", preview: "bg-gradient-to-r from-violet-500 to-purple-500" },
  ]

  const updateNotifications = (enabled: boolean) => {
    setProfile({ ...profile, notifications: enabled })
  }

  const updateThemeColor = (colorId: string) => {
    setProfile({ ...profile, theme: colorId })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Personalización
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          \
