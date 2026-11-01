const coursesStorageKey = 'videobelajar:courses'
const databaseName = 'videobelajar'
const imageStoreName = 'course-images'

export function getSavedCourses() {
  try {
    const savedCourses = localStorage.getItem(coursesStorageKey)
    const parsedCourses = savedCourses ? JSON.parse(savedCourses) : null
    return Array.isArray(parsedCourses) ? parsedCourses : null
  } catch {
    return null
  }
}

export function saveCourses(courses) {
  const storedCourses = courses.map((course) => {
    const { image, ...courseData } = course

    if (course.imageStorageKey || image?.startsWith('blob:')) {
      return courseData
    }

    return { ...courseData, image }
  })

  localStorage.setItem(coursesStorageKey, JSON.stringify(storedCourses))
}

export function createUniqueId(prefix, existingIds = []) {
  let id

  do {
    const randomId = globalThis.crypto?.randomUUID?.()
      ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
    id = `${prefix}-${randomId}`
  } while (existingIds.includes(id))

  return id
}

function openImageDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1)

    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(imageStoreName)) {
        request.result.createObjectStore(imageStoreName)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function runImageTransaction(mode, action) {
  const database = await openImageDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(imageStoreName, mode)
    const request = action(transaction.objectStore(imageStoreName))
    let result

    if (request) {
      request.onsuccess = () => {
        result = request.result
      }
    }

    transaction.oncomplete = () => {
      database.close()
      resolve(result)
    }
    transaction.onerror = () => {
      database.close()
      reject(transaction.error)
    }
    transaction.onabort = () => {
      database.close()
      reject(transaction.error)
    }
  })
}

export function saveCourseImage(key, file) {
  return runImageTransaction('readwrite', (store) => store.put(file, key))
}

export function loadCourseImage(key) {
  return runImageTransaction('readonly', (store) => store.get(key))
}

export function deleteCourseImage(key) {
  return runImageTransaction('readwrite', (store) => store.delete(key))
}
