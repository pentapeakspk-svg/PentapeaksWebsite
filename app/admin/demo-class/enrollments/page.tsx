"use client"

import { useState, useEffect } from "react"
import { Loader2, UserPlus, Calendar, Trash2 } from "lucide-react"

type Enrollment = {
  id: string
  name: string
  email: string
  phone: string
  address: string
  createdAt: string
}

export default function DemoClassEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchEnrollments()
  }, [])

  const fetchEnrollments = async () => {
    try {
      const res = await fetch("/api/demo-class/enroll")
      const data = await res.json()
      if (data.enrollments) {
        setEnrollments(data.enrollments)
      }
    } catch (error) {
      console.error("Failed to fetch enrollments", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enrollment?")) return
    
    try {
      const res = await fetch(`/api/demo-class/enroll/${id}`, {
        method: "DELETE"
      })
      if (res.ok) {
        setEnrollments(prev => prev.filter(e => e.id !== id))
      } else {
        alert("Failed to delete enrollment")
      }
    } catch (error) {
      console.error("Failed to delete enrollment", error)
      alert("Error deleting enrollment")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  if (isLoading) {
    return (
      <div className="p-6 sm:p-8 md:p-12 max-w-7xl mx-auto flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-6 sm:p-8 md:p-12 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-text-heading flex items-center gap-3">
          <UserPlus className="w-8 h-8 text-primary" />
          Demo Class Enrollments
        </h1>
        <p className="text-text-muted">View all students who have enrolled in the demo class.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-bg/50 text-text-muted uppercase font-semibold text-xs tracking-wider border-b border-border-light">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Address</th>
                <th className="px-6 py-4">Enrolled At</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {enrollments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-text-muted">
                    No enrollments found.
                  </td>
                </tr>
              ) : (
                enrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-gray-bg/30 transition-colors duration-150">
                    <td className="px-6 py-4 font-medium text-text-heading">
                      {enrollment.name}
                    </td>
                    <td className="px-6 py-4 text-text-body">
                      <div>{enrollment.email}</div>
                      <div className="text-text-muted">{enrollment.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-text-body">
                      {enrollment.address}
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(enrollment.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(enrollment.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Enrollment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
