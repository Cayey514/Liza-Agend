"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Mail, GraduationCap, Calendar, Target, BookOpen, Award } from "lucide-react"
import type { UserProfile } from "../page"

interface ProfileViewProps {
  profile: UserProfile
  onEditProfile: () => void
}

export function ProfileView({ profile, onEditProfile }: ProfileViewProps) {
  if (!profile.name) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Crea tu perfil!</h2>
            <p className="text-gray-600 mb-6">
              Personaliza tu experiencia en Liza-Agenda completando tu información personal
            </p>
            <Button onClick={onEditProfile} className="bg-gradient-to-r from-purple-600 to-pink-600">
              <Edit className="h-4 w-4 mr-2" />
              Crear Mi Perfil
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                {profile.avatar ? (
                  <img
                    src={profile.avatar || "/placeholder.svg"}
                    alt={profile.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-3xl font-bold">{profile.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                <p className="text-lg text-gray-600 mt-1">{profile.career}</p>
                <p className="text-gray-500">{profile.university}</p>
                {profile.bio && <p className="text-gray-700 mt-2 max-w-md">{profile.bio}</p>}
              </div>
            </div>
            <Button onClick={onEditProfile} variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Editar Perfil
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="h-5 w-5 mr-2 text-purple-600" />
              Información Académica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">{profile.email || "No especificado"}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">Semestre: {profile.semester || "No especificado"}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Award className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">Horas de estudio semanales: {profile.studyHours}h</span>
            </div>
          </CardContent>
        </Card>

        {/* Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-green-600" />
              Mis Metas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile.goals.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No has establecido metas aún</p>
            ) : (
              <div className="space-y-2">
                {profile.goals.map((goal, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                    <Target className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700">{goal}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Favorite Subjects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
              Materias Favoritas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile.favoriteSubjects.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No has seleccionado materias favoritas</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.favoriteSubjects.map((subject, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                    {subject}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Study Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-yellow-600" />
              Estadísticas de Estudio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Horas totales esta semana</span>
              <span className="font-bold text-yellow-600">{profile.studyHours}h</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Promedio diario</span>
              <span className="font-bold text-yellow-600">{Math.round((profile.studyHours / 7) * 10) / 10}h</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Materias activas</span>
              <span className="font-bold text-yellow-600">{profile.favoriteSubjects.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
