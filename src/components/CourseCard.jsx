function CourseCard({ course }) {
  return (
    <article className="home-course-card">
      <div className="home-thumb">
        <img className="course-image" src={course.image} alt={course.imageAlt} />
        <span>
          {course.imageTitle.map((line) => (
            <span className="home-thumb-line" key={line}>{line}</span>
          ))}
        </span>
      </div>
      <div className="home-card-content">
        <div className="home-card-category">{course.category}</div>
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        <div className="home-instructor">
          <span className={`home-instructor-avatar ${course.avatarClass}`}>{course.initials}</span>
          <span>
            <strong>{course.instructor}</strong>
            <small>{course.role}</small>
          </span>
        </div>
        <div className="home-card-bottom">
          <span className="home-rating">★ {course.rating} <small>({course.reviews})</small></span>
          <strong>{course.price}</strong>
        </div>
      </div>
    </article>
  )
}

export default CourseCard