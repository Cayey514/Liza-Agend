"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Mail, GraduationCap, Calendar, Target, BookOpen, Award, User } from "lucide-react"
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
          <CardContent className="text-center py-8 md:py-12 px-4">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="h-10 w-10 md:h-12 md:w-12 text-white" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">¡Crea tu perfil!</h2>
            <p className="text-gray-600 mb-6 text-sm md:text-base max-w-md mx-auto">
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
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                {profile.avatar ? (
                  <img
                    src={profile.avatar || "/placeholder.svg"}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-2xl md:text-3xl font-bold">
                    {profile.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="text-center sm:text-left min-w-0 flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 truncate">{profile.name}</h1>
                <p className="text-lg text-gray-600 mt-1 truncate">{profile.career}</p>
                {profile.university && <p className="text-gray-500 truncate">{profile.university}</p>}
                {profile.bio && (
                  <p className="text-gray-700 mt-2 text-sm md:text-base line-clamp-3 sm:max-w-md">{profile.bio}</p>
                )}
              </div>
            </div>
            <Button onClick={onEditProfile} variant="outline" className="w-full sm:w-auto flex-shrink-0 bg-transparent">
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
            <CardTitle className="flex items-center text-base md:text-lg">
              <GraduationCap className="h-5 w-5 mr-2 text-purple-600" />
              Información Académica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-gray-700 text-sm md:text-base truncate">{profile.email || "No especificado"}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-gray-700 text-sm md:text-base">
                Semestre: {profile.semester || "No especificado"}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Award className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-gray-700 text-sm md:text-base">
                Horas de estudio semanales: {profile.studyHours}h
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-gray-700 text-sm md:text-base">
                Género: {profile.gender === "female" ? "Femenino" : profile.gender === "male" ? "Masculino" : "Otro"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base md:text-lg">
              <Target className="h-5 w-5 mr-2 text-green-600" />
              Mis Metas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile.goals.length === 0 ? (
              <p className="text-gray-500 text-center py-4 text-sm">No has establecido metas aún</p>
            ) : (
              <div className="space-y-2">
                {profile.goals.map((goal, index) => (
                  <div key={index} className="flex items-start space-x-2 p-2 bg-green-50 rounded-lg">
                    <Target className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm md:text-base line-clamp-2">{goal}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Favorite Subjects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base md:text-lg">
              <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
              Materias Favoritas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile.favoriteSubjects.length === 0 ? (
              <p className="text-gray-500 text-center py-4 text-sm">No has seleccionado materias favoritas</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.favoriteSubjects.map((subject, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
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
            <CardTitle className="flex items-center text-base md:text-lg">
              <Award className="h-5 w-5 mr-2 text-yellow-600" />
              Estadísticas de Estudio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm md:text-base">Horas totales esta semana</span>
              <span className="font-bold text-yellow-600 text-sm md:text-base">{profile.studyHours}h</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm md:text-base">Promedio diario</span>
              <span className="font-bold text-yellow-600 text-sm md:text-base">
                {Math.round((profile.studyHours / 7) * 10) / 10}h
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm md:text-base">Materias activas</span>
              <span className="font-bold text-yellow-600 text-sm md:text-base">{profile.favoriteSubjects.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
