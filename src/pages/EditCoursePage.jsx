import { Link, useNavigate, useParams } from 'react-router-dom'
import CourseForm from '../components/CourseForm.jsx'

function EditCoursePage({ courses, onSave }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const course = courses.find((item) => item.id === id)

  if (!course) {
    return (
      <main className="course-page">
        <div className="course-page-inner course-not-found">
          <h1>Kursus tidak ditemukan</h1>
          <Link className="home-green-button" to="/">Kembali ke Homepage</Link>
        </div>
      </main>
    )
  }

  async function handleSave(courseData) {
    await onSave(course.id, courseData)
    navigate('/')
  }

  return (
    <main className="course-page">
      <div className="course-page-inner">
        <header className="course-page-header">
          <h1>Edit Kursus</h1>
        </header>
        <CourseForm
          key={course.id}
          course={course}
          onSave={handleSave}
          onCancel={() => navigate('/')}
        />
      </div>
    </main>
  )
}

export default EditCoursePage
