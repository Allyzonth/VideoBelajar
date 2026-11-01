import { useNavigate } from 'react-router-dom'
import CourseForm from '../components/CourseForm.jsx'

function NewCoursePage({ onSave }) {
  const navigate = useNavigate()

  async function handleSave(courseData) {
    await onSave(courseData)
    navigate('/')
  }

  return (
    <main className="course-page">
      <div className="course-page-inner">
        <header className="course-page-header">
          <h1>Tambah Kursus Baru</h1>
        </header>
        <CourseForm onSave={handleSave} onCancel={() => navigate('/')} />
      </div>
    </main>
  )
}

export default NewCoursePage
