"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, BookOpen, Globe, Video, FileText, Star, ExternalLink, Check } from "lucide-react"
import type { Resource } from "../page"

interface ResourcesViewProps {
  resources: Resource[]
  setResources: (resources: Resource[]) => void
}

export function ResourcesView({ resources, setResources }: ResourcesViewProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterSubject, setFilterSubject] = useState("all")
  const [formData, setFormData] = useState({
    title: "",
    type: "book" as Resource["type"],
    url: "",
    description: "",
    subject: "",
    rating: 5,
  })

  const subjects = [...new Set(resources.map((resource) => resource.subject))].filter(Boolean)

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || resource.type === filterType
    const matchesSubject = filterSubject === "all" || resource.subject === filterSubject
    return matchesSearch && matchesType && matchesSubject
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.description.trim()) return

    if (editingResource) {
      setResources(
        resources.map((resource) =>
          resource.id === editingResource.id
            ? { ...formData, id: editingResource.id, completed: editingResource.completed }
            : resource,
        ),
      )
      setEditingResource(null)
    } else {
      const newResource: Resource = {
        ...formData,
        id: Date.now().toString(),
        completed: false,
      }
      setResources([...resources, newResource])
    }

    setFormData({
      title: "",
      type: "book",
      url: "",
      description: "",
      subject: "",
      rating: 5,
    })
    setShowForm(false)
  }

  const handleEdit = (resource: Resource) => {
    setFormData({
      title: resource.title,
      type: resource.type,
      url: resource.url || "",
      description: resource.description,
      subject: resource.subject,
      rating: resource.rating,
    })
    setEditingResource(resource)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setResources(resources.filter((resource) => resource.id !== id))
  }

  const toggleCompleted = (id: string) => {
    setResources(
      resources.map((resource) => (resource.id === id ? { ...resource, completed: !resource.completed } : resource)),
    )
  }

  const getTypeIcon = (type: Resource["type"]) => {
    switch (type) {
      case "book":
        return <BookOpen className="h-4 w-4" />
      case "website":
        return <Globe className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "document":
        return <FileText className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: Resource["type"]) => {
    switch (type) {
      case "book":
        return "Libro"
      case "website":
        return "Sitio Web"
      case "video":
        return "Video"
      case "document":
        return "Documento"
      case "other":
        return "Otro"
      default:
        return "Recurso"
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Recursos de Estudio</h2>
          <p className="text-gray-600 dark:text-gray-400">Organiza tus libros, videos y materiales de estudio</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Recurso
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar recursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Tipo de recurso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="book">Libros</SelectItem>
                <SelectItem value="website">Sitios Web</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="document">Documentos</SelectItem>
                <SelectItem value="other">Otros</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Materia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las materias</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {searchTerm || filterType !== "all" || filterSubject !== "all"
                    ? "No se encontraron recursos"
                    : "No hay recursos aún"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchTerm || filterType !== "all" || filterSubject !== "all"
                    ? "Intenta con otros filtros de búsqueda"
                    : "Comienza agregando tus primeros recursos de estudio"}
                </p>
                {!searchTerm && filterType === "all" && filterSubject === "all" && (
                  <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-purple-600 to-pink-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Primer Recurso
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredResources.map((resource) => (
            <Card
              key={resource.id}
              className={`group hover:shadow-lg transition-shadow ${resource.completed ? "opacity-75" : ""}`}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(resource.type)}
                    <Badge variant="outline">{getTypeLabel(resource.type)}</Badge>
                  </div>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleCompleted(resource.id)}
                      className={`h-8 w-8 p-0 ${resource.completed ? "text-green-600" : "text-gray-400"}`}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(resource)} className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(resource.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className={`text-lg line-clamp-2 ${resource.completed ? "line-through" : ""}`}>
                  {resource.title}
                </CardTitle>
                {resource.subject && (
                  <Badge variant="secondary" className="w-fit">
                    {resource.subject}
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">{resource.description}</p>

                <div className="flex items-center space-x-1">
                  {renderStars(resource.rating)}
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({resource.rating}/5)</span>
                </div>

                {resource.url && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => window.open(resource.url, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir Recurso
                  </Button>
                )}

                {resource.completed && (
                  <Badge
                    variant="outline"
                    className="w-full justify-center bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                  >
                    ✓ Completado
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <Card className="w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingResource ? "Editar Recurso" : "Agregar Recurso"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Nombre del recurso"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Tipo de Recurso</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: Resource["type"]) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="book">Libro</SelectItem>
                        <SelectItem value="website">Sitio Web</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="document">Documento</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="subject">Materia</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Ej: Matemáticas"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="url">URL (opcional)</Label>
                  <Input
                    id="url"
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://ejemplo.com"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descripción *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe el contenido y utilidad del recurso..."
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label>Calificación</Label>
                  <Select
                    value={formData.rating.toString()}
                    onValueChange={(value) => setFormData({ ...formData, rating: Number.parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">⭐ 1 estrella</SelectItem>
                      <SelectItem value="2">⭐⭐ 2 estrellas</SelectItem>
                      <SelectItem value="3">⭐⭐⭐ 3 estrellas</SelectItem>
                      <SelectItem value="4">⭐⭐⭐⭐ 4 estrellas</SelectItem>
                      <SelectItem value="5">⭐⭐⭐⭐⭐ 5 estrellas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingResource ? "Actualizar" : "Agregar"} Recurso
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setEditingResource(null)
                      setFormData({
                        title: "",
                        type: "book",
                        url: "",
                        description: "",
                        subject: "",
                        rating: 5,
                      })
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
