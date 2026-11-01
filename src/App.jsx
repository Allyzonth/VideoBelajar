import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Homepage from './pages/Homepage.jsx'
import NewCoursePage from './pages/NewCoursePage.jsx'
import EditCoursePage from './pages/EditCoursePage.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import { courses as initialCourses } from './data/courses.js'
import {
  createUniqueId,
  deleteCourseImage,
  getSavedCourses,
  loadCourseImage,
  saveCourseImage,
  saveCourses,
} from './data/courseStorage.js'

function AppRoutes() {
  const [courseList, setCourseList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const imageUrls = useRef(new Set())

  useEffect(() => {
    let isActive = true
    const activeImageUrls = imageUrls.current

    async function loadCourses() {
      const savedCourses = getSavedCourses()
      const coursesToLoad = savedCourses ?? initialCourses
      const loadedCourses = await Promise.all(coursesToLoad.map(async (course) => {
        if (!course.imageStorageKey) {
          return course
        }

        try {
          const imageFile = await loadCourseImage(course.imageStorageKey)

          if (!imageFile) {
            return {
              ...course,
              image: '/assets/images/financial-analysis.jpg',
              imageStorageKey: undefined,
            }
          }

          if (!isActive) {
            return course
          }

          const imageUrl = URL.createObjectURL(imageFile)
          activeImageUrls.add(imageUrl)
          return { ...course, image: imageUrl }
        } catch {
          return {
            ...course,
            image: '/assets/images/financial-analysis.jpg',
            imageStorageKey: undefined,
          }
        }
      }))

      if (!isActive) {
        return
      }

      try {
        saveCourses(loadedCourses)
      } catch {
        // Keep the loaded list available if browser storage is blocked.
      }

      setCourseList(loadedCourses)
      setIsLoading(false)
    }

    loadCourses().catch(() => {
      if (isActive) {
        setCourseList(initialCourses)
        setIsLoading(false)
      }
    })

    return () => {
      isActive = false
      for (const imageUrl of activeImageUrls) {
        URL.revokeObjectURL(imageUrl)
      }
      activeImageUrls.clear()
    }
  }, [])

  function releaseImageUrl(imageUrl) {
    if (imageUrl?.startsWith('blob:') && imageUrls.current.has(imageUrl)) {
      URL.revokeObjectURL(imageUrl)
      imageUrls.current.delete(imageUrl)
    }
  }

  async function createCourse(courseData) {
    const { imageFile, ...courseFields } = courseData
    const courseId = createUniqueId('course', courseList.map((course) => course.id))
    let imageStorageKey
    let imageUrl

    try {
      if (imageFile) {
        imageStorageKey = createUniqueId(
          'course-image',
          courseList.map((course) => course.imageStorageKey).filter(Boolean),
        )
        await saveCourseImage(imageStorageKey, imageFile)
        imageUrl = URL.createObjectURL(imageFile)
        imageUrls.current.add(imageUrl)
      }

      const newCourse = { ...courseFields, id: courseId, image: imageUrl, imageStorageKey }
      const nextCourses = [...courseList, newCourse]
      saveCourses(nextCourses)
      setCourseList(nextCourses)
    } catch (error) {
      releaseImageUrl(imageUrl)
      if (imageStorageKey) {
        await deleteCourseImage(imageStorageKey).catch(() => {})
      }
      throw error
    }
  }

  async function updateCourse(courseId, courseData) {
    const currentCourse = courseList.find((course) => course.id === courseId)

    if (!currentCourse) {
      throw new Error('Kursus tidak ditemukan.')
    }

    const { imageFile, ...courseFields } = courseData
    let newImageStorageKey
    let newImageUrl

    try {
      if (imageFile) {
        newImageStorageKey = createUniqueId(
          'course-image',
          courseList.map((course) => course.imageStorageKey).filter(Boolean),
        )
        await saveCourseImage(newImageStorageKey, imageFile)
        newImageUrl = URL.createObjectURL(imageFile)
        imageUrls.current.add(newImageUrl)
      }

      const updatedCourse = {
        ...currentCourse,
        ...courseFields,
        id: currentCourse.id,
        image: newImageUrl ?? currentCourse.image,
        imageStorageKey: newImageStorageKey ?? currentCourse.imageStorageKey,
      }
      const nextCourses = courseList.map((course) => (
        course.id === courseId ? updatedCourse : course
      ))

      saveCourses(nextCourses)
      setCourseList(nextCourses)
    } catch (error) {
      releaseImageUrl(newImageUrl)
      if (newImageStorageKey) {
        await deleteCourseImage(newImageStorageKey).catch(() => {})
      }
      throw error
    }

    if (imageFile) {
      releaseImageUrl(currentCourse.image)
      const imageStillUsed = courseList.some((course) => (
        course.id !== courseId && course.imageStorageKey === currentCourse.imageStorageKey
      ))

      if (currentCourse.imageStorageKey && !imageStillUsed) {
        await deleteCourseImage(currentCourse.imageStorageKey).catch(() => {})
      }
    }
  }

  function removeCourse(courseId) {
    const course = courseList.find((item) => item.id === courseId)

    if (!course || !window.confirm(`Hapus kursus "${course.title}"?`)) {
      return
    }

    const nextCourses = courseList.filter((item) => item.id !== courseId)

    try {
      saveCourses(nextCourses)
    } catch {
      window.alert('Kursus tidak dapat dihapus dari penyimpanan browser.')
      return
    }

    setCourseList(nextCourses)
    releaseImageUrl(course.image)

    const imageStillUsed = nextCourses.some((item) => item.imageStorageKey === course.imageStorageKey)
    if (course.imageStorageKey && !imageStillUsed) {
      deleteCourseImage(course.imageStorageKey).catch(() => {})
    }
  }

  if (isLoading) {
    return <main className="course-page-loading">Memuat kursus...</main>
  }

  return (
    <Routes>
      <Route path="/" element={<Homepage courses={courseList} onDelete={removeCourse} />} />
      <Route path="/courses/new" element={<NewCoursePage onSave={createCourse} />} />
      <Route
        path="/courses/:id/edit"
        element={<EditCoursePage courses={courseList} onSave={updateCourse} />}
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
