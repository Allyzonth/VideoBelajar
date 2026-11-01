import { useEffect, useRef, useState } from 'react'

const categories = ['Bisnis', 'Desain', 'Pemasaran', 'Pengembangan Diri', 'Digital & Teknologi']
const emptyCourse = {
  imageAlt: '',
  imageTitle: '',
  category: '',
  title: '',
  description: '',
  initials: '',
  avatarClass: 'avatar-one',
  instructor: '',
  role: '',
  rating: '',
  reviews: '',
  price: '',
}
const supportedImageTypes = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
}
const maximumImageSize = 5 * 1024 * 1024

function CourseForm({ course, onSave, onCancel }) {
  const [formData, setFormData] = useState(() => ({
    ...emptyCourse,
    ...course,
    imageTitle: course?.imageTitle?.join('\n') ?? emptyCourse.imageTitle,
  }))
  const [imagePreview, setImagePreview] = useState(course?.image ?? '')
  const [selectedImage, setSelectedImage] = useState(null)
  const [imageError, setImageError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const imageInput = useRef(null)
  const previewUrl = useRef(null)

  useEffect(() => () => {
    if (previewUrl.current) {
      URL.revokeObjectURL(previewUrl.current)
    }
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((currentData) => ({ ...currentData, [name]: value }))
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const extension = file.name.split('.').pop()?.toLowerCase()
    const expectedType = supportedImageTypes[extension]
    const isValidType = expectedType && (!file.type || file.type === expectedType)

    if (!isValidType) {
      setImageError('Pilih gambar JPG, JPEG, PNG, atau WEBP.')
      event.target.value = ''
      return
    }

    if (file.size > maximumImageSize) {
      setImageError('Ukuran gambar maksimal 5 MB.')
      event.target.value = ''
      return
    }

    if (previewUrl.current) {
      URL.revokeObjectURL(previewUrl.current)
    }

    const imageUrl = URL.createObjectURL(file)
    previewUrl.current = imageUrl
    setSelectedImage(file)
    setImagePreview(imageUrl)
    setImageError('')
  }

  function clearImageSelection() {
    if (previewUrl.current) {
      URL.revokeObjectURL(previewUrl.current)
      previewUrl.current = null
    }

    setSelectedImage(null)
    setImagePreview(course?.image ?? '')
    setImageError('')

    if (imageInput.current) {
      imageInput.current.value = ''
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!imagePreview) {
      setImageError('Pilih gambar untuk kursus ini.')
      return
    }

    if (imageError) {
      return
    }

    const courseFields = { ...formData }
    delete courseFields.id
    delete courseFields.image
    delete courseFields.imageStorageKey

    setIsSaving(true)
    setSaveError('')

    try {
      await onSave({
        ...courseFields,
        imageTitle: formData.imageTitle.split('\n').map((line) => line.trim()).filter(Boolean),
        imageFile: selectedImage,
      })
    } catch (error) {
      setSaveError(error.message || 'Kursus gagal disimpan. Coba lagi.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="course-form" aria-label={course ? 'Form edit kursus' : 'Form tambah kursus'}>
      <form onSubmit={handleSubmit}>
        <div className="course-form-grid">
          <label className="course-form-field">
            <span>Judul kursus</span>
            <input name="title" value={formData.title} onChange={handleChange} required />
          </label>
          <label className="course-form-field">
            <span>Kategori</span>
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="" disabled>Pilih kategori</option>
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>
          </label>
          <label className="course-form-field course-form-field-wide">
            <span>Deskripsi</span>
            <textarea name="description" value={formData.description} onChange={handleChange} required />
          </label>
          <div className="course-form-field course-form-field-wide course-image-field">
            <label htmlFor="course-image-upload">Gambar kursus</label>
            <input
              ref={imageInput}
              id="course-image-upload"
              type="file"
              accept="image/*"
              required={!course && !imagePreview}
              aria-describedby={imageError ? 'course-image-error' : undefined}
              onChange={handleImageChange}
            />
            {imageError && <span className="course-image-error" id="course-image-error" role="alert">{imageError}</span>}
            {imagePreview && (
              <div className="course-image-preview">
                <img src={imagePreview} alt="Preview gambar kursus" />
                <button className="course-form-cancel" type="button" onClick={clearImageSelection}>
                  Hapus pilihan
                </button>
              </div>
            )}
          </div>
          <label className="course-form-field">
            <span>Teks alternatif gambar</span>
            <input name="imageAlt" value={formData.imageAlt} onChange={handleChange} required />
          </label>
          <label className="course-form-field">
            <span>Judul pada gambar, satu baris per teks</span>
            <textarea name="imageTitle" value={formData.imageTitle} onChange={handleChange} required />
          </label>
          <label className="course-form-field">
            <span>Nama instruktur</span>
            <input name="instructor" value={formData.instructor} onChange={handleChange} required />
          </label>
          <label className="course-form-field">
            <span>Jabatan instruktur</span>
            <input name="role" value={formData.role} onChange={handleChange} required />
          </label>
          <label className="course-form-field">
            <span>Inisial instruktur</span>
            <input name="initials" value={formData.initials} onChange={handleChange} maxLength={3} required />
          </label>
          <label className="course-form-field">
            <span>Rating</span>
            <input name="rating" type="number" min="0" max="5" step="0.1" value={formData.rating} onChange={handleChange} required />
          </label>
          <label className="course-form-field">
            <span>Jumlah ulasan</span>
            <input name="reviews" type="number" min="0" step="1" value={formData.reviews} onChange={handleChange} required />
          </label>
          <label className="course-form-field">
            <span>Harga</span>
            <input name="price" value={formData.price} onChange={handleChange} placeholder="Rp 250K" required />
          </label>
        </div>
        {saveError && <p className="course-image-error" role="alert">{saveError}</p>}
        <div className="course-form-actions">
          <button className="course-form-cancel" type="button" onClick={onCancel} disabled={isSaving}>
            Batal
          </button>
          <button className="course-add-button" type="submit" disabled={isSaving}>
            {isSaving ? 'Menyimpan...' : course ? 'Simpan Perubahan' : 'Simpan Kursus'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default CourseForm